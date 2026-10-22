"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { navigation, membershipLink } from "@/lib/navigation";
import { Brand } from "./brand";
import { SocialLinks } from "./social-links";
import { CookieSettings } from "./cookie-settings";
import { MembershipLink } from "./membership-link";
import "./mobile-navigation.css";

export function MobileNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  function changeOpen(next: boolean) {
    setOpen(next);
    if (next) setExpanded(navigation.find(item => item.children?.some(child => child.href === pathname))?.label ?? null);
  }
  return (
    <Dialog.Root open={open} onOpenChange={changeOpen}>
      <Dialog.Trigger className="mobile-trigger" aria-label="Atvērt izvēlni"><Menu size={24} /></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="menu-overlay mobile-menu-overlay" />
        <Dialog.Content className="mobile-menu" aria-describedby={undefined}>
          <div className="mobile-menu-heading">
            <div onClick={() => changeOpen(false)}><Brand /></div>
            <Dialog.Title className="sr-only">Galvenā izvēlne</Dialog.Title>
            <Dialog.Close className="mobile-menu-close" aria-label="Aizvērt izvēlni"><X size={22} strokeWidth={1.6} /></Dialog.Close>
          </div>
          <div className="mobile-menu-scroll">
            <nav className="mobile-menu-navigation" aria-label="Mobilā navigācija">
              <p className="mobile-menu-label">Izvēlne</p>
              <ul className="mobile-links">
                {navigation.map((item, index) => (
                  <li key={item.label}>
                    {item.children ? <>
                      <button className="mobile-nav-toggle" type="button" aria-expanded={expanded === item.label} aria-controls={`mobile-submenu-${index}`} onClick={() => setExpanded(expanded === item.label ? null : item.label)}>
                        {item.label}<ChevronDown size={14} strokeWidth={2} aria-hidden="true" />
                      </button>
                      <ul className="mobile-submenu" id={`mobile-submenu-${index}`} hidden={expanded !== item.label}>
                        {item.children.map(child => <li key={child.href}><Link href={child.href} aria-current={pathname === child.href ? "page" : undefined} onClick={() => changeOpen(false)}>{child.label}</Link></li>)}
                      </ul>
                    </> : <Link className="mobile-nav-direct" href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={() => changeOpen(false)}>{item.label}</Link>}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mobile-menu-bottom">
              <MembershipLink className="primary-button mobile-register" onClick={() => changeOpen(false)}>
                {membershipLink.label}
                <ArrowUpRight size={16} aria-hidden="true" />
              </MembershipLink>
              <SocialLinks />
              <p className="mobile-menu-copyright">© 2026 LR Events</p>
              <CookieSettings />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
