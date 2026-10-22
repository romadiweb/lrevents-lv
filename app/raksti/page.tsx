import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fragment, Suspense } from "react";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { articleArchiveHref, getArticleArchive, getArticleCategory, type Article } from "@/lib/articles";
import { getArticles, getCategories } from "@/lib/cms/content";
import "./raksti.css";

export const metadata: Metadata = {
  title: "Raksti — LR Events",
  description: "LR Events jaunumi, sacensību stāsti, aizkulises un dalībnieki.",
};

type ArchivePageProps = { searchParams: Promise<{ kategorija?: string | string[]; lapa?: string | string[] }> };

function ArticleMeta({ article }: { article: Article }) {
  return <span className="news-meta"><span>{article.categoryLabel ?? getArticleCategory(article.category)?.label}</span><span aria-hidden="true">/</span><time dateTime={article.publishedAt}>{article.date}</time></span>;
}

async function ArticleArchive({ searchParams }: ArchivePageProps) {
  const params = await searchParams;
  const [articles, articleCategories] = await Promise.all([getArticles(), getCategories()]);
  const archive = getArticleArchive(articles, typeof params.kategorija === "string" ? params.kategorija : "", typeof params.lapa === "string" ? params.lapa : "1", articleCategories);
  const { featured, tiles, rows, category, page, totalPages } = archive;
  const pageNumbers = [...new Set([1, page - 1, page, page + 1, totalPages])].filter((number) => number >= 1 && number <= totalPages).sort((a, b) => a - b);

  return <>
    {articles.some(article => article.isDemo) && <p className="news-demo-note">Paraugraksti — virsraksti, datumi un saturs ir ilustratīvi.</p>}
    <form action="/raksti" className="news-toolbar">
      <div className="news-filter">
        <label htmlFor="news-category">Kategorija</label>
        <span className="news-select-wrap">
          <select id="news-category" name="kategorija" defaultValue={category} key={category}>
            <option value="">Visas kategorijas</option>
            {articleCategories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
          <ChevronDown size={16} aria-hidden="true" />
        </span>
      </div>
      <button className="news-filter-submit" type="submit">Atlasīt <ArrowRight size={16} aria-hidden="true" /></button>
      {category && <Link className="news-reset" href="/raksti">Notīrīt filtru</Link>}
      <p className="news-results-count">{archive.total} {archive.total === 1 ? "raksts" : "raksti"}</p>
    </form>

    {featured && <section className="news-latest" aria-label="Jaunākie raksti">
      <article className="news-feature">
        <Link href={featured.href} className="news-feature-link">
          <div className="news-feature-copy">
            <span className="news-feature-label">Jaunākais raksts</span>
            <div>
              <ArticleMeta article={featured} />
              <h2>{featured.title}</h2>
              <p>{featured.summary}</p>
            </div>
            <span className="news-read">Lasīt rakstu <ArrowRight size={18} aria-hidden="true" /></span>
          </div>
          <div className="news-feature-image"><Image src={featured.image} alt="" fill sizes="(max-width: 767px) 100vw, 70vw" loading="eager" /></div>
        </Link>
      </article>
      {tiles.length > 0 && <div className="news-image-grid">
        {tiles.map((article) => <article className="news-tile" key={article.id}>
          <Link href={article.href}>
            <div className="news-tile-image"><Image src={article.image} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" /></div>
            <ArticleMeta article={article} />
            <h2>{article.title}<ArrowRight size={18} aria-hidden="true" /></h2>
          </Link>
        </article>)}
      </div>}
    </section>}

    {rows.length > 0 && <section className="news-archive" aria-labelledby="news-archive-title">
      <div className="news-archive-heading"><h2 id="news-archive-title">{page === 1 ? "Vairāk rakstu" : "Rakstu arhīvs"}</h2><span>{String(page).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}</span></div>
      <ol className="news-list" start={archive.first + (page === 1 ? tiles.length + 1 : 0)}>
        {rows.map((article) => <li key={article.id}>
          <Link href={article.href} className="news-row">
            <ArticleMeta article={article} />
            <h3>{article.title}</h3>
            <span className="news-row-read">Lasīt rakstu <ArrowRight size={17} aria-hidden="true" /></span>
          </Link>
        </li>)}
      </ol>
    </section>}

    {archive.total === 0 && <div className="news-empty"><h2>Raksti vēl top</h2><p>Jauni stāsti būs pieejami drīzumā.</p><Link href="/raksti">Skatīt visas kategorijas <ArrowRight size={17} aria-hidden="true" /></Link></div>}

    {archive.total > 0 && <div className="news-pagination-bar">
      <p>{archive.first}–{archive.last} no {archive.total} rakstiem</p>
      {totalPages > 1 && <nav className="news-pagination" aria-label="Rakstu lapas">
        {page > 1 ? <Link href={articleArchiveHref(category, page - 1)} aria-label="Iepriekšējā lapa"><ArrowLeft size={18} aria-hidden="true" /></Link> : <span className="news-page-disabled" aria-hidden="true"><ArrowLeft size={18} /></span>}
        {pageNumbers.map((number, index) => <Fragment key={number}>{index > 0 && number - pageNumbers[index - 1] > 1 && <span aria-hidden="true">…</span>}<Link href={articleArchiveHref(category, number)} aria-label={`${number}. lapa`} aria-current={page === number ? "page" : undefined}>{number}</Link></Fragment>)}
        {page < totalPages ? <Link href={articleArchiveHref(category, page + 1)} aria-label="Nākamā lapa"><ArrowRight size={18} aria-hidden="true" /></Link> : <span className="news-page-disabled" aria-hidden="true"><ArrowRight size={18} /></span>}
      </nav>}
    </div>}
  </>;
}

export default function ArticlesPage(props: ArchivePageProps) {
  return <main id="main-content" className="news-page site-content-page">
    <div className="container">
      <nav className="news-breadcrumb" aria-label="Atrašanās vieta"><Link href="/">Sākums</Link><span aria-hidden="true">/</span><span aria-current="page">Raksti</span></nav>
      <header className="news-page-heading"><h1>Raksti</h1><p>No trases un aizkulisēm.<br />Stāsti, kas turpina sacensību dienu.</p></header>
      <Suspense fallback={<p className="news-loading" role="status">Ielādē rakstus…</p>}><ArticleArchive {...props} /></Suspense>
    </div>
  </main>;
}
