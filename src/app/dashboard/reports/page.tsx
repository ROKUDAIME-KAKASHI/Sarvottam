import { getReports } from "@/app/actions/reports";
import { auth } from "@/auth";
import ReportsClient from "./ReportsClient";

export default async function ReportsPage() {
  const session = await auth();
  const reports = await getReports();

  const mappedReports = reports.map((r) => ({
    ...r,
    content: null,
  }));

  return <ReportsClient reports={mappedReports} role={session?.user?.role || "STUDENT"} />;
}
