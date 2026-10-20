import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ArticlePreview } from "@/lib/mock-events";
import "./articles-section.css";

export function ArticlesSection({ articles }: { articles: ArticlePreview[] }) {
  const [featured, ...supporting] = articles;

  if (!featured) return null;

  return (
    <section className="articles-section" aria-labelledby="articles-title">
      <div className="container">
        <div className="articles-heading">
          <h2 id="articles-title">Raksti</h2>
          <Link href="#articles-grid" className="articles-view-all">
            Skatīt visus rakstus
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <article className="featured-article" id={featured.id}>
          <Link className="featured-article-link" href={featured.href} aria-label={`Lasīt rakstu: ${featured.title}`}>
            <span className="featured-article-image" aria-hidden="true">
              <Image
                src={featured.image}
                alt=""
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </span>
            <span className="featured-article-card">
              <span className="featured-article-date">{featured.date}</span>
              <span className="featured-article-title">{featured.title}</span>
              <span className="featured-article-summary">{featured.summary}</span>
              <span className="featured-article-cta">
                Lasīt rakstu <ArrowRight size={18} aria-hidden="true" />
              </span>
            </span>
            <span className="featured-article-bottom-line" aria-hidden="true" />
          </Link>
        </article>

        {supporting.length > 0 && (
          <div className="article-grid" id="articles-grid">
            {supporting.map((article) => (
              <article className="article-card" id={article.id} key={article.id}>
                <Link href={article.href} className="article-card-link" aria-label={`Lasīt: ${article.title}`}>
                  <span className="article-card-image">
                    <Image
                      src={article.image}
                      alt=""
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </span>
                  <span className="article-card-date">{article.date}</span>
                  <span className="article-card-title">{article.title}</span>
                  <span className="article-card-arrow" aria-hidden="true"><ArrowRight size={18} /></span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
