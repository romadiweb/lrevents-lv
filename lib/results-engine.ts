import type { ResultsEntry, ResultsSeason } from "./results";
import type { TeamStanding } from "./mock-standings";
import type { CarBrandId } from "./car-brands";
export type ResultRow = Record<string, string | number | boolean | null>;
export type ResultsTables = Record<string, ResultRow[]>;
const text=(row:ResultRow,key:string)=>String(row[key]??"");
const number=(value:unknown):number|null=>value===null||value===undefined||value===""?null:Number(value);
export function countedTotal(values:(number|null)[],best:number){const scores=values.filter((score):score is number=>score!==null).sort((a,b)=>b-a);return Number((best>0?scores.slice(0,best):scores).reduce((sum,score)=>sum+score,0).toFixed(3));}
/** Compare achievements before names; unresolved sporting ties share a rank. */
export function compareStandings(a:ResultsEntry,b:ResultsEntry){
 const delta=(b.officialTotal??0)-(a.officialTotal??0);if(Math.abs(delta)>0.000001)return delta;
 const ap=Object.values(a.roundPositions??{}).filter((v):v is number=>v!==null);
 const bp=Object.values(b.roundPositions??{}).filter((v):v is number=>v!==null);
 const positions=[...new Set([...ap,...bp])].sort((x,y)=>x-y);
 for(const position of positions){const count=bp.filter(p=>p===position).length-ap.filter(p=>p===position).length;if(count)return count;}
 return 0;
}
export function rankClass(entries:ResultsEntry[]){
 const sorted=[...entries].sort((a,b)=>compareStandings(a,b)||a.driver.localeCompare(b.driver,"lv"));
 sorted.forEach((entry,index)=>{entry.officialPosition=index>0&&compareStandings(entry,sorted[index-1])===0?sorted[index-1].officialPosition:index+1;});return sorted;
}
export function buildResults(tables:ResultsTables){
 const rows=(table:string)=>(tables[table]??[]).filter(row=>row.published===true);
 const people=rows("cms_participants"),teams=rows("cms_racing_teams");
 const seasons:ResultsSeason[]=[];const archive:ResultsSeason[]=[];const teamSeasons:Record<string,TeamStanding[]>={};
 for(const config of rows("cms_seasons").sort((a,b)=>Number(b.year)-Number(a.year)||text(a,"name").localeCompare(text(b,"name"),"lv"))){
  const seasonId=text(config,"id");
  const rounds=rows("cms_rounds").filter(row=>row.season_id===seasonId).sort((a,b)=>Number(a.sort_order)-Number(b.sort_order)||text(a,"event_date").localeCompare(text(b,"event_date"))).map((row,index)=>({id:text(row,"id"),label:text(row,"name"),shortLabel:`P${index+1}`,runCount:0}));
  const classes=rows("cms_classes").filter(row=>row.season_id===seasonId).sort((a,b)=>Number(a.sort_order)-Number(b.sort_order)).map(row=>({id:text(row,"id"),name:text(row,"name")}));
  const scale=text(config,"points_scale").split(",").map(Number);
  const entries:ResultsEntry[]=[];const entryTeams=new Map<string,string>();
  for(const entry of rows("cms_entries").filter(row=>row.season_id===seasonId&&classes.some(c=>c.id===row.class_id))){
   const person=people.find(row=>row.id===entry.participant_id);if(!person)continue;
   const e:ResultsEntry={id:text(entry,"id"),classId:text(entry,"class_id"),driver:`${text(person,"first_name")} ${text(person,"last_name")}`,car:text(entry,"car")||text(person,"car"),startNumber:text(entry,"start_number"),scores:{},roundPositions:{},roundRuns:{},roundStatuses:{},teamId:text(entry,"team_id"),teamName:text(teams.find(t=>t.id===entry.team_id)||{},"name")};
   for(const result of rows("cms_results").filter(row=>row.entry_id===entry.id&&rounds.some(r=>r.id===row.round_id))){
    const roundId=text(result,"round_id"),position=number(result.position),override=number(result.points),status=text(result,"status");
    const runs=rows("cms_runs").filter(row=>row.result_id===result.id).sort((a,b)=>Number(a.run_number)-Number(b.run_number)).map(row=>{const time=number(row.time_ms),penalty=number(row.penalty_ms);return {runNumber:Number(row.run_number),timeMs:time,penaltyMs:penalty,resultMs:number(row.result_ms)??(time!==null&&penalty!==null?time+penalty:null),points:number(row.points),...(row.status!=="OK"?{status:row.status as "DNS"|"DNF"|"DSQ"}:{})};});
    e.roundRuns![roundId]=runs;
    e.roundStatuses![roundId]=status;
    if(status==="OK"&&position!==null)e.roundPositions![roundId]=position;
    e.scores[roundId]=override!==null?override:status!=="OK"?0:config.scoring_mode==="position"&&position!==null?(scale[position-1]??0):config.scoring_mode==="run_sum"?(runs.some(run=>run.points!==null)?Number(runs.reduce((sum,run)=>sum+(run.status?0:run.points??0),0).toFixed(3)):null):null;
   }
   e.officialTotal=countedTotal(Object.values(e.scores),Number(config.best_rounds));
   // No phantom 0-point entries in standings before a result exists.
   if(Object.values(e.scores).some(score=>score!==null)||Object.keys(e.roundStatuses!).length){entries.push(e);entryTeams.set(e.id,text(entry,"team_id"));}
  }
  for(const c of classes)rankClass(entries.filter(entry=>entry.classId===c.id));
  const season:ResultsSeason={id:seasonId,competition:text(config,"name"),year:Number(config.year),status:"published",standingStatus:"provisional",rounds,classes,entries};
  (config.archived===true?archive:seasons).push(season);
  const scoredTeams=teams.map(team=>{
   const members=entries.filter(entry=>entryTeams.get(entry.id)===team.id);
   const scores=rounds.map(round=>{const points=members.map(entry=>entry.scores[round.id]??null);return points.some(point=>point!==null)?countedTotal(points,Number(config.team_best)):null;});
   const teamEntry:ResultsEntry={id:text(team,"id"),classId:"teams",driver:text(team,"name"),teamId:text(team,"id"),teamName:text(team,"name"),scores:Object.fromEntries(rounds.map((round,index)=>[round.id,scores[index]])),officialTotal:countedTotal(scores,Number(config.best_rounds)),roundPositions:{}};
   return {team,members,scores,teamEntry};
  }).filter(item=>item.members.length);
  for(const round of rounds){const order=scoredTeams.filter(item=>item.teamEntry.scores[round.id]!=null).sort((a,b)=>(b.teamEntry.scores[round.id]??0)-(a.teamEntry.scores[round.id]??0));order.forEach((item,index)=>{const prior=order[index-1];item.teamEntry.roundPositions![round.id]=prior&&prior.teamEntry.scores[round.id]===item.teamEntry.scores[round.id]?prior.teamEntry.roundPositions![round.id]!:index+1;});}
  rankClass(scoredTeams.map(item=>item.teamEntry));
  teamSeasons[seasonId]=scoredTeams.sort((a,b)=>(a.teamEntry.officialPosition??0)-(b.teamEntry.officialPosition??0)).map(item=>({rank:item.teamEntry.officialPosition!,name:text(item.team,"name"),points:item.teamEntry.officialTotal!,rounds:item.scores,members:[...new Set(item.members.map(entry=>entry.driver))],carBrand:text(item.team,"car_brand") as CarBrandId}));
  if(scoredTeams.length){season.classes.push({id:"teams",name:"Komandas"});season.entries.push(...scoredTeams.map(item=>item.teamEntry));}
 }
 return {current:seasons,archive,teams:teamSeasons};
}
