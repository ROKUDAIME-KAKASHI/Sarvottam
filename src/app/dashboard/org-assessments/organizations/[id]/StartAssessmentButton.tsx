"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrgAssessment } from "@/lib/actions/org-assessment.actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function StartAssessmentButton({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const assessment = await createOrgAssessment({
        organizationId: orgId,
        title: `Assessment - ${new Date().getFullYear()}`,
        description: "Standard organizational health evaluation."
      });
      toast.success("Assessment initiated");
      router.push(`/dashboard/org-assessments/${assessment.id}`);
    } catch (error) {
      toast.error("Failed to start assessment");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleStart} disabled={loading}>
      {loading ? "Starting..." : "Initiate Assessment"}
    </Button>
  );
}
