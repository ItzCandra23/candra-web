"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Instagram, Linkedin } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Web Developer
            <span className="block text-muted-foreground">
              Building Modern Web Experiences
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {/* I craft scalable web applications with clean code and modern technologies. 
            Specialized in React, Next.js, and Node.js ecosystem. */}
            I build modern websites, dApps, and digital products using React, Next.js, NestJS, Solidity, 
            and Motoko — combining Web and Web3 into real-world experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/projects">
                View Projects
                <ArrowRight className="ml-2" size={16} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </div>

          <div className="flex justify-center space-x-4 pt-4">
            <a
              href="https://github.com/ItzCandra23"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/candra-aja"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="https://instagram.com/itzcandraa23"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-background">
        <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>
    </section>
  );
}