import Image from "next/image";
import type { Sponsor } from "@/lib/sponsors";

export function SponsorMark({ sponsor, duplicate = false, variant = "default" }: { sponsor: Sponsor; duplicate?: boolean; variant?: "default" | "belt" }) {
  const logo = variant === "belt" ? sponsor.beltLogoSrc || sponsor.logoSrc : sponsor.logoSrc;
  const mark = logo ? <Image src={logo} alt={sponsor.label} width={120} height={36} style={{ objectFit: "contain" }} /> : <><span>{sponsor.label}</span><span className="sponsor-placeholder-caption">Logotipa vieta</span></>;
  return sponsor.href ? <a href={sponsor.href} target="_blank" rel="noopener noreferrer" tabIndex={duplicate ? -1 : undefined} aria-label={`${sponsor.label} (jaunā cilnē)`}>{mark}</a> : mark;
}
