"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UsersRound, Newspaper, Tags, Handshake, Files, CalendarDays, UserCog, Trophy, Flag, ListOrdered, Car, UserRound, ClipboardList, Timer, Layers, LogOut, ArrowUpRight, Images } from "lucide-react";
import { sections, type CmsSection } from "@/lib/cms/config";
import { createBrowserAuthClient } from "@/lib/supabase/browser";
import { RegistrationNotification } from "./registration-inbox";
const icons = { komanda: UsersRound, raksti: Newspaper, kategorijas: Tags, partneri: Handshake, dokumenti: Files, pasakumi: CalendarDays, lietotaji: UserCog, galerija: Images, sezonas: Trophy, posmi: Flag, klases: Layers, komandas: Car, dalibnieki: UserRound, starti: ClipboardList, rezultati: ListOrdered, braucieni: Timer };
export function AdminShell({ name, children }: { name: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  return <div className="cms-shell"><aside className="cms-sidebar"><Link href="/admin" className="cms-brand">LR Events <span>CMS</span></Link>
    <nav aria-label="CMS sadaļas"><Link href="/admin/pieteikumi" aria-current={pathname === "/admin/pieteikumi" ? "page" : undefined}><ClipboardList size={19} aria-hidden="true" />Pieteikumi<RegistrationNotification /></Link>{(Object.keys(sections) as CmsSection[]).map(key => { const Icon = icons[key]; return <Link key={key} href={`/admin/${key}`} aria-current={pathname === `/admin/${key}` ? "page" : undefined}><Icon size={19} aria-hidden="true" />{sections[key].title}</Link>; })}</nav>
    <div className="cms-account"><span>{name}</span><Link href="/" target="_blank">Atvērt mājaslapu<ArrowUpRight size={16} /></Link><Link href="/admin/parole">Mainīt paroli</Link><button onClick={async () => { await createBrowserAuthClient().auth.signOut(); router.push("/login"); router.refresh(); }}><LogOut size={17} />Iziet</button></div>
  </aside><main className="cms-main">{children}</main></div>;
}
