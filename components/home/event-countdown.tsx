"use client";

import { useEffect, useState } from "react";

const units = [
  ["days", "dienas"],
  ["hours", "stundas"],
  ["minutes", "minūtes"],
  ["seconds", "sekundes"],
] as const;

function getTimeLeft(target: string) {
  const remaining = Math.max(0, new Date(target).getTime() - Date.now());

  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
  };
}

export function EventCountdown({ target }: { target: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const initialUpdate = window.setTimeout(
      () => setTimeLeft(getTimeLeft(target)),
      0,
    );
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => {
      window.clearTimeout(initialUpdate);
      window.clearInterval(timer);
    };
  }, [target]);

  return (
    <div className="event-countdown" aria-label="Laiks līdz pasākuma sākumam">
      {units.map(([key, label]) => (
        <div className="countdown-unit" key={key}>
          <span>{String(timeLeft[key]).padStart(2, "0")}</span>
          <small>{label}</small>
        </div>
      ))}
    </div>
  );
}
