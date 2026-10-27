import "server-only";
import { cacheTag, cacheLife } from "next/cache";
import { read } from "./content";
import { buildResults, type ResultsTables } from "@/lib/results-engine";
export async function getResultsContent(){
 "use cache";cacheTag("cms-content");cacheLife({stale:300,revalidate:60,expire:3600});
 const tables=["cms_seasons","cms_rounds","cms_classes","cms_racing_teams","cms_participants","cms_entries","cms_results","cms_runs"];
 const rows=await Promise.all(tables.map(async table=>[table,await read(table)??[]]));
 return buildResults(Object.fromEntries(rows) as ResultsTables);
}
