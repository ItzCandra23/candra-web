"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <h3 className="text-xl font-semibold">{project.title}</h3>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <p className="text-muted-foreground">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.technologies?.map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {project.github && (
          <Button size="sm" variant="outline" asChild>
            <Link href={project.github} target="_blank" rel="noopener noreferrer">
              <Github size={16} className="mr-2" />
              { project.github_text || "Code"}
            </Link>
          </Button>
        )}
        {project.demo && (
          <Button size="sm" asChild>
            <Link href={project.demo} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} className="mr-2" />
              { project.demo_text || "Demo"}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}