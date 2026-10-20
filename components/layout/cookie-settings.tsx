"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export function CookieSettings() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="cookie-settings-trigger">Sīkdatņu iestatījumi</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="menu-overlay" />
        <Dialog.Content className="cookie-dialog">
          <Dialog.Title>Sīkdatņu iestatījumi</Dialog.Title>
          <Dialog.Description>Šobrīd šajā vietnē nav ieslēgtas analītikas vai reklāmas sīkdatnes.</Dialog.Description>
          <p>Papildu sīkdatņu izvēles būs pieejamas, ja pievienosim pakalpojumus, kuriem nepieciešama jūsu piekrišana.</p>
          <Dialog.Close className="icon-button cookie-dialog-close" aria-label="Aizvērt"><X size={22} /></Dialog.Close>
          <Dialog.Close className="primary-button">Aizvērt</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
