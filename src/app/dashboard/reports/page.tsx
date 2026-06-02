import { getReports } from "@/app/actions/reports";
import { auth } from "@/auth";
import ReportsClient from "./ReportsClient";

export default async function ReportsPage() {
  const session = await auth();
  const reports = await getReports();
  
  return <ReportsClient reports={reports} role={session?.user?.role || "STUDENT"} />;
}
