export type TeamStanding = {
  rank: number;
  name: string;
  points: number;
  rounds: number[];
  members: string[];
};

export const teamStandings: TeamStanding[] = [
  {
    rank: 1,
    name: "ANG",
    points: 165,
    rounds: [30, 38, 33, 37, 27],
    members: ["Alvis Ermansons", "Normunds Vītols", "Guntis Ķervijs"],
  },
  {
    rank: 2,
    name: "RUBĻOFKA Racing Team",
    points: 158,
    rounds: [0, 39, 45, 42, 32],
    members: ["Mārtiņš Priemans", "Toms Freimanis", "Egils Odriņš"],
  },
  {
    rank: 3,
    name: "Ē.R.K. Racing",
    points: 52,
    rounds: [0, 15, 11, 11, 15],
    members: ["Ēriks Bite", "Ralens Jākobsons", "Kārlis Ķipsts"],
  },
];
