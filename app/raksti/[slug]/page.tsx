import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { articles as demoArticles, articleArchiveHref, getArticleCategory } from "@/lib/articles";
import { getArticles } from "@/lib/cms/content";
import "../raksti.css";

type ArticlePageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return demoArticles.map((article) => ({ slug: article.id })); }
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const articles = await getArticles();
  const article = articles.find((item) => item.id === slug);
  return { title: article ? `${article.title} — LR Events` : "Raksts nav atrasts — LR Events", description: article?.summary, robots: article?.isDemo ? { index: false } : undefined };
}

async function ArticleContent({ params }: ArticlePageProps) {
  const { slug } = await params;
  const articles = await getArticles();
  const article = articles.find((item) => item.id === slug);
  if (!article) notFound();
  const related = articles.filter((item) => item.id !== article.id && item.category === article.category).slice(0, 2);
  return <main id="main-content" className="news-page news-detail site-content-page"><div className="container">
    <nav className="news-breadcrumb" aria-label="Atrašanās vieta"><Link href="/">Sākums</Link><span aria-hidden="true">/</span><Link href="/raksti">Raksti</Link><span aria-hidden="true">/</span><span aria-current="page">{article.categoryLabel ?? getArticleCategory(article.category)?.label}</span></nav>
    <article>
      <header className="news-detail-heading">
        <Link className="news-detail-category" href={articleArchiveHref(article.category)}>{article.categoryLabel ?? getArticleCategory(article.category)?.label}</Link>
        <h1>{article.title}</h1>
        <p><time dateTime={article.publishedAt}>{article.date}</time>{article.isDemo && <><span aria-hidden="true"> / </span>Paraugraksts</>}</p>
      </header>
      <div className="news-detail-image"><Image src={article.image} alt="" fill sizes="(max-width: 1280px) 100vw, 1280px" loading="eager" /></div>
      <div className="news-detail-body">{article.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<Link className="news-back" href="/raksti"><ArrowLeft size={18} aria-hidden="true" />Visi raksti</Link></div>
    </article>
    {related.length > 0 && <section className="news-archive" aria-labelledby="related-title"><div className="news-archive-heading"><h2 id="related-title">Vēl šajā kategorijā</h2></div><ul className="news-list">{related.map((item) => <li key={item.id}><Link className="news-row" href={item.href}><time dateTime={item.publishedAt}>{item.date}</time><h3>{item.title}</h3><span className="news-row-read">Lasīt rakstu<ArrowRight size={17} aria-hidden="true" /></span></Link></li>)}</ul></section>}
  </div></main>;
}

export default function ArticlePage(props: ArticlePageProps) {
  return <Suspense fallback={<main id="main-content" className="news-page container"><p className="news-loading" role="status">Ielādē rakstu…</p></main>}><ArticleContent {...props} /></Suspense>;
}
