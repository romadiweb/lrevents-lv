import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import "@/components/admin/admin.css";
export const metadata = { title: "Iestatīt paroli — LR Events", robots: { index: false, follow: false } };
export default function PasswordPage() { return <main className="cms-login"><Suspense fallback={<p>Ielādē…</p>}><LoginForm updatePassword /></Suspense></main>; }
