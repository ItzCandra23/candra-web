import React from "react";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  children: React.ReactNode;
  className?: string;
  prose?: "sm" | "base" | "lg" | "xl" | "2xl";
}

export function MarkdownContent({ 
  children, 
  className,
  prose = "base"
}: MarkdownContentProps) {
  const proseClasses = {
    sm: "prose-sm",
    base: "prose",
    lg: "prose-lg",
    xl: "prose-xl",
    "2xl": "prose-2xl"
  };

  return (
    <div 
      className={cn(
        "mx-auto w-full",
        proseClasses[prose],
        "prose-neutral dark:prose-invert",
        // Headings
        "prose-headings:font-bold",
        "prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4",
        "prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3",
        "prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-2",
        // Paragraphs
        "prose-p:text-muted-foreground prose-p:leading-7",
        "prose-p:mb-4",
        // Links
        "prose-a:text-primary prose-a:no-underline",
        "prose-a:hover:underline prose-a:transition-colors",
        // Strong
        "prose-strong:text-foreground prose-strong:font-semibold",
        // Lists
        "prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4",
        "prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4",
        "prose-li:text-muted-foreground prose-li:mb-2 prose-li:ml-0",
        "prose-ul:space-y-2",
        // Code
        "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5",
        "prose-code:rounded prose-code:text-sm",
        "prose-code:before:content-none prose-code:after:content-none",
        // Pre
        "prose-pre:bg-muted prose-pre:text-foreground",
        "prose-pre:overflow-x-auto prose-pre:rounded-lg",
        "prose-pre:p-4",
        // Blockquote
        "prose-blockquote:border-l-4 prose-blockquote:border-primary",
        "prose-blockquote:pl-4 prose-blockquote:italic",
        "prose-blockquote:text-muted-foreground",
        // Images
        "prose-img:rounded-lg prose-img:shadow-md",
        // Tables
        "prose-table:overflow-hidden prose-table:rounded-lg",
        "prose-th:bg-muted prose-th:px-4 prose-th:py-2",
        "prose-td:px-4 prose-td:py-2",
        "prose-thead:border-b-2 prose-thead:border-border",
        "prose-tbody:divide-y prose-tbody:divide-border",
        // HR
        "prose-hr:border-border prose-hr:my-8",
        // Max width
        "max-w-none",
        className
      )}
    >
      {children}
    </div>
  );
}