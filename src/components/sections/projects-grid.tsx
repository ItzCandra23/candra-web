"use client";

import { ProjectCard } from "@/components/shared/project-card";
import getProjects from "@/lib/projects";
import { Project } from "@/types";
import { useEffect, useState } from "react";

export function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects().then((projects) => setProjects(projects));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}