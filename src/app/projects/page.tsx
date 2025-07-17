"use client";

import { ProjectsGrid } from "@/components/sections/projects-grid";
import { SectionTitle } from "@/components/shared/section-title";

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <SectionTitle 
        title="Projects" 
        subtitle="A collection of my recent work and side projects"
      />
      <ProjectsGrid />
    </div>
  );
}