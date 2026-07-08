import { getFrameworks } from "@/lib/actions/excellence.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function FrameworksPage() {
  const session = await auth();
  if (!session || session.user.role !== "SUPERADMIN") {
    redirect("/dashboard/excellence");
  }

  const frameworks = await getFrameworks();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Framework Management</h2>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/excellence/frameworks/new">
            <Button>Create Framework</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Excellence Frameworks</CardTitle>
          <CardDescription>
            Configure organizational excellence models, dimensions, and maturity levels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Dimensions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {frameworks.map((framework) => (
                <TableRow key={framework.id}>
                  <TableCell className="font-medium">{framework.name}</TableCell>
                  <TableCell>{framework.version || "1.0"}</TableCell>
                  <TableCell>{framework.dimensions.length} configured</TableCell>
                  <TableCell>{framework.isActive ? "Active" : "Inactive"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/excellence/frameworks/${framework.id}`}>Manage</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {frameworks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No frameworks found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
