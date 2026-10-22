"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { SocialLinks } from "@/components/layout/social-links";
import type { GalleryImage } from "@/lib/gallery";
import "./gallery-section.css";

const galleryAutoplayDuration = 6000;

export function GallerySection({ images: galleryImages }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const [hasNavigated, setHasNavigated] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (galleryImages.length < 2 || paused) return;
    const timer = window.setTimeout(() => {
      setPreviousIndex(activeIndex);
      setDirection("next");
      setHasNavigated(true);
      setActiveIndex((activeIndex + 1) % galleryImages.length);
    }, galleryAutoplayDuration);

    return () => window.clearTimeout(timer);
  }, [activeIndex, galleryImages.length, paused]);

  if (galleryImages.length === 0) return null;

  const showPrevious = () => {
    setPreviousIndex(activeIndex);
    setDirection("previous");
    setHasNavigated(true);
    setActiveIndex((activeIndex - 1 + galleryImages.length) % galleryImages.length);
  };
  const showNext = () => {
    setPreviousIndex(activeIndex);
    setDirection("next");
    setHasNavigated(true);
    setActiveIndex((activeIndex + 1) % galleryImages.length);
  };
  const progressStyle = {
    "--gallery-autoplay-duration": `${galleryAutoplayDuration}ms`,
  } as CSSProperties;

  return (
    <section className="gallery-section" aria-label="LR Events foto galerija">
      <div
        className={`gallery-images${hasNavigated ? " has-navigated" : ""}`}
        aria-live={paused ? "polite" : "off"}
        data-direction={direction}
      >
        {galleryImages.map((image, index) => (
          <div
            className={`gallery-slide${index === activeIndex ? " is-active" : ""}${index === previousIndex ? " is-exiting" : ""}`}
            key={image.id}
            aria-hidden={index !== activeIndex}
          >
            <Image
              className="gallery-image"
              src={image.src}
              alt={index === activeIndex ? image.alt : ""}
              fill
              sizes="100vw"
              unoptimized={image.source === "url"}
            />
          </div>
        ))}
      </div>
      <div className="gallery-shade" aria-hidden="true" />
      {galleryImages.length > 1 && <div className="gallery-progress" aria-hidden="true">
        <span key={`${activeIndex}-${paused}`} style={{ ...progressStyle, animationPlayState: paused ? "paused" : "running" }} />
      </div>}
      <div className="container gallery-controls">
        {galleryImages.length > 1 ? <div className="gallery-navigation" aria-label="Galerijas attēlu navigācija">
          <button type="button" onClick={showPrevious} aria-label="Iepriekšējais attēls">
            <span className="gallery-navigation-ring" aria-hidden="true">
              <svg viewBox="0 0 72 72"><circle cx="36" cy="36" r="34" pathLength="1" /></svg>
            </span>
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button type="button" onClick={showNext} aria-label="Nākamais attēls">
            <span className="gallery-navigation-ring" aria-hidden="true">
              <svg viewBox="0 0 72 72"><circle cx="36" cy="36" r="34" pathLength="1" /></svg>
            </span>
            <ChevronRight size={20} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? "Turpināt attēlu maiņu" : "Apturēt attēlu maiņu"}>{paused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}</button>
        </div> : <div />}
        <Link
          className="gallery-cta"
          href="/galerija"
        >
          Skatīt galeriju
        </Link>
        <div className="gallery-community">
          <span>#LREVENTS</span>
          <div className="gallery-social"><SocialLinks /></div>
        </div>
      </div>
    </section>
  );
}
