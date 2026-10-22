import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { getGallery, getCategories } from "@/lib/cms/content";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import "./galerija.css";

export const metadata: Metadata = { title: "Galerija — LR Events", description: "LR Events foto galerija. Notikumi, cilvēki un mirkļi no trases." };
type Props = { searchParams: Promise<{ kategorija?: string | string[] }> };

async function GalleryContent({ searchParams }: Props) {
  const [images, categories, params] = await Promise.all([getGallery(), getCategories(), searchParams]);
  const requested = typeof params.kategorija === "string" ? params.kategorija : "";
  const category = categories.some(item => item.id === requested) ? requested : "";
  const visible = category ? images.filter(image => image.category === category) : images;
  const usedCategories = categories.filter(item => item.id === category || images.some(image => image.category === item.id));
  return <main id="main-content" className="photo-page site-content-page">
    <header className="photo-hero">
      <Image src="/images/event-track.jpg" alt="" fill sizes="100vw" preload />
      <div className="photo-hero-shade" />
      <div className="container photo-hero-copy">
        <nav className="photo-breadcrumb" aria-label="Atrašanās vieta"><Link href="/">Sākums</Link><span aria-hidden="true">/</span><span aria-current="page">Galerija</span></nav>
        <h1>Galerija</h1><p>Notikumi, cilvēki un mirkļi no trases.</p>
      </div>
    </header>
    <div className="container photo-library">
      <form action="/galerija" className="photo-toolbar">
        <label htmlFor="gallery-category">Kategorija</label>
        <div className="photo-select"><select id="gallery-category" name="kategorija" key={category} defaultValue={category}><option value="">Visas kategorijas</option>{usedCategories.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select><ChevronDown size={16} aria-hidden="true" /></div>
        <button type="submit">Atlasīt<ArrowRight size={16} aria-hidden="true" /></button>
        {category && <Link href="/galerija" className="photo-reset">Notīrīt filtru</Link>}
        <p>{visible.length} {visible.length === 1 ? "attēls" : "attēli"}</p>
      </form>
      {visible.length ? <GalleryGrid key={category} images={visible} /> : <section className="photo-empty"><h2>{category ? "Šajā kategorijā vēl nav attēlu" : "Galerija vēl top"}</h2><p>Fotogrāfijas šeit parādīsies pēc publicēšanas.</p>{category && <Link href="/galerija">Skatīt visus attēlus<ArrowRight size={17} aria-hidden="true" /></Link>}</section>}
    </div>
  </main>;
}

export default function GalleryPage(props: Props) { return <Suspense fallback={<main id="main-content" className="photo-loading container"><p role="status">Ielādē galeriju…</p></main>}><GalleryContent {...props} /></Suspense>; }
