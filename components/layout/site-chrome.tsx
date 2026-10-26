"use client";
import { usePathname } from "next/navigation";
import { CookieNotice } from "./cookie-notice";
export function SiteChrome({ children, header, footer, scroll }: { children: React.ReactNode; header: React.ReactNode; footer: React.ReactNode; scroll: React.ReactNode }) {
  const path = usePathname();
  if (path === "/login" || path.startsWith("/admin") || path.startsWith("/auth/")) return <>{children}</>;
  return <>{scroll}{header}{children}{footer}{path !== "/sikdatnu-iestatijumi" && <CookieNotice />}</>;
}
