import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getRegistration } from "@/lib/registration/content";
import { RegistrationPanel } from "@/components/events/registration-panel";
import "../../../registracija/registration.css";
export const metadata: Metadata = { title: "Pieteikšanās sacensībām | LR Events" };
async function Content({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const snapshot = await getRegistration(slug); if (!snapshot) notFound();
  return <main id="main-content" className="container registration-page site-content-page"><Link href={`/pasakumi/${slug}`}>← Atpakaļ uz pasākumu</Link><h1>{snapshot.title}</h1><RegistrationPanel initial={snapshot} form /></main>;
}
export default function Page(props: { params: Promise<{ slug: string }> }) { return <Suspense fallback={<main id="main-content" className="container registration-page"><p role="status">Ielādē pasākuma informāciju…</p></main>}><Content {...props} /></Suspense>; }
