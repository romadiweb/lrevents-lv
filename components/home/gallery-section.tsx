"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useState } from "react";
import { SocialLinks } from "@/components/layout/social-links";
import "./gallery-section.css";

const galleryImages = [
  { src: "/images/event-paddock.jpg", alt: "Autosporta automašīna LR Events trasē" },
  { src: "/images/event-action.jpg", alt: "Zila autosporta automašīna sacensību trasē" },
  { src: "/images/event-start.jpg", alt: "Sacensību starts LR Events pasākumā" },
  { src: "/images/event-track.jpg", alt: "Autosporta dalībnieks LR Events trasē" },
];

export function GallerySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const showPrevious = () => setActiveIndex((current) => (current - 1 + galleryImages.length) % galleryImages.length);
  const showNext = () => setActiveIndex((current) => (current + 1) % galleryImages.length);

  return (
    <section className="gallery-section" aria-label="LR Events foto galerija">
      <div className="gallery-images" aria-live="polite">
        {galleryImages.map((image, index) => (
          <Image
            className={`gallery-image${index === activeIndex ? " is-active" : ""}`}
            src={image.src}
            alt={index === activeIndex ? image.alt : ""}
            fill
            sizes="100vw"
            key={image.src}
          />
        ))}
      </div>
      <div className="gallery-shade" aria-hidden="true" />
      <div className="container gallery-controls">
        <div className="gallery-navigation" aria-label="Galerijas attēlu navigācija">
          <button type="button" onClick={showPrevious} aria-label="Iepriekšējais attēls">
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button type="button" onClick={showNext} aria-label="Nākamais attēls">
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
        <a
          className="gallery-cta"
          href="https://4rati.lv/foto-galerija/lr-events-kausa-izcina-autosprinta-5-posms-foto-dace-janova/"
          target="_blank"
          rel="noreferrer"
        >
          Skatīt galeriju <ExternalLink size={15} aria-hidden="true" />
        </a>
        <div className="gallery-community">
          <span>#LREVENTS</span>
          <div className="gallery-social"><SocialLinks /></div>
        </div>
      </div>
    </section>
  );
}
