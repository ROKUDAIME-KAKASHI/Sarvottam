import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Book, CheckCircle, Video, PlayCircle } from "lucide-react";
import EnrollButton from "./EnrollButton";

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      modules: { include: { lessons: true } },
      enrollments: { where: { userId: session.user.id } },
      sessions: { include: { trainer: { include: { user: true } } } },
    },
  });

  if (!course) return <div className="p-8">Course not found.</div>;

  const enrollment = course.enrollments[0];
  const isEnrolled = !!enrollment;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-4 mb-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/lms">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{course.title}</h2>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline">{course.type}</Badge>
            <Badge variant="secondary">{course.level}</Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {course.description || "No detailed description available."}
              </p>
            </CardContent>
          </Card>

          <h3 className="text-xl font-bold mt-8 mb-4">Syllabus</h3>
          {course.modules.length > 0 ? (
            course.modules.map((mod) => (
              <Card key={mod.id} className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{mod.title}</CardTitle>
                  <CardDescription>{mod.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mt-2">
                    {mod.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3 border rounded-md"
                      >
                        <div className="flex items-center space-x-3">
                          {lesson.videoUrl ? (
                            <Video className="text-blue-500 w-5 h-5" />
                          ) : (
                            <Book className="text-orange-500 w-5 h-5" />
                          )}
                          <span className="font-medium">{lesson.title}</span>
                        </div>
                        {lesson.duration && (
                          <span className="text-xs text-muted-foreground">
                            {lesson.duration} mins
                          </span>
                        )}
                      </div>
                    ))}
                    {mod.lessons.length === 0 && (
                      <p className="text-sm text-muted-foreground italic">
                        No lessons in this module.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Syllabus is currently being built.
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrollment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEnrolled ? (
                <>
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">You are enrolled!</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href={`/dashboard/lms/courses/${course.id}/learn`}>
                      <PlayCircle className="w-4 h-4 mr-2" /> Continue Learning
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join this course to access the materials and track your progress.
                  </p>
                  <EnrollButton courseId={course.id} />
                </>
              )}
            </CardContent>
          </Card>

          {course.sessions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Live Sessions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {course.sessions.map((session) => (
                  <div key={session.id} className="border-b pb-2 last:border-0 text-sm">
                    <div className="font-medium">{session.title}</div>
                    <div className="text-muted-foreground text-xs mt-1">
                      {session.startDate.toLocaleDateString()} • {session.trainer.user.name}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
