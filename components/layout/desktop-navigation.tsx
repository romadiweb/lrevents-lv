"use client";
import Link from "next/link";
import * as Nav from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import { navigation } from "@/lib/navigation";
export function DesktopNavigation() {
  return (
    <Nav.Root
      className="desktop-nav"
      aria-label="Galvenā navigācija"
      delayDuration={100}
    >
      <Nav.List className="nav-list">
        {navigation.map((item) => (
          <Nav.Item className="nav-item" key={item.label}>
            {item.children ? (
              <>
                <Nav.Trigger className="nav-link">
                  {item.label}
                  <ChevronDown size={13} aria-hidden="true" />
                </Nav.Trigger>
                <Nav.Content className="nav-dropdown">
                  <ul>
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Nav.Link asChild>
                          <Link href={child.href}>{child.label}</Link>
                        </Nav.Link>
                      </li>
                    ))}
                  </ul>
                </Nav.Content>
              </>
            ) : (
              <Nav.Link asChild>
                <Link className="nav-link" href={item.href}>
                  {item.label}
                </Link>
              </Nav.Link>
            )}
          </Nav.Item>
        ))}
      </Nav.List>
    </Nav.Root>
  );
}

