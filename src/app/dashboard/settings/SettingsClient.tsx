"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileSettings, updatePassword } from "@/app/actions/settings";
import { useTransition, useState } from "react";

export default function SettingsClient({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateProfileSettings(formData);
      setMessage(res.error || "Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    });
  };

  const handlePasswordUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;
    startTransition(async () => {
      const res = await updatePassword(formData);
      setMessage(res.error || "Password updated successfully!");
      if (res.success) form.reset();
      setTimeout(() => setMessage(""), 3000);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences and configurations.</p>
      </div>

      {message && (
        <div className="p-3 bg-primary/10 text-primary font-medium rounded-md border border-primary/20">
          {message}
        </div>
      )}

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
                <Input name="skills" defaultValue={user.skills || ""} placeholder="React, Node.js, Python" />
              </div>
              <div className="space-y-2">
                <Label>Portfolio URL</Label>
                <Input name="portfolioUrl" defaultValue={user.portfolioUrl || ""} placeholder="https://github.com/..." />
              </div>
              <Button disabled={isPending} type="submit">Save Changes</Button>
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
              <Button disabled={isPending} type="submit" variant="destructive">Update Password</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
