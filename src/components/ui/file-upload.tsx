"use client";

import { useState } from "react";
import { getPresignedUploadUrl } from "@/app/actions/upload";
import { Button } from "@/components/ui/button";
import { UploadCloud, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
}

export function FileUpload({
  onUploadSuccess,
  accept = "image/*,application/pdf",
  maxSizeMB = 10,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > maxSizeMB * 1024 * 1024) {
        toast.error(`File must be smaller than ${maxSizeMB}MB`);
        return;
      }
      setFile(selected);
      setStatus("idle");
      setProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setStatus("idle");

    try {
      // 1. Get presigned URL
      const { signedUrl, publicUrl } = await getPresignedUploadUrl(file.name, file.type, maxSizeMB);

      // 2. Upload file directly to S3/R2
      const res = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!res.ok) throw new Error("Failed to upload file");

      setStatus("success");
      onUploadSuccess(publicUrl);
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error(error);
      setStatus("error");
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-xl bg-background/50 backdrop-blur">
      <div className="flex items-center gap-4">
        <label className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
          <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
          <span className="text-sm font-medium">{file ? file.name : "Click to select a file"}</span>
          <span className="text-xs text-muted-foreground mt-1">Max size: {maxSizeMB}MB</span>
          <input type="file" accept={accept} className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {status === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
          {status === "error" && <XCircle className="h-5 w-5 text-red-500" />}
        </div>

        <Button
          onClick={handleUpload}
          disabled={!file || uploading || status === "success"}
          className="w-full sm:w-auto"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload"
          )}
        </Button>
      </div>
    </div>
  );
}
