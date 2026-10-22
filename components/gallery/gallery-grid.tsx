"use client";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, ChevronLeft, ChevronRight, X, ImageOff } from "lucide-react";
import { useRef, useState } from "react";
import type { GalleryImage } from "@/lib/gallery";

function Photo({ image, full = false }: { image: GalleryImage; full?: boolean }) {
  const [failed, setFailed] = useState(false);
  return failed ? <span className="photo-failed" role="img" aria-label={`${image.alt}: attēls nav pieejams`}><ImageOff size={28} aria-hidden="true" /><span>Attēlu nevar ielādēt</span></span> : <Image src={image.src} alt={image.alt} fill sizes={full ? "95vw" : "(max-width: 540px) 100vw, (max-width: 900px) 50vw, (max-width: 1150px) 33vw, 25vw"} unoptimized={image.source === "url"} className={full ? "photo-full-image" : "photo-thumbnail"} onError={() => setFailed(true)} />;
}

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const current = selected === null ? null : images[selected];
  function move(direction: number) { setSelected(index => index === null ? null : (index + direction + images.length) % images.length); }
  return <Dialog.Root open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
    <ul className="photo-grid" aria-label="Galerijas attēli">{images.map((image, index) => <li key={image.id}>
      <button type="button" className="photo-tile" aria-label={`Atvērt attēlu: ${image.title || image.alt}`} aria-haspopup="dialog" onClick={event => { trigger.current = event.currentTarget; setSelected(index); }}>
        <span className="photo-square"><Photo image={image} /><span className="photo-expand" aria-hidden="true"><ArrowUpRight size={22} /></span></span>
        {(image.title || image.categoryLabel) && <span className="photo-caption">{image.title && <strong>{image.title}</strong>}{image.categoryLabel && <span>{image.categoryLabel}</span>}</span>}
      </button>
    </li>)}</ul>
    <Dialog.Portal><Dialog.Overlay className="photo-overlay" /><Dialog.Content className="photo-dialog" onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus(); }} onKeyDown={event => { if (images.length > 1 && (event.key === "ArrowLeft" || event.key === "ArrowRight")) { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); } }}>
      <div className="photo-dialog-header"><div><Dialog.Title>{current?.title || current?.alt || "Galerijas attēls"}</Dialog.Title><Dialog.Description>{current?.categoryLabel ? `${current.categoryLabel} · ` : ""}{selected === null ? "" : `${selected + 1} / ${images.length}`}</Dialog.Description></div><Dialog.Close className="photo-close" aria-label="Aizvērt attēlu"><X size={24} /></Dialog.Close></div>
      <div className="photo-full">{current && <Photo key={current.id} image={current} full />}</div>
      {images.length > 1 && <div className="photo-dialog-controls"><button type="button" onClick={() => move(-1)} aria-label="Iepriekšējais attēls"><ChevronLeft size={22} /><span>Iepriekšējais</span></button><button type="button" onClick={() => move(1)} aria-label="Nākamais attēls"><span>Nākamais</span><ChevronRight size={22} /></button></div>}
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>;
}
