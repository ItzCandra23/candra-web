"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, Instagram, Bot } from "lucide-react";

const pages = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const contacts = [
  { label: "me.nathancandra@gmail.com", href: "mailto:me.nathancandra@gmail.com", icon: Mail },
  { label: "+62 838 2058 7900", href: "tel:+6283820587900" },
];

const socials = [
  { label: "GitHub", href: "https://github.com/ItzCandra23", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/candra-aja/", icon: Linkedin },
  { label: "Instagram", href: "https://instagram.com/itzcandraa23", icon: Instagram },
  { label: "Discord", href: "http://discordapp.com/users/822266948607148042", icon: Bot },
];

export function Footer() {
  return (
    <footer className="w-full border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">CandraWeb</h3>
            <p className="text-sm text-muted-foreground">
              Building digital experiences with modern web technologies.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Pages</h4>
            <ul className="space-y-2">
              {pages.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Contact</h4>
            <ul className="space-y-2">
              {contacts.map((contact) => (
                <li key={contact.href}>
                  <a
                    href={contact.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    {contact.icon && <contact.icon size={14} />}
                    {contact.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Social</h4>
            <div className="flex space-x-4">
              {socials.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <social.icon size={20} />
                  <span className="sr-only">{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CandraWeb. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}