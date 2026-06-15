"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { ActionOverlay } from "@/components/action-overlay";

export function InviteUserButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="rounded-xl shadow-lg shadow-primary/20"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Invite User
      </Button>

      <ActionOverlay 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Invite New User"
        description="Are you sure you want to generate an invite link for a new user?"
        icon={<UserPlus className="h-8 w-8 ml-1" />}
        action={async () => {
          // This simulates a server action call with a delay
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return { success: true };
        }}
        confirmText="Yes, generate invite"
        loadingText="Generating invite link..."
        successMessage="Invite sent successfully!"
        themeColor="primary"
      />
    </>
  );
}
