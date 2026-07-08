"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileText, Download, Upload, Image as ImageIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { uploadDocument } from "@/app/actions/documents";
import { useTransition, useRef } from "react";
import Link from "next/link";
import { toast } from "sonner";

export default function DocumentsClient({
  documents,
}: {
  documents: { id: string; name: string; url: string; createdAt: Date | string }[];
}) {
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const res = await uploadDocument(formData);
      if (res.success) {
        toast.success("File uploaded successfully!");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error(res.error || "Upload failed");
      }
    });
  };

  const getFileIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "gif") {
      return <ImageIcon className="h-5 w-5" />;
    }
    return <FileText className="h-5 w-5" />;
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-black tracking-tight text-foreground">Documents</h2>
          <p className="text-muted-foreground font-medium">
            Manage project files and research materials.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-2"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            disabled={isPending}
          />
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
            className="rounded-xl shadow-lg shadow-primary/20"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isPending ? "Uploading..." : "Upload File"}
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4"
      >
        <Card className="rounded-3xl border-border/50 bg-background/40 backdrop-blur-xl shadow-lg overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/50 p-4 px-6">
            <div className="grid grid-cols-12 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-8">File Name</div>
              <div className="col-span-3 text-right">Uploaded</div>
              <div className="col-span-1 text-right">Action</div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {documents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No documents uploaded yet.
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="grid grid-cols-12 items-center p-4 px-6 border-b border-border/10 hover:bg-muted/20 transition-colors group"
                >
                  <div className="col-span-8 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      {getFileIcon(doc.name)}
                    </div>
                    <span className="font-semibold text-sm truncate">{doc.name}</span>
                  </div>
                  <div className="col-span-3 text-right text-sm text-muted-foreground font-medium">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </div>
                  <div className="col-span-1 text-right">
                    <Link
                      href={doc.url}
                      target="_blank"
                      download
                      className={buttonVariants({
                        variant: "ghost",
                        size: "icon",
                        className: "h-8 w-8 text-muted-foreground group-hover:text-primary",
                      })}
                    >
                      <Download className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
