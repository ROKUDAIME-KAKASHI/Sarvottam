"use server";

import { s3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/auth";

export async function getPresignedUploadUrl(fileName: string, contentType: string, maxSizeMB = 10) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Generate safe object key
  const extension = fileName.split(".").pop();
  const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const objectKey = `uploads/${session.user.id}/${Date.now()}-${safeName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME || "sarvottam-uploads",
    Key: objectKey,
    ContentType: contentType,
  });

  // URL valid for 5 minutes
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  return {
    signedUrl,
    objectKey,
    publicUrl: `${process.env.S3_PUBLIC_URL}/${objectKey}`,
  };
}
