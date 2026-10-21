import type { Metadata } from "next";
import { ArchiveBoard } from "@/components/results/archive-board";
import { archivePreviewSeasons } from "@/lib/archive-data";
import "./arhivs.css";

export const metadata: Metadata = {
  title: "Rezultātu arhīvs | LR Events",
  description:
    "LR Events autosprinta iepriekšējo sezonu kopvērtējums, klases un posmu rezultāti.",
};

export default function ResultsArchivePage() {
  // Replace archivePreviewSeasons with Supabase-published seasons on the server.
  // Do not ship example results as official historical records.
  return <ArchiveBoard seasons={archivePreviewSeasons} />;
}

