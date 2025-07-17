"use client";

import { SectionTitle } from "@/components/shared/section-title";
import { Badge } from "@/components/ui/badge";

const skills = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "NestJS",
  "Laravel", "PHP", "MySQL", "PostgreSQL", "Prisma", "Tailwind CSS",
  "UI/UX Design", "Figma", "Solidity", "Motoko", "Azle", "Web3",
  "ICP", "Git", "Vite", "Minecraft Scripting API"
];

export function AboutContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <SectionTitle 
        title="About Me" 
        subtitle="Building experiences from code, design, and passion"
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-relaxed">
          I'm Candra, a freelance full-stack developer and UI/UX designer who’s still in high school. 
          I have strong experience in both frontend and backend development, allowing me to build 
          complete digital products from interface to infrastructure with clean code and practical design.
        </p>

        <p className="text-lg leading-relaxed">
          I regularly work with modern technologies like React, Next.js, TypeScript, NestJS, and Laravel. 
          I'm also deeply interested in Web3 — exploring and building with Solidity, Motoko, and Azle 
          for smart contracts and decentralized applications, especially on platforms like ICP.
        </p>

        <p className="text-lg leading-relaxed">
          In addition to web development, I'm an active Minecraft Bedrock addon developer focusing on scripting. 
          I enjoy extending the game’s capabilities with custom behaviors, mechanics, and interactive features 
          using JavaScript and the Minecraft Scripting API.
        </p>

        <p className="text-lg leading-relaxed">
          Outside of coding, I design user interfaces, explore product development, 
          and participate in competitions or side projects that combine creativity, logic, and user value.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Technical Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-sm">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Experience</h3>
        <div className="space-y-6">
          <div className="border-l-2 border-primary pl-4 space-y-2">
            <h4 className="font-semibold">Freelance Full Stack Developer</h4>
            <p className="text-sm text-muted-foreground">Self-employed • 2022 - Present</p>
            <p className="text-muted-foreground">
              Built and maintained websites and web applications for various clients. 
              Delivered both backend systems and responsive, user-friendly frontend designs.
            </p>
          </div>
          <div className="border-l-2 border-muted pl-4 space-y-2">
            <h4 className="font-semibold">UI/UX Designer & Product Developer</h4>
            <p className="text-sm text-muted-foreground">Independent Projects • 2021 - Present</p>
            <p className="text-muted-foreground">
              Created UI/UX for digital products, including SaaS dashboards, landing pages, and mobile-first interfaces. 
              Focused on user experience and clean design systems.
            </p>
          </div>
          <div className="border-l-2 border-muted pl-4 space-y-2">
            <h4 className="font-semibold">Minecraft Addon Developer</h4>
            <p className="text-sm text-muted-foreground">Personal Projects • 2020 - Present</p>
            <p className="text-muted-foreground">
              Developed custom Minecraft Bedrock addons using scripting API. 
              Focused on gameplay enhancements, new mechanics, and integrating systems 
              using JavaScript and real-time logic to expand the Minecraft experience.
            </p>
          </div>
          <div className="border-l-2 border-muted pl-4 space-y-2">
            <h4 className="font-semibold">Web3 & Smart Contract Developer</h4>
            <p className="text-sm text-muted-foreground">Hackathons & Experiments • 2023 - Present</p>
            <p className="text-muted-foreground">
              Built experimental dApps using Solidity, Azle, and Motoko. 
              Participated in Web3 competitions with ideas like Recycle-to-Earn and NFT ticketing systems 
              integrated with wallet and decentralized platforms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
