import type { Metadata } from "next";
import { Suspense } from "react";
import { ResultsBoard } from "@/components/results/results-board";
import { getResultsContent } from "@/lib/cms/results-content";
import "./rezultati.css";
export const metadata: Metadata = { title: "Posmu rezultāti | LR Events", description: "LR Events autosporta sacensību individuālo posmu rezultāti pa klasēm." };
type PageProps = { searchParams: Promise<{ posms?: string | string[]; klase?: string | string[] }> };
async function RoundResults({ searchParams }: PageProps) {
  const params = await searchParams;
  const {current:currentSeasons}=await getResultsContent();
  return <ResultsBoard key={`${params.posms}-${params.klase}`} seasons={currentSeasons} mode="rounds" initialRoundId={typeof params.posms === "string" ? params.posms : undefined} initialClassId={typeof params.klase === "string" ? params.klase : undefined} />;
}
export default function ResultsPage(props: PageProps) {
  return <Suspense fallback={<main id="main-content" className="results-page-heading site-content-page container"><h1>Posmu rezultāti</h1><p role="status">Ielādē rezultātus…</p></main>}><RoundResults {...props} /></Suspense>;
}
