"use client";
import Link from "next/link";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation, registrationLink } from "@/lib/navigation";
import { SocialLinks } from "./social-links";
import "./mobile-navigation.css";
export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="mobile-trigger" aria-label="Atvērt izvēlni">
        <Menu size={24} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="menu-overlay" />
        <Dialog.Content className="mobile-menu" aria-describedby={undefined}>
          <div className="mobile-menu-heading">
            <Dialog.Title>Izvēlne</Dialog.Title>
            <Dialog.Close className="icon-button" aria-label="Aizvērt izvēlni">
              <X size={24} />
            </Dialog.Close>
          </div>
          <nav aria-label="Mobilā navigācija">
            <ul className="mobile-links">
              {navigation.map((item) => (
                <li key={item.label}>
                  {item.href ? <Link href={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                    <ArrowUpRight size={20} aria-hidden="true" />
                  </Link> : <span className="mobile-category">{item.label}</span>}
                  {item.children && (
                    <ul>
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            onClick={() => setOpen(false)}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div className="mobile-utilities">
              <SocialLinks />
            </div>
          </nav>
          <Link className="primary-button" href={registrationLink.href}>
            {registrationLink.label}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
