import Image from "next/image";
import type { Sponsor } from "@/lib/sponsors";

export function SponsorMark({ sponsor, duplicate = false }: { sponsor: Sponsor; duplicate?: boolean }) {
  const mark = sponsor.logoSrc ? <Image src={sponsor.logoSrc} alt={sponsor.label} width={120} height={36} style={{ objectFit: "contain" }} /> : <><span>{sponsor.label}</span><span className="sponsor-placeholder-caption">Logotipa vieta</span></>;
  return sponsor.href ? <a href={sponsor.href} target="_blank" rel="noopener noreferrer" tabIndex={duplicate ? -1 : undefined} aria-label={`${sponsor.label} (jaunā cilnē)`}>{mark}</a> : mark;
}
