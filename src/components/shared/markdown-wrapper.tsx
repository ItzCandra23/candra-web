import React from "react";
import { Card } from "@/components/ui/card";
import { MarkdownContent } from "./markdown-content";
import { cn } from "@/lib/utils";

interface MarkdownWrapperProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "card" | "transparent";
  prose?: "sm" | "base" | "lg" | "xl" | "2xl";
}

export function MarkdownWrapper({ 
  children, 
  className,
  variant = "default",
  prose = "base"
}: MarkdownWrapperProps) {
  if (variant === "card") {
    return (
      <Card className={cn("p-6 md:p-8", className)}>
        <MarkdownContent prose={prose}>
          {children}
        </MarkdownContent>
      </Card>
    );
  }

  if (variant === "transparent") {
    return (
      <div className={cn("w-full", className)}>
        <MarkdownContent prose={prose}>
          {children}
        </MarkdownContent>
      </div>
    );
  }

  return (
    <div className={cn("bg-background rounded-lg p-6 md:p-8", className)}>
      <MarkdownContent prose={prose}>
        {children}
      </MarkdownContent>
    </div>
  );
}