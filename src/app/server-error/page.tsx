"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ServerCrash, Home, RefreshCw } from "lucide-react";

export default function ServerErrorPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6 animate-pulse">
            <ServerCrash className="h-16 w-16 text-destructive" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-muted-foreground">500</h1>
          <h2 className="text-2xl md:text-3xl font-semibold">Internal Server Error</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Our servers are having a moment. We're working hard to fix the issue. Please try again in a few minutes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2" size={16} />
              Back to Safety
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2" size={16} />
            Refresh Page
          </Button>
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-lg max-w-md mx-auto">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Tip:</span> If this problem persists, try clearing your browser cache or contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}