"use client";

import { useTransition } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ActionButtonProps extends ButtonProps {
  action: () => Promise<{ success?: boolean; error?: string } | void>;
  successMessage?: string;
  errorMessage?: string;
}

export function ActionButton({ 
  action, 
  successMessage = "Action completed successfully", 
  errorMessage = "Something went wrong", 
  children,
  ...props 
}: ActionButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button 
      {...props} 
      disabled={isPending || props.disabled}
      onClick={() => {
        startTransition(async () => {
          try {
            const res = await action();
            if (res && res.error) {
              toast.error(res.error);
            } else if (res && res.success === false) {
              toast.error(errorMessage);
            } else {
              toast.success(successMessage);
            }
          } catch (e) {
            toast.error(errorMessage);
          }
        });
      }}
    >
      {isPending ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : null}
      {children}
    </Button>
  );
}
