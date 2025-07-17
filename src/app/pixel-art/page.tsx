"use client";

import { PixelArtCanvas } from "@/components/sections/pixel-art-canvas";
import { SectionTitle } from "@/components/shared/section-title";

export default function PixelArtPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <SectionTitle 
        title="Pixel Art Studio" 
        subtitle="Create pixel art with a simple drawing tool"
      />
      <PixelArtCanvas />
    </div>
  );
}