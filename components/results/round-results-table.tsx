import { Fragment } from "react";
import { ChevronDown } from "lucide-react";
import {
  formatRaceTime,
  hasRoundResult,
  pointsFor,
  sortedEntries,
  type ResultsEntry,
  type ResultsRound,
  type ResultsRun,
} from "@/lib/results";
import "./round-results-table.css";

function RunResult({ run }: { run?: ResultsRun }) {
  return (
    <>
      <span>{run?.status ?? formatRaceTime(run?.resultMs)}</span>
      {run?.points != null && <small>{run.points} punkti</small>}
    </>
  );
}

export function RoundResultsTable({
  entries,
  round,
  className,
}: {
  entries: ResultsEntry[];
  round: ResultsRound;
  className: string;
}) {
  const rows = sortedEntries(
    entries.filter((e) => hasRoundResult(e, round.id)),
    round.id,
  );
  const runCount = Math.max(
    round.runCount ?? 0,
    ...rows.flatMap((e) =>
      (e.roundRuns?.[round.id] ?? []).map((run) => run.runNumber),
    ),
  );
  const runNumbers = Array.from({ length: runCount }, (_, i) => i + 1);
  const position = (entry: ResultsEntry, index: number) =>
    entry.roundPositions?.[round.id] ?? index + 1;
  const runFor = (entry: ResultsEntry, number: number) =>
    entry.roundRuns?.[round.id]?.find((run) => run.runNumber === number);
  if (!rows.length)
    return (
      <p className="round-results-empty">
        Nav rezultātu, kas atbilst meklēšanai.
      </p>
    );
  return (
    <div className="round-results">
      <p className="round-results-explanation">
        Katram braucienam: laiks, sods un publicētais rezultāts ar brauciena
        punktiem. — dati nav pieejami; 0:00,000 — nav laika soda.
      </p>
      <div
        className="round-results-scroll"
        tabIndex={0}
        role="region"
        aria-label={`${className} klase, ${round.label}: braucienu rezultāti; tabulu var ritināt horizontāli`}
      >
        <table className="round-results-table">
          <caption className="sr-only">
            {className} klase — {round.label}, braucienu laiki un sodi
          </caption>
          <thead>
            <tr>
              <th scope="col">Vieta</th>
              <th scope="col">Dalībnieks</th>
              <th scope="col">Nr.</th>
              {runNumbers.map((n) => (
                <Fragment key={n}>
                  <th scope="col">Laiks {n}</th>
                  <th scope="col">Sods {n}</th>
                  <th scope="col">Rez. {n}</th>
                </Fragment>
              ))}
              <th scope="col">Punkti</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((entry, index) => (
              <tr key={entry.id}>
                <td className="round-results-place">
                  {entry.roundStatuses?.[round.id] && entry.roundStatuses[round.id] !== "OK" ? entry.roundStatuses[round.id] : position(entry, index)}
                </td>
                <th scope="row" className="round-results-driver">
                  {entry.driver}
                  <small>{entry.car}</small>
                </th>
                <td>{entry.startNumber ?? "—"}</td>
                {runNumbers.map((n) => {
                  const run = runFor(entry, n);
                  return (
                    <Fragment key={n}>
                      <td>{formatRaceTime(run?.timeMs)}</td>
                      <td
                        className={
                          run?.penaltyMs != null && run.penaltyMs > 0
                            ? "round-results-penalty"
                            : ""
                        }
                      >
                        {formatRaceTime(run?.penaltyMs)}
                      </td>
                      <td className="round-results-adjusted">
                        <RunResult run={run} />
                      </td>
                    </Fragment>
                  );
                })}
                <td className="round-results-total">
                  {pointsFor(entry, round.id) ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="round-results-mobile">
        {rows.map((entry, index) => (
          <details key={entry.id} className="round-results-mobile-entry">
            <summary>
              <span className="round-results-place">
                {entry.roundStatuses?.[round.id] && entry.roundStatuses[round.id] !== "OK" ? entry.roundStatuses[round.id] : position(entry, index)}
              </span>
              <span className="round-results-person">
                <strong>{entry.driver}</strong>
                <small>
                  {entry.startNumber ? `Nr. ${entry.startNumber} · ` : ""}
                  {entry.car}
                </small>
              </span>
              <span className="round-results-total">
                {pointsFor(entry, round.id) ?? "—"}
                <small>punkti</small>
              </span>
              <ChevronDown size={17} aria-hidden="true" />
            </summary>
            <div className="round-results-runs">
              {runNumbers.map((n) => {
                const run = runFor(entry, n);
                return (
                  <section key={n} aria-label={`${n}. brauciens`}>
                    <h3>{n}. brauciens</h3>
                    <dl>
                      <div>
                        <dt>Laiks</dt>
                        <dd>{formatRaceTime(run?.timeMs)}</dd>
                      </div>
                      <div>
                        <dt>Sods</dt>
                        <dd
                          className={
                            run?.penaltyMs != null && run.penaltyMs > 0
                              ? "round-results-penalty"
                              : ""
                          }
                        >
                          {formatRaceTime(run?.penaltyMs)}
                        </dd>
                      </div>
                      <div>
                        <dt>Rezultāts</dt>
                        <dd>
                          <RunResult run={run} />
                        </dd>
                      </div>
                    </dl>
                  </section>
                );
              })}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
