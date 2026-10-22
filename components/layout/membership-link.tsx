"use client";

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import { membershipLink } from "@/lib/navigation";
import { scrollToMembershipApplication } from "@/lib/membership-scroll";

export function MembershipLink({ children, className, onClick }: {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return <Link href={membershipLink.href} scroll={false} className={className} onClick={onClick} onNavigate={(event) => {
    // A mounted membership page will not run its entry effect again on a repeat click.
    if (window.location.pathname === "/biedrs") {
      event.preventDefault();
      if (window.location.hash !== "#pieteiksanas") window.history.pushState(null, "", membershipLink.href);
      void scrollToMembershipApplication();
    }
  }}>{children}</Link>;
}
