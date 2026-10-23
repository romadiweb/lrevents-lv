import type {ResultsSeason} from "./results";
export function resolveRound(season:ResultsSeason|undefined, selected:string,live=false){
 if(season?.rounds.some(round=>round.id===selected))return selected;
 if(live){const latest=[...(season?.rounds??[])].reverse().find(round=>season?.entries.some(entry=>entry.scores[round.id]!=null||entry.roundStatuses?.[round.id]||entry.roundRuns?.[round.id]?.length));if(latest)return latest.id;}
 return season?.rounds[0]?.id??"";
}
