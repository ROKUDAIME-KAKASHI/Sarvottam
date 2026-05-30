import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { FacultyDashboard } from "@/components/dashboard/faculty-dashboard";
import { IndustryDashboard } from "@/components/dashboard/industry-dashboard";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const role = session.user?.role;

  switch (role) {
    case "SUPERADMIN":
      return <AdminDashboard />;
    case "FACULTY":
      return <FacultyDashboard />;
    case "INDUSTRY_PARTNER":
      return <IndustryDashboard />;
    case "STUDENT":
    default:
      return <StudentDashboard />;
  }
}
