"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldX, Home, ArrowLeft } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <ShieldX className="h-16 w-16 text-destructive" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-muted-foreground">403</h1>
          <h2 className="text-2xl md:text-3xl font-semibold">Access Forbidden</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Sorry, you don't have permission to access this resource. If you believe this is an error, please contact support.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2" size={16} />
              Go to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">
              <ArrowLeft className="mr-2" size={16} />
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}