import type { Metadata } from "next";
import { ResultsBoard } from "@/components/results/results-board";
import { currentSeasons } from "@/lib/results-data";
import "../rezultati.css";
export const metadata: Metadata = { title: "Kopvērtējums | LR Events", description: "LR Events sezonas kopvērtējums un punktu sadalījums pa posmiem un klasēm." };
export default function StandingsPage() { return <ResultsBoard seasons={currentSeasons} mode="standings" />; }
