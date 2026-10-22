"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { ArticlePreview } from "@/lib/mock-events";
import "./articles-section.css";

export function ArticlesSection({ articles }: { articles: ArticlePreview[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const featuredRef = useRef<HTMLAnchorElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const changingRef = useRef(false);
  const animationsRef = useRef<Animation[]>([]);
  const mountedRef = useRef(true);
  const featured = articles[activeIndex] ?? articles[0];
  const supporting = articles.filter((_, index) => index !== activeIndex);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      animationsRef.current.forEach((animation) => animation.cancel());
    };
  }, []);

  if (!featured) return null;

  const changeArticle = async (direction: -1 | 1) => {
    if (changingRef.current || articles.length < 2) return;
    changingRef.current = true;
    setIsChanging(true);
    const elements = [featuredRef.current, gridRef.current].filter(
      (element): element is HTMLAnchorElement | HTMLDivElement => element !== null,
    );
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const distance = reducedMotion ? 0 : 20;
    const animate = (entering: boolean) => {
      animationsRef.current = elements.map((element) => element.animate(
        entering
          ? [{ opacity: 0, transform: `translateX(${direction * distance}px)` }, { opacity: 1, transform: "translateX(0)" }]
          : [{ opacity: 1, transform: "translateX(0)" }, { opacity: 0, transform: `translateX(${-direction * distance}px)` }],
        {
          duration: reducedMotion ? 80 : entering ? 280 : 140,
          easing: entering ? "cubic-bezier(0.16, 1, 0.3, 1)" : "ease-in",
          fill: "both",
        },
      ));
      return Promise.allSettled(animationsRef.current.map((animation) => animation.finished));
    };

    try {
      await animate(false);
      if (!mountedRef.current) return;
      // Commit the replacement while the old content is invisible, before animating in.
      flushSync(() => setActiveIndex((current) => (current + direction + articles.length) % articles.length));
      animationsRef.current.forEach((animation) => animation.cancel());
      await animate(true);
    } finally {
      animationsRef.current.forEach((animation) => animation.cancel());
      animationsRef.current = [];
      changingRef.current = false;
      if (mountedRef.current) setIsChanging(false);
    }
  };

  return (
    <section className="articles-section" aria-labelledby="articles-title">
      <div className="container">
        <div className="articles-heading">
          <h2 id="articles-title">Raksti</h2>
          <Link href="/raksti" className="articles-view-all">
            Skatīt visus rakstus
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <article className="featured-article" id={featured.id}>
          {articles.length > 1 && (
            <div className="articles-carousel-navigation" aria-label="Izvēlētā raksta navigācija">
              <button type="button" onClick={() => void changeArticle(-1)} aria-disabled={isChanging} aria-label="Iepriekšējais raksts">
                <span className="articles-navigation-ring" aria-hidden="true">
                  <svg viewBox="0 0 72 72"><circle cx="36" cy="36" r="34" pathLength="1" /></svg>
                </span>
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <span className="articles-carousel-count" aria-live="polite">
                {String(activeIndex + 1).padStart(2, "0")}
                <span aria-hidden="true"> / </span>
                {String(articles.length).padStart(2, "0")}
              </span>
              <button type="button" onClick={() => void changeArticle(1)} aria-disabled={isChanging} aria-label="Nākamais raksts">
                <span className="articles-navigation-ring" aria-hidden="true">
                  <svg viewBox="0 0 72 72"><circle cx="36" cy="36" r="34" pathLength="1" /></svg>
                </span>
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          )}
          <Link ref={featuredRef} className="featured-article-link" href={featured.href} aria-label={`Lasīt rakstu: ${featured.title}`}>
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
          <div ref={gridRef} className="article-grid" id="articles-grid">
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
