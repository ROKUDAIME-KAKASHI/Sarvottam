"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

export async function getDocuments() {
  try {
    return await prisma.document.findMany({
      orderBy: { createdAt: "desc" },
      include: { project: true }
    });
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    return [];
  }
}

export async function uploadDocument(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };

  try {
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename to avoid collisions
    const fileExtension = path.extname(file.name);
    const fileNameWithoutExt = path.basename(file.name, fileExtension);
    const safeFileName = `${fileNameWithoutExt.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}${fileExtension}`;
    
    // Convert File to Buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadsDir, safeFileName);
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${safeFileName}`;

    const doc = await prisma.document.create({
      data: {
        name: file.name,
        url: fileUrl,
      }
    });

    revalidatePath("/dashboard/documents");
    return { success: true, document: doc };
  } catch (error) {
    console.error("Failed to upload document:", error);
    return { error: "Failed to upload document" };
  }
}
