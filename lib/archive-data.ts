import type { ResultsEntry, ResultsSeason } from "./results";

/**
 * VISUAL FIXTURES — NOT OFFICIAL LR EVENTS RESULTS.
 * Swap these seasons for Supabase-published archive data in page.tsx.
 * Do not treat these scores, round counts, or historical class names as facts.
 */

const classes = [
  { id: "1600", name: "1600" },
  { id: "2000", name: "2000" },
  { id: "rwd", name: "RWD" },
  { id: "4wd", name: "4WD" },
];

const exampleDrivers = [
  { classId: "1600", car: "Honda Civic" },
  { classId: "1600", car: "VW Golf" },
  { classId: "1600", car: "Peugeot 206" },
  { classId: "1600", car: "Toyota Yaris" },
  { classId: "1600", car: "Opel Corsa" },
  { classId: "2000", car: "Ford Focus" },
  { classId: "2000", car: "Honda Civic" },
  { classId: "2000", car: "Renault Clio" },
  { classId: "2000", car: "VW Golf" },
  { classId: "rwd", car: "BMW 325" },
  { classId: "rwd", car: "BMW 318" },
  { classId: "rwd", car: "BMW 323" },
  { classId: "rwd", car: "BMW 320" },
  { classId: "4wd", car: "Subaru Impreza" },
  { classId: "4wd", car: "Audi A4" },
  { classId: "4wd", car: "Mitsubishi Lancer" },
  { classId: "4wd", car: "Subaru Legacy" },
] as const;

function createPreviewEntries(year: number, roundCount: number): ResultsEntry[] {
  return exampleDrivers.map((driver, index) => {
    const scores: ResultsEntry["scores"] = {};
    for (let round = 1; round <= roundCount; round++) {
      const seed = index * 7 + round * 3 + (year % 10);
      const values = [40, 32, 26, 20, 18, 16, 12, 10];
      scores[`p${round}`] = seed % 11 === 0 ? null : values[seed % values.length];
    }
    return {
      id: `${year}-example-${index + 1}`,
      classId: driver.classId,
      driver: `Parauga braucējs ${String(index + 1).padStart(2, "0")}`,
      car: driver.car,
      scores,
    };
  });
}

function createPreviewSeason(year: number, roundCount: number): ResultsSeason {
  return {
    id: `demo-lrevents-${year}`,
    competition: "LR Events kausa izcīņa autosprintā",
    year,
    status: "preview",
    rounds: Array.from({ length: roundCount }, (_, index) => ({
      id: `p${index + 1}`,
      label: `${index + 1}. posms`,
      shortLabel: `P${index + 1}`,
    })),
    classes,
    entries: createPreviewEntries(year, roundCount),
  };
}

export const archivePreviewSeasons: ResultsSeason[] = [
  createPreviewSeason(2025, 5),
  createPreviewSeason(2024, 4),
];

