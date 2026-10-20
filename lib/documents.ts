export type EventDocument = {
  title: string;
  description: string;
  category: "Sezonas nolikums" | "Biļetens" | "Posma nolikums";
  href: string;
};

export const eventDocuments: EventDocument[] = [
  {
    title: "Sezonas nolikums autosprintā 2026",
    description: "Viss par sacensību norisi un kārtību pilnas sezonas izklāstā.",
    category: "Sezonas nolikums",
    href: "https://drive.google.com/file/d/1fVtnBwwBigGPqNknJToy2xzcgMJ5QOVQ/view?usp=sharing",
  },
  {
    title: "Biļetens Nr. 1 (5. posms)",
    description: "Informācija par piektā posma norisi un kārtību.",
    category: "Biļetens",
    href: "https://drive.google.com/file/d/1K4S04_A9yT9EA5xOjEu7Z4T5qnSiMp-I/view?usp=sharing",
  },
  {
    title: "Biļetens Nr. 2 (5. posms)",
    description: "Papildu informācija par piektā posma norisi un kārtību.",
    category: "Biļetens",
    href: "https://drive.google.com/file/d/1JbCZWrsqC_b67jeJr9xP1DhZ4ERdHXlA/view?usp=sharing",
  },
  {
    title: "LR Events Kausa izcīņa autosprintā — 5. posma nolikums",
    description: "Vispārējie noteikumi, sacensību kārtība, punktu sistēma un apbalvošana.",
    category: "Posma nolikums",
    href: "https://drive.google.com/file/d/1sSYjogXj-C8UfgsCgpVzZvfW2kr4c5TC/view?usp=sharing",
  },
];
