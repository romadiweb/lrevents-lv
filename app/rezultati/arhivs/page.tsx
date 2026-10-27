import { ArchiveBoard } from "@/components/results/archive-board";
import { getResultsContent } from "@/lib/cms/results-content";
import "./arhivs.css";
export const metadata={title:"Rezultātu arhīvs | LR Events"};
async function Content(){const {archive}=await getResultsContent();return <ArchiveBoard seasons={archive}/>;}
export default function Page(){return <Content/>;}
