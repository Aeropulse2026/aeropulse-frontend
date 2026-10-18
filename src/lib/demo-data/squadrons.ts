export type SquadronRecord = { id:string; name:string; base:string; region:string; role:string; assigned:number; strength:number; operational:number; readiness:number; maintenance:number; status:string };
// Fictional units for interface preview only; not operational force data.
export const demoSquadrons: SquadronRecord[] = [
 {id:"SQ-017",name:"17 Golden Arrows",base:"Ambala",region:"North",role:"Air defence",assigned:18,strength:146,operational:16,readiness:91,maintenance:2,status:"Operational"},
 {id:"SQ-007",name:"7 Battle Axes",base:"Ambala",region:"North",role:"Air defence",assigned:14,strength:132,operational:12,readiness:86,maintenance:2,status:"Operational"},
 {id:"SQ-001",name:"1 Tigers",base:"Jodhpur",region:"West",role:"Air defence",assigned:16,strength:139,operational:11,readiness:74,maintenance:4,status:"Limited operations"},
 {id:"SQ-030",name:"30 Rhinos",base:"Pune",region:"West",role:"Transport",assigned:20,strength:164,operational:18,readiness:93,maintenance:1,status:"Operational"},
 {id:"SQ-221",name:"221 Squadron",base:"Pune",region:"West",role:"Surveillance",assigned:12,strength:118,operational:10,readiness:84,maintenance:2,status:"Operational"},
 {id:"SQ-002",name:"2 Squadron",base:"Tezpur",region:"East",role:"Training",assigned:15,strength:126,operational:13,readiness:89,maintenance:2,status:"Operational"},
 {id:"SQ-101",name:"101 Squadron",base:"Tezpur",region:"East",role:"Air defence",assigned:17,strength:141,operational:12,readiness:77,maintenance:3,status:"Limited operations"},
 {id:"SQ-043",name:"43 Squadron",base:"Sulur",region:"South",role:"Surveillance",assigned:13,strength:121,operational:11,readiness:88,maintenance:1,status:"Operational"},
 {id:"SQ-151",name:"151 Helicopter Unit",base:"Sulur",region:"South",role:"Transport",assigned:11,strength:96,operational:9,readiness:82,maintenance:2,status:"Operational"},
 {id:"SQ-009",name:"9 Squadron",base:"Ghaziabad",region:"North",role:"Transport",assigned:16,strength:137,operational:14,readiness:90,maintenance:1,status:"Operational"},
];

export function getSquadronRecommendationCandidates(records: readonly SquadronRecord[], role: string, base: string) {
  return records
    .filter((squadron) => squadron.role === role && squadron.operational > 0 && (base === "Any base" || squadron.base === base))
    .map((squadron) => ({
      ...squadron,
      score: Math.round(squadron.readiness * 0.45 + (squadron.operational / squadron.assigned * 100) * 0.25 + Math.max(0, 100 - squadron.maintenance * 20) * 0.2 + 10),
    }))
    .sort((left, right) => right.score - left.score);
}
