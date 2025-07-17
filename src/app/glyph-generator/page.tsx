"use client";

import { GlyphGenerator } from "@/components/sections/glyph-generator";
import { SectionTitle } from "@/components/shared/section-title";

export default function GlyphGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <SectionTitle 
        title="Glyph Generator" 
        subtitle="Create custom font glyphs with pixel-perfect precision"
      />
      <GlyphGenerator />
    </div>
  );
}