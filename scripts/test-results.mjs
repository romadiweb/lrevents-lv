import assert from "node:assert/strict";
import ts from "typescript";
import {readFile} from "node:fs/promises";
const source=await readFile(new URL("../lib/results-engine.ts",import.meta.url),"utf8");
const {outputText}=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}});
const {buildResults,countedTotal,compareStandings,rankClass}=await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const published={published:true};
const tables={
 cms_seasons:[{...published,id:"s",name:"Test",year:2026,archived:false,scoring_mode:"position",points_scale:"10,8,6",best_rounds:0,team_best:0}],
 cms_classes:[{...published,id:"c",season_id:"s",name:"RWD",sort_order:0}],
 cms_rounds:[1,2,3].map(i=>({...published,id:`r${i}`,season_id:"s",name:`Round ${i}`,event_date:`2026-01-0${i}`,sort_order:i})),
 cms_racing_teams:[{...published,id:"t",name:"Team",car_brand:"bmw"}],
 cms_participants:["A","B"].map(id=>({...published,id,first_name:id,last_name:"Test",car:"BMW"})),
 cms_entries:["A","B"].map(id=>({...published,id:`e${id}`,season_id:"s",class_id:"c",participant_id:id,team_id:"t"})),
 cms_results:[{entry_id:"eA",round_id:"r1",position:1},{entry_id:"eA",round_id:"r2",position:3},{entry_id:"eB",round_id:"r1",position:2},{entry_id:"eB",round_id:"r2",position:2}].map((r,i)=>({...published,...r,id:`res${i}`,season_id:"s",status:"OK",points:null})),cms_runs:[]};
let out=buildResults(tables),season=out.current[0];
assert.equal(season.entries.find(e=>e.id==="eA").officialTotal,16);
assert.equal(season.entries.find(e=>e.id==="eA").officialPosition,1,"one win beats two second places on equal points");
assert.equal(season.entries.find(e=>e.id==="eB").officialPosition,2);
assert.equal(out.teams.s[0].points,32);
assert.equal(out.teams.s[0].carBrand,"bmw");
assert.equal(season.entries.find(e=>e.id==="t").teamId,"t");
assert.equal(season.entries.find(e=>e.id==="t").scores.r3,null,"future rounds have no team result");
const multiClass=structuredClone(tables);
multiClass.cms_classes.push({...published,id:"c2",season_id:"s",name:"Open",sort_order:1});
multiClass.cms_entries.push({...multiClass.cms_entries[0],id:"eA2",class_id:"c2"});
multiClass.cms_results.push(
 {...published,id:"a2r1",entry_id:"eA2",round_id:"r1",position:2,status:"OK",points:null},
 {...published,id:"a2r2",entry_id:"eA2",round_id:"r2",position:1,status:"OK",points:null},
);
let multiOut=buildResults(multiClass);
assert.deepEqual(multiOut.teams.s[0].rounds,[18,18,null],"each participant contributes their best class score in each round");
assert.equal(multiOut.teams.s[0].points,36);
assert.equal(multiOut.current[0].entries.filter(e=>e.id==="eA"||e.id==="eA2").length,2,"individual class standings remain separate");
multiClass.cms_seasons[0].team_best=1;
assert.deepEqual(buildResults(multiClass).teams.s[0].rounds,[10,10,null],"team limit is applied after selecting each participant's best class");
multiClass.cms_seasons[0].team_best=0;
multiClass.cms_participants[1].first_name="A";
assert.equal(buildResults(multiClass).teams.s[0].points,36,"different participant IDs count separately even with matching names");
multiClass.cms_results.find(r=>r.id==="a2r2").published=false;
assert.deepEqual(buildResults(multiClass).teams.s[0].rounds,[18,14,null],"draft class results do not affect team scores");
multiClass.cms_results.forEach(r=>{r.points=0;});
assert.deepEqual(buildResults(multiClass).teams.s[0].rounds,[0,0,null],"recorded zero team scores stay distinct from future rounds");
assert.equal(countedTotal([0,null,5,10],2),15);
const a={id:"a",driver:"A",officialTotal:10,roundPositions:{r1:2,r2:3}};
const b={id:"b",driver:"B",officialTotal:10,roundPositions:{r1:2,r2:4}};
assert.ok(compareStandings(a,b)<0,"third-place count breaks ties after equal seconds");
assert.ok(compareStandings({...a,roundPositions:{r1:1}},{...a,roundPositions:{r1:2}})<0);
const tied=rankClass([a,{...a,id:"b",driver:"B"}]);assert.equal(tied[0].officialPosition,tied[1].officialPosition);
tables.cms_seasons[0].points_scale="20,8,6";out=buildResults(tables);assert.equal(out.current[0].entries.find(e=>e.id==="eA").officialTotal,26);
tables.cms_results[0].points=0;out=buildResults(tables);assert.equal(out.current[0].entries.find(e=>e.id==="eA").scores.r1,0,"explicit zero overrides automatic scale");
tables.cms_results[0].published=false;out=buildResults(tables);assert.equal(out.current[0].entries.find(e=>e.id==="eA").scores.r1,undefined);
tables.cms_seasons[0].archived=true;out=buildResults(tables);assert.equal(out.current.length,0);assert.equal(out.archive.length,1);
tables.cms_seasons[0].archived=false;tables.cms_results[0].published=true;tables.cms_results[0].points=null;tables.cms_seasons[0].scoring_mode="run_sum";
tables.cms_runs=[{...published,id:"run",result_id:"res0",run_number:1,time_ms:120000,penalty_ms:500,result_ms:null,points:12,status:"OK"}];
out=buildResults(tables);assert.equal(out.current[0].entries.find(e=>e.id==="eA").scores.r1,12);assert.equal(out.current[0].entries.find(e=>e.id==="eA").roundRuns.r1[0].resultMs,120500);
tables.cms_results[0].status="DSQ";out=buildResults(tables);assert.equal(out.current[0].entries.find(e=>e.id==="eA").scores.r1,0);assert.equal(out.current[0].entries.find(e=>e.id==="eA").roundPositions.r1,undefined);
const selection=ts.transpileModule(await readFile(new URL("../lib/results-selection.ts",import.meta.url),"utf8"),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {resolveRound}=await import(`data:text/javascript;base64,${Buffer.from(selection).toString("base64")}`);
assert.equal(resolveRound(undefined,"",true),"");assert.equal(resolveRound(season,"",true),"r2","newly arrived live data selects latest scored round");assert.equal(resolveRound(season,"missing",false),"r1");assert.equal(resolveRound(season,"r3",true),"r3","explicit round selection survives refresh");
console.log("Results tests passed: configurable scales, overrides/zero, countback, shared places, discarded rounds, team aggregation, archive, draft exclusion, run points, penalties, and disqualification.");
