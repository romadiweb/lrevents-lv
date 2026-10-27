import { ResultsBoard } from "@/components/results/results-board";
import { getResultsContent } from "@/lib/cms/results-content";
import { ResultsRefresh } from "@/components/results/results-refresh";
import "../rezultati.css";
export const metadata={title:"Tiešsaistes rezultāti | LR Events"};
async function Content(){const {current}=await getResultsContent();return <><ResultsRefresh/><ResultsBoard seasons={current} mode="rounds" live/></>;}
export default function Page(){return <Content/>;}
