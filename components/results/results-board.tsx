"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronDown, Search } from "lucide-react";
import {
  hasRoundResult,
  pointsFor,
  totalFor,
  sortedEntries,
  type ResultsEntry,
  type ResultsSeason,
} from "@/lib/results";

import { RoundResultsTable } from "./round-results-table";

type Mode = "standings" | "rounds";
function Score({
  value,
  best = false,
}: {
  value: number | null;
  best?: boolean;
}) {
  return (
    <span
      className={`standings-score${value === null ? " standings-score--none" : best ? " standings-score--top" : ""}`}
    >
      {value ?? "—"}
    </span>
  );
}
function ClassResults({
  season,
  entries,
  mode,
  roundId,
  classId,
}: {
  season: ResultsSeason;
  entries: ResultsEntry[];
  mode: Mode;
  roundId: string;
  classId: string;
}) {
  if (mode === "rounds") {
    const round = season.rounds.find((r) => r.id === roundId);
    return round ? (
      <RoundResultsTable entries={entries} round={round} className={classId} />
    ) : (
      <p className="standings-empty">Izvēlies posmu.</p>
    );
  }
  const rows = sortedEntries(entries);
  const rounds = season.rounds;
  const best = Object.fromEntries(
    rounds.map((r) => [
      r.id,
      Math.max(0, ...rows.map((e) => pointsFor(e, r.id) ?? 0)),
    ]),
  );
  const position = (e: ResultsEntry, index: number) =>
    e.officialPosition ?? index + 1;
  const roundHref = (id: string) =>
    `/rezultati?posms=${encodeURIComponent(id)}&klase=${encodeURIComponent(classId)}`;
  if (!rows.length)
    return (
      <p className="standings-empty">Nav rezultātu, kas atbilst meklēšanai.</p>
    );
  return (
    <>
      <div className="standings-table-scroll">
        <table className="standings-table">
          <thead>
            <tr>
              <th scope="col" className="standings-th-pos">
                Vieta
              </th>
              <th scope="col" className="standings-th-name">
                Braucējs
              </th>
              <th scope="col" className="standings-th-car">
                Auto
              </th>
              {rounds.map((r) => (
                <th scope="col" key={r.id} className="standings-th-round">
                  <Link href={r.href ?? roundHref(r.id)} title={r.label}>
                    {r.shortLabel}
                    <ArrowUpRight size={12} aria-hidden="true" />
                  </Link>
                </th>
              ))}
              {mode === "standings" && (
                <th scope="col" className="standings-th-total">
                  Kopā
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((e, i) => (
              <tr key={e.id}>
                <td className="standings-place">{position(e, i)}</td>
                <th scope="row" className="standings-driver">
                  {e.driver}
                </th>
                <td className="standings-car">{e.car ?? "—"}</td>
                {rounds.map((r) => (
                  <td key={r.id} className="standings-points">
                    <Score
                      value={pointsFor(e, r.id)}
                      best={
                        pointsFor(e, r.id) !== null &&
                        best[r.id] > 0 &&
                        pointsFor(e, r.id) === best[r.id]
                      }
                    />
                  </td>
                ))}
                {mode === "standings" && (
                  <td className="standings-total">{totalFor(e)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="standings-mobile-list">
        {rows.map((e, i) => (
          <details className="standings-mobile-item" key={e.id}>
            <summary>
              <span className="standings-mobile-position">
                {position(e, i)}
              </span>
              <span className="standings-mobile-identity">
                <strong>{e.driver}</strong>
                <small>{e.car}</small>
              </span>
              <span className="standings-mobile-total">
                {mode === "standings"
                  ? totalFor(e)
                  : (pointsFor(e, roundId) ?? "—")}
                <small>punkti</small>
              </span>
              <ChevronDown
                className="standings-mobile-chevron"
                size={17}
                aria-hidden="true"
              />
            </summary>
            <div className="standings-mobile-details">
              {rounds.map((r) => (
                <div key={r.id}>
                  <span>{r.label}</span>
                  <strong>{pointsFor(e, r.id) ?? "—"}</strong>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
function Select({
  id,
  label,
  value,
  options,
  onChange,
  className = "",
}: {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={`standings-control ${className}`}>
      <label htmlFor={id}>{label}</label>
      <div className="standings-select-wrap">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown size={17} aria-hidden="true" />
      </div>
    </div>
  );
}
export function ResultsBoard({
  seasons,
  mode = "standings",
  initialRoundId,
  initialClassId,
}: {
  seasons: ResultsSeason[];
  mode?: Mode;
  initialRoundId?: string;
  initialClassId?: string;
}) {
  const [seasonId, setSeasonId] = useState(seasons[0]?.id ?? "");
  const [classId, setClassId] = useState(
    seasons[0]?.classes.some((c) => c.id === initialClassId)
      ? initialClassId!
      : "all",
  );
  const [roundId, setRoundId] = useState(
    seasons[0]?.rounds.some((r) => r.id === initialRoundId)
      ? initialRoundId!
      : (seasons[0]?.rounds[0]?.id ?? ""),
  );
  const [search, setSearch] = useState("");
  const season = seasons.find((s) => s.id === seasonId) ?? seasons[0];
  const filtered = useMemo(
    () =>
      season?.entries.filter((e) =>
        `${e.driver} ${e.car ?? ""}`
          .toLocaleLowerCase("lv")
          .includes(search.trim().toLocaleLowerCase("lv")),
      ) ?? [],
    [season, search],
  );
  function changeSeason(id: string) {
    setSeasonId(id);
    setClassId("all");
    setRoundId(seasons.find((s) => s.id === id)?.rounds[0]?.id ?? "");
    setSearch("");
  }
  const title = mode === "standings" ? "Kopvērtējums" : "Posmu rezultāti";
  return (
    <main id="main-content" className="results-page">
      <div className="results-page-heading container">
        <nav className="results-breadcrumb" aria-label="Atrašanās vieta">
          <Link href="/">Sākums</Link>
          <span aria-hidden="true">/</span>
          <Link href="/rezultati">Rezultāti</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
        </nav>
        <div className="results-heading-grid">
          <h1>{title}</h1>
          <p>
            {mode === "standings"
              ? "Sezonas kopvērtējums un punktu sadalījums pa sacensību posmiem."
              : "Atsevišķu sacensību posmu rezultāti pa klasēm."}
          </p>
        </div>
      </div>
      <section className="results-surface" aria-label={title}>
        <div className="results-container container">
          <nav className="results-navigation" aria-label="Rezultātu skats">
            <Link
              href="/rezultati/kopvertejums"
              className={mode === "standings" ? "is-active" : ""}
              aria-current={mode === "standings" ? "page" : undefined}
            >
              Kopvērtējums
            </Link>
            <Link
              href="/rezultati"
              className={mode === "rounds" ? "is-active" : ""}
              aria-current={mode === "rounds" ? "page" : undefined}
            >
              Posmu rezultāti
            </Link>
            <Link href="/rezultati/arhivs" className="results-nav-archive">
              Rezultātu arhīvs
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </nav>
          {season ? (
            <>
              <div className="standings-toolbar">
                <Select
                  id="results-season"
                  label="Sacensības un sezona"
                  value={season.id}
                  options={seasons.map((s) => ({
                    value: s.id,
                    label: `${s.competition} · ${s.year}`,
                  }))}
                  onChange={changeSeason}
                  className="standings-control--season"
                />
                <Select
                  id="results-class"
                  label="Klase"
                  value={classId}
                  options={[
                    { value: "all", label: "Visas klases" },
                    ...season.classes.map((c) => ({
                      value: c.id,
                      label: c.name,
                    })),
                  ]}
                  onChange={setClassId}
                  className="standings-control--class"
                />
                {mode === "rounds" && (
                  <Select
                    id="results-round"
                    label="Posms"
                    value={roundId}
                    options={season.rounds.map((r) => ({
                      value: r.id,
                      label: r.label,
                    }))}
                    onChange={setRoundId}
                    className="standings-control--round"
                  />
                )}
                <label className="standings-search">
                  <span>Meklēt</span>
                  <span className="standings-search-field">
                    <Search size={17} aria-hidden="true" />
                    <input
                      type="search"
                      placeholder="Braucējs vai auto"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </span>
                </label>
              </div>
              {season.status === "preview" && (
                <div className="standings-preview-note" role="note">
                  <strong>DEMONSTRĀCIJAS DATI</strong>
                  <span>
                    Redzamie braucēji, punkti un braucienu laiki ir dizaina
                    piemērs, nevis oficiāli LR Events rezultāti.
                  </span>
                </div>
              )}
              {season.classes
                .filter((c) => classId === "all" || c.id === classId)
                .map((c) => (
                  <section
                    key={`${season.id}-${c.id}`}
                    aria-label={`${c.name} klase`}
                    style={{ marginBottom: 40 }}
                  >
                    <div className="standings-section-meta">
                      <div>
                        <p className="standings-competition">
                          {season.competition} <span>· {season.year}</span>
                        </p>
                        <h2>
                          {c.name}
                          {mode === "rounds" && (
                            <span className="standings-round-heading">
                              {" "}
                              ·{" "}
                              {
                                season.rounds.find((r) => r.id === roundId)
                                  ?.label
                              }
                            </span>
                          )}
                        </h2>
                      </div>
                      <div className="standings-table-info">
                        <span>
                          {
                            filtered.filter(
                              (e) =>
                                e.classId === c.id &&
                                (mode !== "rounds" ||
                                  hasRoundResult(e, roundId)),
                            ).length
                          }{" "}
                          braucēji
                        </span>
                        {season.standingStatus &&
                          season.status === "published" && (
                            <span className="standings-official-state">
                              {season.standingStatus === "official"
                                ? "Oficiāli rezultāti"
                                : "Provizoriski rezultāti"}
                            </span>
                          )}
                      </div>
                    </div>
                    <ClassResults
                      season={season}
                      classId={c.id}
                      entries={filtered.filter(
                        (e) =>
                          e.classId === c.id &&
                          (mode !== "rounds" || hasRoundResult(e, roundId)),
                      )}
                      mode={mode}
                      roundId={roundId}
                    />
                  </section>
                ))}
              <div className="standings-footer">
                <p>
                  {mode === "standings" ? "— nav rezultāta attiecīgajā posmā. Apvilkts augstākais parādītais punktu skaits klasē un posmā." : "Kopējie posma punkti ir publicētie rezultāti, nevis no laikiem aprēķināts vērtējums."}
                </p>
                <Link href="/rezultati/live">
                  Tiešsaistes rezultāti
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </>
          ) : (
            <div className="standings-no-season">
              <h2>Rezultāti vēl nav publicēti</h2>
              <p>Apstiprinātie rezultāti šeit parādīsies pēc publicēšanas.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
