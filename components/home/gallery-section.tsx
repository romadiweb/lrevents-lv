"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { SocialLinks } from "@/components/layout/social-links";
import "./gallery-section.css";

const galleryAutoplayDuration = 6000;

const galleryImages = [
  { src: "/images/event-paddock.jpg", alt: "Autosporta automašīna LR Events trasē" },
  { src: "/images/event-action.jpg", alt: "Zila autosporta automašīna sacensību trasē" },
  { src: "/images/event-start.jpg", alt: "Sacensību starts LR Events pasākumā" },
  { src: "/images/event-track.jpg", alt: "Autosporta dalībnieks LR Events trasē" },
];

export function GallerySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPreviousIndex(activeIndex);
      setDirection("next");
      setHasNavigated(true);
      setActiveIndex((activeIndex + 1) % galleryImages.length);
    }, galleryAutoplayDuration);

    return () => window.clearTimeout(timer);
  }, [activeIndex]);

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
        aria-live="polite"
        data-direction={direction}
      >
        {galleryImages.map((image, index) => (
          <div
            className={`gallery-slide${index === activeIndex ? " is-active" : ""}${index === previousIndex ? " is-exiting" : ""}`}
            key={image.src}
          >
            <Image
              className="gallery-image"
              src={image.src}
              alt={index === activeIndex ? image.alt : ""}
              fill
              sizes="100vw"
            />
          </div>
        ))}
      </div>
      <div className="gallery-shade" aria-hidden="true" />
      <div className="gallery-progress" aria-hidden="true">
        <span key={activeIndex} style={progressStyle} />
      </div>
      <div className="container gallery-controls">
        <div className="gallery-navigation" aria-label="Galerijas attēlu navigācija">
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
        </div>
        <a
          className="gallery-cta"
          href="https://4rati.lv/foto-galerija/lr-events-kausa-izcina-autosprinta-5-posms-foto-dace-janova/"
          target="_blank"
          rel="noreferrer"
        >
          Skatīt galeriju
        </a>
        <div className="gallery-community">
          <span>#LREVENTS</span>
          <div className="gallery-social"><SocialLinks /></div>
        </div>
      </div>
    </section>
  );
}
