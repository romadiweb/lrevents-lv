import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCmsIdentity } from "@/lib/supabase/auth-server";
import { AdminShell } from "@/components/admin/admin-shell";
import "@/components/admin/admin.css";
export const metadata = { title: "CMS — LR Events", robots: { index: false, follow: false } };
async function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  const identity = await getCmsIdentity();
  if (!identity) redirect("/login?denied=1");
  return <AdminShell name={`${identity.profile.first_name} ${identity.profile.last_name}`}>{children}</AdminShell>;
}
export default function AdminLayout({ children }: { children: React.ReactNode }) { return <Suspense fallback={<main className="cms-login"><p>Ielādē CMS…</p></main>}><ProtectedAdmin>{children}</ProtectedAdmin></Suspense>; }
