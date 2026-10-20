import Image from "next/image";
import { ArrowRight, Trophy } from "lucide-react";
import { teamStandings } from "@/lib/mock-standings";
import "./standings-section.css";

export function StandingsSection() {
  const podiumOrder = [teamStandings[1], teamStandings[0], teamStandings[2]];

  return (
    <section className="standings-section" id="standings" aria-labelledby="standings-title">
      <div className="standings-backdrop" aria-hidden="true">
        <Image src="/images/event-track.jpg" alt="" fill sizes="100vw" />
      </div>
      <div className="standings-shade" aria-hidden="true" />

      <div className="container standings-intro">
        <div>
          <p className="standings-status">
            <Trophy size={15} aria-hidden="true" />
            Pēc pieciem posmiem
          </p>
          <h2 id="standings-title">Komandu kopvērtējums 2026</h2>
        </div>

        <a className="standings-link" href="#standings-podium">
          Skatīt kopvērtējumu <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>

      <div className="container standings-podium" id="standings-podium">
        {podiumOrder.map((team) => (
          <article className={`standing-card standing-card--rank-${team.rank}`} key={team.name}>
            <div className="standing-rank" aria-label={`${team.rank}. vieta`}>
              {team.rank}
            </div>

            <div className="standing-monogram" aria-hidden="true">
              {team.name.slice(0, 3)}
            </div>

            <div className="standing-team">
              <h3>{team.name}</h3>
              <div className="standing-points">
                <strong>{team.points}</strong>
                <span>punkti kopā</span>
              </div>
            </div>

            <div className="standing-rounds" aria-label="Punkti katrā posmā">
              {team.rounds.map((points, index) => (
                <span key={`${team.name}-${index}`}>
                  <small>{index + 1}. posms</small>
                  <strong>{points ?? "—"}</strong>
                </span>
              ))}
            </div>

            <ul className="standing-members" aria-label={`${team.name} komandas dalībnieki`}>
              {team.members.map((member) => (
                <li key={member}>{member}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p className="container standings-note">
        Maketa dati no pašreizējās komandu kopvērtējuma tabulas; vēlāk pārvaldāmi CMS.
      </p>
    </section>
  );
}
