import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { StudentDashboard } from "@/components/features/dashboard/student-dashboard";
import { FacultyDashboard } from "@/components/features/dashboard/faculty-dashboard";
import { IndustryDashboard } from "@/components/features/dashboard/industry-dashboard";
import { AdminDashboard } from "@/components/features/dashboard/admin-dashboard";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function DashboardPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const session = await auth();
  if (!session) redirect("/login");

  const role = session.user?.role;

  switch (role) {
    case "SUPERADMIN":
      return <AdminDashboard searchParams={searchParams} />;
    case "FACULTY":
      return <FacultyDashboard />;
    case "INDUSTRY_PARTNER":
      return <IndustryDashboard />;
    case "STUDENT":
    default:
      return <StudentDashboard />;
  }
}
