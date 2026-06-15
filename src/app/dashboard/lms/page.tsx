import { getCourses } from "@/lib/actions/lms.actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BookOpen, Users, Clock, PlayCircle } from "lucide-react";

export default async function LMSDashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const courses = await getCourses();

  const myEnrollments = courses.flatMap(c => 
    c.enrollments.filter(e => e.userId === session.user.id).map(e => ({ ...e, course: c }))
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Corporate Training & LMS</h2>
        {session.user.role === "SUPERADMIN" && (
          <div className="flex items-center space-x-2">
            <Button asChild>
              <Link href="/dashboard/lms/courses/new">Create Course</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Enrollments</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myEnrollments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myEnrollments.filter(e => e.status === "COMPLETED").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Course Catalog</CardTitle>
            <CardDescription>Browse available training modules and programs.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {courses.map(course => (
                <div key={course.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg gap-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-lg">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">{course.description || "No description provided."}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{course.type}</Badge>
                      <Badge variant="secondary">{course.level}</Badge>
                      {course.duration && <span className="text-xs text-muted-foreground flex items-center"><Clock className="w-3 h-3 mr-1"/> {course.duration} mins</span>}
                    </div>
                  </div>
                  <Button variant="default" asChild className="shrink-0">
                    <Link href={`/dashboard/lms/courses/${course.id}`}>View Details</Link>
                  </Button>
                </div>
              ))}
              {courses.length === 0 && <p className="text-muted-foreground">No courses available.</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>My Progress</CardTitle>
            <CardDescription>Resume your active enrollments.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {myEnrollments.map(enr => (
                <div key={enr.id} className="space-y-2 border-b pb-4 last:border-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{enr.course.title}</span>
                    <span className="text-xs text-muted-foreground">{enr.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${enr.progress}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <Badge variant={enr.status === "COMPLETED" ? "default" : "outline"} className="text-[10px]">
                      {enr.status}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/lms/courses/${enr.courseId}`}>Resume</Link>
                    </Button>
                  </div>
                </div>
              ))}
              {myEnrollments.length === 0 && <p className="text-muted-foreground text-sm">You are not enrolled in any courses.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
