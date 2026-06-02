import { getDepartments } from "@/app/actions/departments";
import DepartmentsClient from "./DepartmentsClient";

export default async function DepartmentsPage() {
  const departments = await getDepartments();
  return <DepartmentsClient departments={departments} />;
}
