export type Sponsor = { id: string; label: string; logoSrc?: string; href?: string };

// Replace these shared slots with approved sponsor names and local logo assets.
export const sponsors: Sponsor[] = Array.from({ length: 12 }, (_, index) => ({
  id: `sponsor-${index + 1}`,
  label: `Atbalstītājs ${String(index + 1).padStart(2, "0")}`,
}));
