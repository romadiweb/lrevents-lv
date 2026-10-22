export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
  categoryLabel: string;
  source: "upload" | "url";
};

// Existing homepage photographs, used only while the CMS connection is unavailable.
export const defaultGallery: GalleryImage[] = [
  { id: "paddock", src: "/images/event-paddock.jpg", alt: "Autosporta automašīna LR Events trasē" },
  { id: "action", src: "/images/event-action.jpg", alt: "Zila autosporta automašīna sacensību trasē" },
  { id: "start", src: "/images/event-start.jpg", alt: "Sacensību starts LR Events pasākumā" },
  { id: "track", src: "/images/event-track.jpg", alt: "Autosporta dalībnieks LR Events trasē" },
].map(image => ({ ...image, title: "", category: "", categoryLabel: "", source: "upload" }));
