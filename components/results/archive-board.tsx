"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ChevronDown } from "lucide-react";
import {
  hasRoundResult,
  pointsFor as scoreFor,
  totalFor,
  sortedEntries,
  type ResultsEntry,
  type ResultsSeason,
} from "@/lib/results";

import { RoundResultsTable } from "./round-results-table";

type ArchiveMode = "standings" | "round";

type FilterSelectProps = {
  label: string;
  id: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  className?: string;
};

function FilterSelect({
  label,
  id,
  value,
  options,
  onChange,
  className = "",
}: FilterSelectProps) {
  return (
    <div className={`archive-filter ${className}`}>
      <label htmlFor={id}>{label}</label>
      <div className="archive-filter-select">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={17} aria-hidden="true" />
      </div>
    </div>
  );
}

function ClassResults({
  season,
  className,
  entries,
  mode,
  roundId,
}: {
  season: ResultsSeason;
  className: string;
  entries: ResultsEntry[];
  mode: ArchiveMode;
  roundId: string;
}) {
  const ranked = sortedEntries(
    entries,
    mode === "round" ? roundId : undefined,
  ).filter((entry) => mode === "standings" || hasRoundResult(entry, roundId));

  const roundIds =
    mode === "round" ? [roundId] : season.rounds.map((round) => round.id);
  const bestByRound = Object.fromEntries(
    roundIds.map((id) => [
      id,
      Math.max(0, ...ranked.map((entry) => scoreFor(entry, id) ?? 0)),
    ]),
  ) as Record<string, number>;

  return (
    <section
      className="archive-class"
      aria-label={`${className} klases rezultāti`}
    >
      <div className="archive-class-heading">
        <h2>{className}</h2>
        <span>
          {ranked.length} {ranked.length === 1 ? "braucējs" : "braucēji"}
        </span>
      </div>
      {mode === "round" && season.rounds.find((r) => r.id === roundId) ? (
        <RoundResultsTable
          entries={ranked}
          round={season.rounds.find((r) => r.id === roundId)!}
          className={className}
        />
      ) : ranked.length === 0 ? (
        <div className="archive-no-results">
          Šajā klasē nav publicētu rezultātu.
        </div>
      ) : (
        <>
          <div className="archive-table-frame">
            <table className="archive-table">
              <thead>
                <tr>
                  <th scope="col" className="archive-th-place">
                    Vieta
                  </th>
                  <th scope="col" className="archive-th-driver">
                    Braucējs / auto
                  </th>
                  {roundIds.map((id) => (
                    <th
                      scope="col"
                      className="archive-th-round"
                      key={id}
                      title={season.rounds.find((r) => r.id === id)?.label}
                    >
                      {season.rounds.find((r) => r.id === id)?.shortLabel ?? id}
                    </th>
                  ))}
                  {mode === "standings" && (
                    <th scope="col" className="archive-th-total">
                      Kopā
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {ranked.map((entry, index) => (
                  <tr key={entry.id}>
                    <td className="archive-place">
                      {mode === "standings"
                        ? (entry.officialPosition ?? index + 1)
                        : index + 1}
                    </td>
                    <th scope="row" className="archive-driver">
                      <span>{entry.driver}</span>
                      {entry.car && <small>{entry.car}</small>}
                    </th>
                    {roundIds.map((id) => {
                      const points = scoreFor(entry, id);
                      const best =
                        points !== null &&
                        points > 0 &&
                        points === bestByRound[id];
                      return (
                        <td className="archive-points" key={id}>
                          <span
                            className={`archive-score${best ? " archive-score--best" : ""}`}
                          >
                            {points ?? "—"}
                          </span>
                        </td>
                      );
                    })}
                    {mode === "standings" && (
                      <td className="archive-total">{totalFor(entry)}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="archive-mobile-list">
            {ranked.map((entry, index) => (
              <details className="archive-mobile-item" key={entry.id}>
                <summary>
                  <span className="archive-mobile-place">
                    {mode === "standings"
                      ? (entry.officialPosition ?? index + 1)
                      : index + 1}
                  </span>
                  <span className="archive-mobile-identity">
                    <strong>{entry.driver}</strong>
                    {entry.car && <small>{entry.car}</small>}
                  </span>
                  <span className="archive-mobile-total">
                    {mode === "standings"
                      ? totalFor(entry)
                      : (scoreFor(entry, roundId) ?? "—")}
                    <small>punkti</small>
                  </span>
                  <ChevronDown size={17} aria-hidden="true" />
                </summary>
                <div className="archive-mobile-breakdown">
                  {roundIds.map((id) => (
                    <div key={id}>
                      <span>
                        {season.rounds.find((round) => round.id === id)
                          ?.label ?? id}
                      </span>
                      <strong>{scoreFor(entry, id) ?? "—"}</strong>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export function ArchiveBoard({ seasons }: { seasons: ResultsSeason[] }) {
  const [seasonId, setSeasonId] = useState(seasons[0]?.id ?? "");
  const [classId, setClassId] = useState("all");
  const [mode, setMode] = useState<ArchiveMode>("standings");
  const [roundId, setRoundId] = useState(seasons[0]?.rounds[0]?.id ?? "");

  const season = seasons.find((item) => item.id === seasonId) ?? seasons[0];
  const availableYears = [...new Set(seasons.map((item) => item.year))].sort(
    (a, b) => b - a,
  );
  const selectedYear = season?.year ?? availableYears[0] ?? 0;
  const yearSeasons = seasons.filter((item) => item.year === selectedYear);

  const classOptions = season?.classes ?? [];
  const currentRound = season?.rounds.some((round) => round.id === roundId)
    ? roundId
    : (season?.rounds[0]?.id ?? "");

  const visibleClasses = useMemo(() => {
    if (!season) return [];
    return classId === "all"
      ? season.classes
      : season.classes.filter((item) => item.id === classId);
  }, [season, classId]);

  function changeSeason(nextId: string) {
    const nextSeason = seasons.find((item) => item.id === nextId);
    setSeasonId(nextId);
    setClassId("all");
    setRoundId(nextSeason?.rounds[0]?.id ?? "");
  }

  function changeYear(year: number) {
    const nextSeason = seasons.find((item) => item.year === year);
    if (nextSeason) changeSeason(nextSeason.id);
  }

  return (
    <main id="main-content" className="archive-page">
      <div className="archive-intro container">
        <nav className="archive-breadcrumb" aria-label="Atrašanās vieta">
          <Link href="/">Sākums</Link>
          <span aria-hidden="true">/</span>
          <Link href="/rezultati">Rezultāti</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Arhīvs</span>
        </nav>
        <div className="archive-intro-row">
          <div>
            <h1>Rezultātu arhīvs</h1>
            <p>Iepriekšējo sezonu kopvērtējums un posmu rezultāti vienuviet.</p>
          </div>
          <Link href="/rezultati" className="archive-back-link">
            <ArrowLeft size={17} aria-hidden="true" /> Aktuālie rezultāti
          </Link>
        </div>
      </div>

      <section
        className="archive-dark-surface"
        aria-label="Iepriekšējo sezonu rezultāti"
      >
        <div className="container">
          {season ? (
            <>
              <div
                className="archive-toolbar"
                aria-label="Rezultātu filtrēšana"
              >
                <span className="archive-toolbar-title">FILTRI</span>
                <FilterSelect
                  id="archive-year"
                  label="Sezona"
                  className="archive-filter--year"
                  value={String(selectedYear)}
                  options={availableYears.map((year) => ({
                    value: String(year),
                    label: String(year),
                  }))}
                  onChange={(value) => changeYear(Number(value))}
                />
                <FilterSelect
                  id="archive-competition"
                  label="Sacensības"
                  className="archive-filter--competition"
                  value={season.id}
                  options={yearSeasons.map((item) => ({
                    value: item.id,
                    label: item.competition,
                  }))}
                  onChange={changeSeason}
                />
                <FilterSelect
                  id="archive-class"
                  label="Klase"
                  className="archive-filter--class"
                  value={classId}
                  options={[
                    { value: "all", label: "Visas klases" },
                    ...classOptions.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })),
                  ]}
                  onChange={setClassId}
                />
                <FilterSelect
                  id="archive-view"
                  label="Skats"
                  className="archive-filter--view"
                  value={mode}
                  options={[
                    { value: "standings", label: "Kopvērtējums" },
                    { value: "round", label: "Posma rezultāti" },
                  ]}
                  onChange={(value) => setMode(value as ArchiveMode)}
                />
              </div>

              {mode === "round" && (
                <div className="archive-round-picker">
                  <FilterSelect
                    id="archive-round"
                    label="Izvēlētais posms"
                    value={currentRound}
                    options={season.rounds.map((round) => ({
                      value: round.id,
                      label: round.label,
                    }))}
                    onChange={setRoundId}
                  />
                </div>
              )}

              <div className="archive-season-heading">
                <span>{season.year}. gada sezona</span>
                <h2>{season.competition}</h2>
              </div>

              {season.status === "preview" && (
                <div role="note" className="archive-preview-note">
                  <strong>DEMONSTRĀCIJAS DATI</strong>
                  <span>
                    Redzamie gadi, braucēji, klases un punkti ir dizaina
                    piemērs, nevis oficiāli LR Events vēsturiskie rezultāti.
                  </span>
                </div>
              )}

              {visibleClasses.map((item) => (
                <ClassResults
                  key={`${season.id}-${item.id}-${mode}-${currentRound}`}
                  season={season}
                  className={item.name}
                  entries={season.entries.filter(
                    (entry) => entry.classId === item.id,
                  )}
                  mode={mode}
                  roundId={currentRound}
                />
              ))}

              <div className="archive-footnote">
                <p>
                  {mode === "standings" ? <>— nozīmē, ka attiecīgajā posmā nav reģistrēta rezultāta. <span className="archive-legend-ring" aria-hidden="true" /> Augstākais parādītais punktu skaits klasē un posmā.</> : "Laiki un sodi tiek attēloti, ja tie ir pievienoti arhīva datiem. Trūkstošie dati atzīmēti ar —."}
                </p>
              </div>
            </>
          ) : (
            <div className="archive-empty-state">
              <h2>Arhīvs vēl nav publicēts</h2>
              <p>
                Iepriekšējo sezonu rezultāti šeit būs pieejami pēc to
                pievienošanas.
              </p>
              <Link href="/rezultati">
                Skatīt aktuālos rezultātus{" "}
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
