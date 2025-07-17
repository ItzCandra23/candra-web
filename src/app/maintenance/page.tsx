"use client";

import { Button } from "@/components/ui/button";
import { Wrench, Bell, Twitter } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-6 animate-bounce">
            <Wrench className="h-16 w-16 text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">We'll be back soon!</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            We're performing scheduled maintenance to improve your experience. 
            We should be back online shortly.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-sm font-semibold mb-2">Estimated downtime:</p>
            <p className="text-2xl font-bold">2 hours</p>
            <p className="text-sm text-muted-foreground mt-1">
              Started at 10:00 AM UTC
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" asChild>
              <a 
                href="https://twitter.com/candraweb" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Twitter className="mr-2" size={16} />
                Follow Updates
              </a>
            </Button>
            <Button variant="outline" size="lg">
              <Bell className="mr-2" size={16} />
              Notify Me
            </Button>
          </div>
        </div>

        <div className="pt-8">
          <p className="text-sm text-muted-foreground">
            Need urgent assistance? Contact us at{" "}
            <a href="mailto:support@candraweb.com" className="text-primary hover:underline">
              support@candraweb.com
            </a>
          </p>
        </div>
      </div>

      {/* Animated background */}
      <div className="fixed inset-0 -z-10 h-full w-full">
        <div className="absolute h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>
    </div>
  );
}