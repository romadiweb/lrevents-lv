export const articleCategories = [
  { id: "jaunumi", label: "Jaunumi" },
  { id: "sacensibas", label: "Sacensības" },
  { id: "aizkulises", label: "Aizkulises" },
  { id: "dalibnieki", label: "Dalībnieki" },
] as const;

export type ArticleCategory = string;
export type ArticlePreview = {
  id: string;
  title: string;
  summary: string;
  date: string;
  image: string;
  href: string;
};
export type Article = ArticlePreview & {
  publishedAt: string;
  category: ArticleCategory;
  categoryLabel?: string;
  body: string[];
  isDemo: boolean;
};

type ArticleSeed = [id: string, title: string, summary: string, publishedAt: string, category: ArticleCategory, image: string];

// Illustrative editorial content, dates, and categories, not actual publication history.
// Replace this data source with published CMS records; keep the Article shape and archive rules.
const seeds: ArticleSeed[] = [
  ["sezonas-aizkulises", "Autosprints pilsētvidē: sezonas aizkulises", "Ieskats trasē, komandās un cilvēkos, kas veido LR Events sacensību dienu.", "2026-10-21", "aizkulises", "event-paddock.jpg"],
  ["trases-ritms", "Trases ritms un precizitāte", "Trajektorija, koncentrēšanās un īstais brīdis nākamajam pagriezienam.", "2026-10-18", "sacensibas", "event-track.jpg"],
  ["dalibnieku-stasti", "Dalībnieku stāsti no piektā posma", "Cilvēki aiz starta numuriem un viņu ceļš līdz starta līnijai.", "2026-10-16", "dalibnieki", "event-start.jpg"],
  ["diena-kustiba", "Sacensību diena kustībā", "No pirmās ierašanās trasē līdz pēdējam finišam — viena diena attēlos.", "2026-10-14", "sacensibas", "event-action.jpg"],
  ["gatavosanas-startam", "Gatavojoties nākamajam startam", "Pārdomāta gatavošanās palīdz trasē pievērsties pašam svarīgākajam.", "2026-10-10", "jaunumi", "lr-events-hero.jpg"],
  ["komandas-darbs", "Komandas darbs otrpus trasei", "Autosports ir arī kopīgs darbs, atbalsts un sarunas starp braucieniem.", "2026-10-07", "aizkulises", "event-paddock.jpg"],
  ["pirmais-autosprints", "Pirmais autosprints: ar ko sākt?", "Iepazīsti sacensību dienas ritmu un atrodi dalībniekiem noderīgo informāciju.", "2026-10-03", "dalibnieki", "event-action.jpg"],
  ["sezonas-piezimes", "Sezonas piezīmes: ko paņemam līdzi", "Pieredze, ko gribas paturēt arī nākamajam startam.", "2026-09-28", "jaunumi", "event-track.jpg"],
  ["trases-mirkli", "Trases mirkļi fotogrāfijās", "Ātrums, koncentrēšanās un tās mazās detaļas, ko pamana fotogrāfs.", "2026-09-25", "aizkulises", "event-start.jpg"],
  ["savs-brauciens", "Katram savs brauciens, visiem viena aizraušanās", "Dažādi starta numuri un automašīnas, bet kopīga interese par autosportu.", "2026-09-20", "dalibnieki", "event-action.jpg"],
  ["starta-linija", "Brīdis pirms starta līnijas", "Īss klusums, skatiens uz trasi un gatavība savam braucienam.", "2026-09-16", "sacensibas", "event-start.jpg"],
  ["jaunumi-dalibniekiem", "Noderīgās saites dalībniekiem vienuviet", "Kur meklēt nolikumus, informāciju par dalību un sacensību rezultātus.", "2026-09-11", "jaunumi", "lr-events-hero.jpg"],
  ["organizatoru-ikdiena", "Diena sākas pirms pirmā starta", "Ieskats darbā, kas sacensību dienā parasti paliek ārpus kadra.", "2026-09-05", "aizkulises", "event-paddock.jpg"],
  ["satikti-trase", "Satikti trasē: sarunas starp braucieniem", "Autosporta kopiena veidojas arī tur, kur hronometrs uz brīdi apstājas.", "2026-08-29", "dalibnieki", "event-start.jpg"],
  ["pagrieziena-stasts", "Katram pagriezienam savs stāsts", "Skats uz trasi no dalībnieka un skatītāja perspektīvas.", "2026-08-23", "sacensibas", "event-track.jpg"],
  ["satiksanas-vieta", "Trase kā satikšanās vieta", "Vieta dalībniekiem, atbalstītājiem un tiem, kas autosportu iepazīst pirmoreiz.", "2026-08-16", "jaunumi", "event-paddock.jpg"],
  ["fotografa-skatupunkts", "Sacensības no fotogrāfa skatpunkta", "Pamanīt kustību un saglabāt vienu mirkli no visas dienas.", "2026-08-08", "aizkulises", "event-action.jpg"],
  ["pieredze-trase", "Pieredze, kas krājas ar katru startu", "Pacietība un zinātkāre ir daļa no ceļa, ko katrs dalībnieks veido pats.", "2026-08-01", "dalibnieki", "event-track.jpg"],
];

export const articles: Article[] = seeds.map(([id, title, summary, publishedAt, category, image]) => ({
  id, title, summary, publishedAt, category,
  date: new Intl.DateTimeFormat("lv-LV", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Riga" }).format(new Date(`${publishedAt}T12:00:00Z`)),
  image: `/images/${image}`,
  href: `/raksti/${id}`,
  isDemo: true,
  body: [summary, "Šī ir paraugraksta lapa, kas ļauj apskatīt raksta noformējumu. Virsraksts, datums un teksts ir ilustratīvi; tie nav ziņojums par notikušām sacensībām. Pilnais redakcijas saturs tiks pievienots vēlāk."],
}));

export const articlePreviews: ArticlePreview[] = articles.slice(0, 4).map((article) => ({ ...article, date: "Demo raksts" }));

export function getArticleCategory(id: string) {
  return articleCategories.find((category) => category.id === id);
}

export function articleArchiveHref(category = "", page = 1) {
  const params = new URLSearchParams();
  if (category) params.set("kategorija", category);
  if (page > 1) params.set("lapa", String(page));
  return `/raksti${params.size ? `?${params}` : ""}`;
}

/** First page: 1 feature + 6 image tiles + 5 rows. Later pages: 5 rows only. */
export function getArticleArchive(source: Article[], categoryInput = "", pageInput = "1", categories: readonly { id: string }[] = articleCategories) {
  const category = categories.find(item => item.id === categoryInput)?.id ?? "";
  const matching = source.filter((article) => !category || article.category === category)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.id.localeCompare(b.id));
  const visualCount = Math.min(7, matching.length);
  const totalPages = Math.max(1, Math.ceil((matching.length - visualCount) / 5));
  const requestedPage = /^\d+$/.test(pageInput) ? Number(pageInput) : 1;
  const page = Math.min(totalPages, Math.max(1, Number.isSafeInteger(requestedPage) ? requestedPage : 1));
  const offset = visualCount + (page - 1) * 5;
  return {
    category, page, totalPages, total: matching.length,
    featured: page === 1 ? matching[0] : undefined,
    tiles: page === 1 ? matching.slice(1, visualCount) : [],
    rows: matching.slice(offset, offset + 5),
    first: matching.length ? page === 1 ? 1 : offset + 1 : 0,
    last: Math.min(matching.length, offset + 5),
  };
}
