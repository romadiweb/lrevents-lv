import type { ResultsSeason } from "./results";

// DEMONSTRATION DATA ONLY. The names, classes, scores and round counts below
// do not claim to describe the actual LR Events 2026 championship.
export const currentSeasons: ResultsSeason[] = [
  {
    id: "demo-lrevents-2026",
    competition: "LR Events kausa izcīņa autosprintā",
    year: 2026,
    status: "preview",
    rounds: [
      { id: "p1", label: "1. posms", shortLabel: "P1" },
      { id: "p2", label: "2. posms", shortLabel: "P2" },
      { id: "p3", label: "3. posms", shortLabel: "P3" },
      { id: "p4", label: "4. posms", shortLabel: "P4" },
      { id: "p5", label: "5. posms", shortLabel: "P5" },
    ],
    classes: [
      { id: "1600", name: "1600" },
      { id: "2000", name: "2000" },
      { id: "rwd", name: "RWD" },
      { id: "4wd", name: "4WD" },
    ],
    entries: [
      {
        id: "demo-01",
        startNumber: "101",
        roundRuns: {
          p1: [
            {
              runNumber: 1,
              timeMs: 226038,
              penaltyMs: 0,
              resultMs: 226038,
              points: 14,
            },
            {
              runNumber: 2,
              timeMs: 214074,
              penaltyMs: 10000,
              resultMs: 224074,
              points: 12,
            },
            {
              runNumber: 3,
              timeMs: 212030,
              penaltyMs: 0,
              resultMs: 212030,
              points: 14,
            },
          ],
        },
        classId: "1600",
        driver: "Parauga braucējs A",
        car: "Honda Civic",
        scores: { p1: 40, p2: 32, p3: 40, p4: 24, p5: 32 },
      },
      {
        id: "demo-02",
        classId: "1600",
        driver: "Parauga braucējs B",
        car: "VW Golf",
        scores: { p1: 32, p2: 40, p3: 24, p4: 32, p5: 20 },
      },
      {
        id: "demo-03",
        classId: "1600",
        driver: "Parauga braucējs C",
        car: "Peugeot 206",
        scores: { p1: 24, p2: 20, p3: 32, p4: 40, p5: null },
      },
      {
        id: "demo-04",
        classId: "1600",
        driver: "Parauga braucējs D",
        car: "Toyota Yaris",
        scores: { p1: null, p2: 24, p3: 20, p4: null, p5: 40 },
      },
      {
        id: "demo-05",
        classId: "2000",
        driver: "Parauga braucējs E",
        car: "Ford Focus",
        scores: { p1: 32, p2: 40, p3: 32, p4: 40, p5: 24 },
      },
      {
        id: "demo-06",
        classId: "2000",
        driver: "Parauga braucējs F",
        car: "Renault Clio",
        scores: { p1: 40, p2: 24, p3: 40, p4: null, p5: 32 },
      },
      {
        id: "demo-07",
        classId: "2000",
        driver: "Parauga braucējs G",
        car: "Honda Civic",
        scores: { p1: 20, p2: 32, p3: 24, p4: 32, p5: 20 },
      },
      {
        id: "demo-08",
        classId: "rwd",
        driver: "Parauga braucējs H",
        car: "BMW 325",
        scores: { p1: 40, p2: 40, p3: 32, p4: 32, p5: 40 },
      },
      {
        id: "demo-09",
        classId: "rwd",
        driver: "Parauga braucējs I",
        car: "BMW 318",
        scores: { p1: 32, p2: null, p3: 40, p4: 40, p5: 32 },
      },
      {
        id: "demo-10",
        classId: "rwd",
        driver: "Parauga braucējs J",
        car: "BMW 323",
        scores: { p1: 24, p2: 32, p3: null, p4: 24, p5: 24 },
      },
      {
        id: "demo-11",
        classId: "4wd",
        driver: "Parauga braucējs K",
        car: "Subaru Impreza",
        scores: { p1: 40, p2: 32, p3: 40, p4: 40, p5: 40 },
      },
      {
        id: "demo-12",
        classId: "4wd",
        driver: "Parauga braucējs L",
        car: "Audi A4",
        scores: { p1: 32, p2: 40, p3: 32, p4: 32, p5: 24 },
      },
      {
        id: "demo-13",
        classId: "4wd",
        driver: "Parauga braucējs M",
        car: "Mitsubishi Lancer",
        scores: { p1: 24, p2: 24, p3: 24, p4: null, p5: 32 },
      },
    ],
  },
];
