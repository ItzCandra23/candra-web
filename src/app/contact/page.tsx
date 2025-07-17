"use client";

import { ContactForm } from "@/components/sections/contact-form";
import { SectionTitle } from "@/components/shared/section-title";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <SectionTitle 
        title="Get In Touch" 
        subtitle="Let's discuss your next project"
      />
      <ContactForm />
    </div>
  );
}