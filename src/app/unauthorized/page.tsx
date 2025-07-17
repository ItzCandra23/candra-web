"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, Home, LogIn } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <Lock className="h-16 w-16 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-muted-foreground">401</h1>
          <h2 className="text-2xl md:text-3xl font-semibold">Unauthorized Access</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            You need to be logged in to access this page. Please authenticate and try again.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/login">
              <LogIn className="mr-2" size={16} />
              Log In
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <Home className="mr-2" size={16} />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}