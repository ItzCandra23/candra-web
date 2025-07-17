"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* 404 Number with gradient effect */}
        <div className="relative">
          <h1 className="text-[150px] md:text-[200px] font-bold leading-none text-muted-foreground/20">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-2xl md:text-3xl font-semibold">Page Not Found</p>
          </div>
        </div>

        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Oops! The page you're looking for seems to have vanished into the digital void.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2" size={16} />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/projects">
              <Search className="mr-2" size={16} />
              View Projects
            </Link>
          </Button>
        </div>

        {/* Decorative element */}
        <div className="pt-12">
          <div className="text-sm text-muted-foreground">
            Lost? Try these popular pages:
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link href="/" className="text-sm hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/projects" className="text-sm hover:text-primary transition-colors">
              Projects
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/about" className="text-sm hover:text-primary transition-colors">
              About
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/contact" className="text-sm hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 h-full w-full">
        <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
      </div>
    </div>
  );
}