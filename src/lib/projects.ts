"use client";

import { Project } from "@/types";

export default async function getProjects(): Promise<Project[]> {
  const url = "https://raw.githubusercontent.com/ItzCandra23/candra-web/refs/heads/main/projects.json";

  try {
    const response = await fetch(url);
    if (!response.ok) return [];

    const data = await response.json();

    return data;
  } catch(err) {
    return [];
  }
}