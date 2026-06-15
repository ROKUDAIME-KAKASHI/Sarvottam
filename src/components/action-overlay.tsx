"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ActionOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => Promise<{ success?: boolean; error?: string } | void>;
  confirmText: string;
  cancelText?: string;
  loadingText?: string;
  successMessage?: string;
  errorMessage?: string;
  themeColor?: "primary" | "red" | "emerald";
}

export function ActionOverlay({
  isOpen,
  onClose,
  title,
  description,
  icon,
  action,
  confirmText,
  cancelText = "Cancel",
  loadingText = "Processing...",
  successMessage = "Action completed successfully",
  errorMessage = "Something went wrong",
  themeColor = "primary"
}: ActionOverlayProps) {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const themeConfig = {
    primary: {
      bg: "bg-primary/10",
      text: "text-primary",
      ring: "ring-primary/20",
      button: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 hover:shadow-primary/40",
      blob1: "bg-primary/10",
      blob2: "bg-blue-500/10"
    },
    red: {
      bg: "bg-red-500/10",
      text: "text-red-500",
      ring: "ring-red-500/20",
      button: "bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-red-500/20 hover:shadow-red-500/40",
      blob1: "bg-red-500/10",
      blob2: "bg-orange-500/10"
    },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
      ring: "ring-emerald-500/20",
      button: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 hover:shadow-emerald-500/40",
      blob1: "bg-emerald-500/10",
      blob2: "bg-teal-500/10"
    }
  };

  const theme = themeConfig[themeColor];

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const res = await action();
        if (res && res.error) {
          toast.error(res.error);
          onClose();
        } else if (res && res.success === false) {
          toast.error(errorMessage);
          onClose();
        } else {
          toast.success(successMessage);
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
            onClose();
          }, 1500); // close after 1.5s showing success state
        }
      } catch (e) {
        toast.error(errorMessage);
        onClose();
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md overflow-hidden"
        >
          {/* Background decorations */}
          <div className={`absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-[100px] pointer-events-none ${theme.blob1}`} />
          <div className={`absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px] pointer-events-none ${theme.blob2}`} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
            className="w-full max-w-sm p-6 z-10"
          >
            <Card className="rounded-[2rem] border-border/50 bg-background/80 backdrop-blur-2xl shadow-2xl overflow-hidden relative">
              <CardHeader className="p-8 pb-6 text-center">
                <div className={`mx-auto mb-4 h-16 w-16 rounded-2xl flex items-center justify-center ring-1 ${theme.bg} ${theme.text} ${theme.ring} transition-all duration-300`}>
                  {isSuccess ? <CheckCircle2 className="h-8 w-8" /> : icon}
                </div>
                <CardTitle className="text-2xl font-black tracking-tight">
                  {isSuccess ? "Success!" : title}
                </CardTitle>
                <CardDescription className="text-sm font-medium mt-2">
                  {isSuccess ? successMessage : (isPending ? loadingText : description)}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-4">
                {!isSuccess && (
                  <>
                    <Button 
                      onClick={handleConfirm}
                      disabled={isPending}
                      className={`w-full p-6 text-base rounded-xl shadow-lg transition-all group ${theme.button}`}
                    >
                      {isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        confirmText
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={onClose}
                      className="w-full p-6 text-base rounded-xl bg-background border-border/50 hover:bg-muted/50 transition-all"
                      disabled={isPending}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {cancelText}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
