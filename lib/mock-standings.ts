import type { CarBrandId } from "@/lib/car-brands";

export type TeamStanding = {
  rank: number;
  name: string;
  points: number;
  rounds: number[];
  members: string[];
  carBrand?: CarBrandId;
};

export const teamStandings: TeamStanding[] = [
  {
    rank: 1,
    name: "ANG",
    carBrand: "audi", // Illustrative until verified makes are assigned in the CMS.
    points: 165,
    rounds: [30, 38, 33, 37, 27],
    members: ["Alvis Ermansons", "Normunds Vītols", "Guntis Ķervijs"],
  },
  {
    rank: 2,
    name: "RUBĻOFKA Racing Team",
    carBrand: "bmw",
    points: 158,
    rounds: [0, 39, 45, 42, 32],
    members: ["Mārtiņš Priemans", "Toms Freimanis", "Egils Odriņš"],
  },
  {
    rank: 3,
    name: "Ē.R.K. Racing",
    carBrand: "volkswagen",
    points: 52,
    rounds: [0, 15, 11, 11, 15],
    members: ["Ēriks Bite", "Ralens Jākobsons", "Kārlis Ķipsts"],
  },
];
