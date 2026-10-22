import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import "@/components/admin/admin.css";
export const metadata = { title: "Pieslēgties — LR Events", robots: { index: false, follow: false } };
export default function LoginPage() { return <main className="cms-login"><Suspense fallback={<p>Ielādē…</p>}><LoginForm /></Suspense></main>; }
