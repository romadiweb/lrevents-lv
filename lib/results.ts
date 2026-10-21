export type ResultsRound = {
  id: string;
  label: string;
  shortLabel: string;
  /** Optional canonical event / round results URL, if one is available. */
  href?: string;
  runCount?: number;
};

export type ResultsClass = { id: string; name: string };

/** Timing-provider values in integer milliseconds. Null is unknown, zero is real. */
export type ResultsRun = {
  runNumber: number;
  timeMs: number | null;
  penaltyMs: number | null;
  /** Supplied adjusted result; do not infer official results from incomplete inputs. */
  resultMs: number | null;
  points: number | null;
  status?: "DNS" | "DNF" | "DSQ";
};

export type ResultsEntry = {
  id: string;
  classId: string;
  driver: string;
  car?: string;
  startNumber?: string;
  roundRuns?: Record<string, ResultsRun[]>;
  /** null means no result; zero is a valid recorded score. */
  scores: Record<string, number | null>;
  /** Only use official values after approval of the scoring calculation. */
  officialTotal?: number;
  officialPosition?: number;
  /** Actual round placements from the timing provider; not inferred from points. */
  roundPositions?: Record<string, number | null>;
};

export type ResultsSeason = {
  id: string;
  competition: string;
  year: number;
  status: "preview" | "published";
  standingStatus?: "provisional" | "official";
  /** ISO timestamp, shown only when supplied by the results source. */
  updatedAt?: string;
  rounds: ResultsRound[];
  classes: ResultsClass[];
  entries: ResultsEntry[];
};

export function pointsFor(entry: ResultsEntry, roundId: string): number | null {
  return entry.scores[roundId] ?? null;
}

export function hasRoundResult(entry: ResultsEntry, roundId: string): boolean {
  return (
    pointsFor(entry, roundId) !== null ||
    Boolean(entry.roundRuns?.[roundId]?.length)
  );
}

export function formatRaceTime(
  milliseconds: number | null | undefined,
): string {
  if (
    milliseconds == null ||
    !Number.isSafeInteger(milliseconds) ||
    milliseconds < 0
  )
    return "—";
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor(milliseconds / 1000) % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")},${String(milliseconds % 1000).padStart(3, "0")}`;
}

export function totalFor(entry: ResultsEntry): number {
  return (
    entry.officialTotal ??
    Object.values(entry.scores).reduce<number>(
      (sum, points) => sum + (points ?? 0),
      0,
    )
  );
}

export function sortedEntries(
  entries: ResultsEntry[],
  roundId?: string,
): ResultsEntry[] {
  return [...entries].sort((a, b) => {
    if (roundId) {
      const aPosition = a.roundPositions?.[roundId];
      const bPosition = b.roundPositions?.[roundId];
      if (aPosition != null && bPosition != null && aPosition !== bPosition)
        return aPosition - bPosition;
      const aPoints = pointsFor(a, roundId);
      const bPoints = pointsFor(b, roundId);
      if (aPoints === null && bPoints !== null) return 1;
      if (bPoints === null && aPoints !== null) return -1;
      if ((bPoints ?? 0) !== (aPoints ?? 0))
        return (bPoints ?? 0) - (aPoints ?? 0);
    } else {
      if (a.officialPosition != null && b.officialPosition != null) {
        return a.officialPosition - b.officialPosition;
      }
      if (totalFor(b) !== totalFor(a)) return totalFor(b) - totalFor(a);
    }
    return a.driver.localeCompare(b.driver, "lv");
  });
}
