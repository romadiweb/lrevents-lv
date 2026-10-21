import Image from "next/image";
import type { Sponsor } from "@/lib/sponsors";

export function SponsorMark({ sponsor }: { sponsor: Sponsor }) {
  return sponsor.logoSrc ? <Image src={sponsor.logoSrc} alt={sponsor.label} width={120} height={36} style={{ objectFit: "contain" }} /> : <><span>{sponsor.label}</span><span className="sponsor-placeholder-caption">Logotipa vieta</span></>;
}
