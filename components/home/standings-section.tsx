import Image from "next/image";
import { ArrowRight, Trophy } from "lucide-react";
import { teamStandings } from "@/lib/mock-standings";
import { getCarBrand } from "@/lib/car-brands";
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
        {podiumOrder.map((team) => {
          const carBrand = getCarBrand(team.carBrand);
          return (
            <article className={`standing-card standing-card--rank-${team.rank}`} key={team.name}>
              <div className="standing-rank" aria-label={`${team.rank}. vieta`}>
                {team.rank}
              </div>

              {carBrand && (
                <div className="standing-brand" aria-hidden="true">
                  <Image src={carBrand.logo} alt="" fill sizes="180px" />
                </div>
              )}

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
                  <li key={member}>
                    <svg className="standing-driver" viewBox="0 0 40 44" fill="currentColor" aria-hidden="true" focusable="false">
                      <circle cx="20" cy="12" r="8" />
                      <path d="M3 44v-7c0-8 7.6-13 17-13s17 5 17 13v7H3Z" />
                    </svg>
                    <span>{member}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <p className="container standings-note">
        Maketa dati no pašreizējās komandu kopvērtējuma tabulas; vēlāk pārvaldāmi CMS. Automašīnu markas ir ilustratīvas.
      </p>
    </section>
  );
}
