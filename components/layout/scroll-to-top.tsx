"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "./scroll-to-top.css";

export function ScrollToTop({ threshold = 500 }: { threshold?: number }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => setVisible(window.scrollY >= threshold);
    const frame = requestAnimationFrame(checkScroll);
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", checkScroll);
    };
  }, [threshold]);

  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => { window.history.scrollRestoration = previous; };
  }, []);

  useLayoutEffect(() => {
    // Explicit section links keep their target; ordinary page changes start at zero.
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  function goToTop() {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  return (
    <button
      type="button"
      aria-label="Atgriezties lapas augšā"
      title="Uz augšu"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`scroll-top-button${visible ? " scroll-top-visible" : ""}`}
      onClick={goToTop}
    >
      <Image
        src="/images/scroll-to-top-ignition.webp"
        alt=""
        fill
        sizes="(max-width: 767px) 56px, 64px"
        className="scroll-top-image"
        draggable={false}
      />
    </button>
  );
}
