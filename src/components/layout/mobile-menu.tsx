"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: Array<{ label: string; href: string }>;
}

export function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="fixed inset-0 z-50 bg-background">
        <nav className="flex flex-col space-y-4 p-4 bg-background">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="text-lg font-medium transition-colors hover:text-primary py-2"
            >
              {item.label}
            </Link>
          ))}
          <Button variant="outline" className="w-full mt-4" onClick={onClose}>Close</Button>
        </nav>
      </div>
    </div>
  );
}