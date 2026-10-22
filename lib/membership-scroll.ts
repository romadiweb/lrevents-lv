"use client";

/** Wait for the destination's fonts and layout before choosing the scroll position. */
export async function scrollToMembershipApplication() {
  await document.fonts.ready;
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

  if (window.location.pathname !== "/biedrs") return;
  const section = document.getElementById("pieteiksanas");
  // On mobile the introduction stacks above the fields; land on the form itself.
  const target = section?.querySelector(".member-form-wrap") ?? section;
  target?.scrollIntoView({
    block: "start",
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  });
}
