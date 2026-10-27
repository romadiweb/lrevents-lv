import { ResultsBoard } from "@/components/results/results-board";
import { getResultsContent } from "@/lib/cms/results-content";
import "../rezultati.css";
export const metadata={title:"Kopvērtējums | LR Events"};
async function Content(){const {current}=await getResultsContent();return <ResultsBoard seasons={current} mode="standings"/>;}
export default function Page(){return <Content/>;}
