import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/app/actions/projects";
import ProjectList from "./ProjectList";
import CreateProjectForm from "./CreateProjectForm";
import { ComingSoon } from "@/components/coming-soon";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">Research</h2>
          <p className="text-muted-foreground font-medium">
            Manage and track your active academic-industry research nodes.
          </p>
        </div>

        <div className="flex gap-2">
          <CreateProjectForm />
        </div>
      </div>

      <ProjectList projects={projects} />
    </div>
  );
}
