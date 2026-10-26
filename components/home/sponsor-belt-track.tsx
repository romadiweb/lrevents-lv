"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function SponsorBeltTrack({ children, duplicate }: { children: ReactNode; duplicate: ReactNode }) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const windowElement = viewport.current;
    const group = track.current?.firstElementChild;
    if (!windowElement || !group) return;
    const observer = new ResizeObserver(() => {
      setOverflowing(group.getBoundingClientRect().width > windowElement.clientWidth);
    });
    observer.observe(windowElement);
    observer.observe(group);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sponsor-belt-window" ref={viewport} data-overflow={overflowing}>
      <div className="sponsor-belt-track" ref={track}>
        {children}
        {overflowing && duplicate}
      </div>
    </div>
  );
}
