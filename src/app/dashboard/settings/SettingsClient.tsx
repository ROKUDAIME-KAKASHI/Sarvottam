"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileSettings, updatePassword } from "@/app/actions/settings";
import { useTransition, useState } from "react";

export default function SettingsClient({
  user,
}: {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    skills?: string | null;
    portfolioUrl?: string | null;
  };
}) {
  const [isPending, startTransition] = useTransition();
  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      setProfileMessage(null);
      const res = await updateProfileSettings(formData);
      if (res.success) {
        setProfileMessage({ type: "success", text: "Changes saved" });
        setTimeout(() => setProfileMessage(null), 3000);
      } else {
        setProfileMessage({ type: "error", text: res.error || "Failed to save changes" });
      }
    });
  };

  const handlePasswordUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;
    startTransition(async () => {
      setPasswordMessage(null);
      const res = await updatePassword(formData);
      if (res.success) {
        setPasswordMessage({ type: "success", text: "Changes saved" });
        form.reset();
        setTimeout(() => setPasswordMessage(null), 3000);
      } else {
        setPasswordMessage({ type: "error", text: res.error || "Failed to save changes" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences and configurations.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Basic Information</CardTitle>
            </div>
            <CardDescription>Update your public profile details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input name="name" defaultValue={user.name || ""} placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <Label>Skills (Comma-separated)</Label>
                <Input
                  name="skills"
                  defaultValue={user.skills || ""}
                  placeholder="React, Node.js, Python"
                />
              </div>
              <div className="space-y-2">
                <Label>Portfolio URL</Label>
                <Input
                  name="portfolioUrl"
                  defaultValue={user.portfolioUrl || ""}
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="flex items-center gap-4">
                <Button disabled={isPending} type="submit">
                  Save Changes
                </Button>
                {profileMessage && (
                  <span
                    className={`text-sm font-medium ${profileMessage.type === "success" ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {profileMessage.text}
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Change your password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input required type="password" name="currentPassword" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input required type="password" name="newPassword" />
              </div>
              <div className="flex items-center gap-4">
                <Button disabled={isPending} type="submit" variant="destructive">
                  Update Password
                </Button>
                {passwordMessage && (
                  <span
                    className={`text-sm font-medium ${passwordMessage.type === "success" ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {passwordMessage.text}
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
