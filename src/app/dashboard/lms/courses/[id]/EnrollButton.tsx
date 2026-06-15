"use client";

import { useState } from "react";
import { enrollUser } from "@/lib/actions/lms.actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EnrollButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    try {
      await enrollUser(courseId);
      toast.success("Successfully enrolled in the course!");
    } catch (error) {
      toast.error("Failed to enroll");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button className="w-full" onClick={handleEnroll} disabled={loading}>
      {loading ? "Enrolling..." : "Enroll Now"}
    </Button>
  );
}
