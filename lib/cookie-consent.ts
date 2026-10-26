"use client";

import { useSyncExternalStore } from "react";

export type CookieChoice = "accepted" | "rejected";
const cookieName = "lrevents_cookie_choice";
const changeEvent = "lrevents-cookie-choice";
// Increase the version and request a new choice if optional services are added.
const version = "v1";

function snapshot(): CookieChoice | "" {
  try {
    const value = document.cookie.split(";").map(part => part.trim()).find(part => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
    if (value === `${version}.accepted`) return "accepted";
    if (value === `${version}.rejected`) return "rejected";
    return "";
  } catch {
    return "";
  }
}

function subscribe(notify: () => void) {
  window.addEventListener(changeEvent, notify);
  window.addEventListener("focus", notify);
  return () => {
    window.removeEventListener(changeEvent, notify);
    window.removeEventListener("focus", notify);
  };
}

export function useCookieChoice() {
  return useSyncExternalStore(subscribe, snapshot, () => "pending" as const);
}

export function saveCookieChoice(choice: CookieChoice): boolean {
  try {
    document.cookie = `${cookieName}=${version}.${choice}; Path=/; Max-Age=15552000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    if (snapshot() !== choice) return false;
    window.dispatchEvent(new Event(changeEvent));
    return true;
  } catch {
    return false;
  }
}

export function clearCookieChoice(): boolean {
  try {
    document.cookie = `${cookieName}=; Path=/; Max-Age=0; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    if (snapshot() !== "") return false;
    window.dispatchEvent(new Event(changeEvent));
    return true;
  } catch {
    return false;
  }
}
