export interface Project {
  id: string;
  title: string;
  description: string;
  technologies?: string[];
  github?: string;
  github_text?: string;
  demo?: string;
  demo_text?: string;
}