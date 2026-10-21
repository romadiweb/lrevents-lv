import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { eventDocuments } from "@/lib/documents";
import "./dokumenti.css";

export const metadata: Metadata = {
  title: "Dokumenti — LR Events",
  description:
    "LR Events autosprinta sezonas nolikumi, posmu nolikumi un oficiālie biļeteni.",
};

export default function DocumentsPage() {
  return (
    <main id="main-content" className="documents-page site-content-page">
      <div className="container">
        <nav className="documents-breadcrumb" aria-label="Atrašanās vieta">
          <Link href="/">Sākums</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Dokumenti</span>
        </nav>

        <header className="documents-header">
          <div className="documents-header-title">
            <span className="documents-eyebrow">LR Events / Dalībniekiem</span>
            <h1>Dokumenti</h1>
          </div>
          <p>
            Sezonas un posmu nolikumi, oficiālie biļeteni un cita
            dalībniekiem būtiska informācija.
          </p>
        </header>

        <section className="documents-library" aria-label="Dokumentu saraksts">
          <div className="documents-library-toolbar">
            <span className="documents-count">
              {eventDocuments.length}{" "}
              {eventDocuments.length === 1 ? "dokuments" : "dokumenti"}
            </span>
          </div>

          {eventDocuments.length > 0 ? (
            <ol className="documents-grid">
              {eventDocuments.map((document, index) => (
                <li className="document-item" key={`${document.href}-${index}`}>
                  <a
                    className="document-card"
                    href={document.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="document-card-top">
                      <span className="document-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="document-format" aria-label="PDF dokuments">
                        <FileText size={17} strokeWidth={1.7} aria-hidden="true" />
                        PDF
                      </span>
                    </span>

                    <span className="document-content">
                      <span className="document-category">{document.category}</span>
                      <strong className="document-title">{document.title}</strong>
                      <span className="document-description">
                        {document.description}
                      </span>
                    </span>

                    <span className="document-card-bottom">
                      {index === 0 ? (
                        <span className="document-priority">Sezonas pamatdokuments</span>
                      ) : (
                        <span className="document-meta">Oficiāls dokuments</span>
                      )}

                      <span className="document-action">
                        Atvērt PDF
                        <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" />
                        <span className="sr-only">(atveras jaunā cilnē)</span>
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          ) : (
            <div className="documents-empty">
              <FileText size={28} strokeWidth={1.5} aria-hidden="true" />
              <p>Pašlaik nav publicētu dokumentu.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
