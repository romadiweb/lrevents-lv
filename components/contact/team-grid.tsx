import { UserRound, ArrowUpRight } from "lucide-react";
import type { ContactContent } from "@/lib/contact-content";

export function TeamGrid({ team }: { team: ContactContent["team"] }) {
  return (
    <ul className="contact-team-grid">
      {team.map(({ name, role, email }) => (
        <li className="contact-person" key={email}>
          <div
            className="contact-avatar"
            role="img"
            aria-label={`${name} — foto vēl nav pievienots`}
          >
            <UserRound size={112} strokeWidth={0.8} aria-hidden="true" />
          </div>
          <h3>{name}</h3>
          <p>{role}</p>
          <a href={`mailto:${email}`}>
            {email}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
