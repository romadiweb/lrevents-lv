"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserAuthClient } from "@/lib/supabase/browser";

export function LoginForm({ updatePassword = false }: { updatePassword?: boolean }) {
  const params = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState(params.get("error") ? "Saite nav derīga vai ir beigusies. Pieprasi jaunu saiti." : "");
  const [busy, setBusy] = useState(false);
  const [reset, setReset] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const client = createBrowserAuthClient();
      if (updatePassword) {
        const password = String(form.get("password"));
        if (password !== form.get("confirm_password")) throw Error("Paroles nesakrīt.");
        const { error } = await client.auth.updateUser({ password });
        if (error) throw Error("Neizdevās mainīt paroli. Atver jaunu paroles atjaunošanas saiti.");
        router.push("/admin"); router.refresh();
      } else if (reset) {
        const { error } = await client.auth.resetPasswordForEmail(String(form.get("email")), { redirectTo: `${window.location.origin}/auth/callback?next=/auth/password` });
        if (error) throw Error("Neizdevās pieprasīt saiti. Mēģini vēlreiz pēc brīža.");
        setMessage("Ja konts pastāv, e-pastā saņemsi paroles iestatīšanas saiti. Atver to šajā pārlūkā.");
      } else {
        const { error } = await client.auth.signInWithPassword({ email: String(form.get("email")), password: String(form.get("password")) });
        if (error) throw Error("Nepareizs e-pasts vai parole.");
        router.push("/admin"); router.refresh();
      }
    } catch (error) { setMessage(error instanceof Error ? error.message : "Savienojums neizdevās. Mēģini vēlreiz."); }
    finally { setBusy(false); }
  }
  return <form className="cms-login-form" onSubmit={submit}>
    <h1>{updatePassword ? "Iestatīt paroli" : reset ? "Atjaunot paroli" : "Pieslēgties"}</h1>
    {params.get("denied") && <p role="alert">Šim kontam nav pieejas CMS. Sazinies ar administratoru.</p>}
    {!updatePassword && <label>E-pasts<input name="email" type="email" autoComplete="username" required /></label>}
    {(!reset || updatePassword) && <label>Parole<input name="password" type="password" autoComplete={updatePassword ? "new-password" : "current-password"} minLength={updatePassword ? 12 : undefined} maxLength={128} required /></label>}
    {updatePassword && <label>Parole atkārtoti<input name="confirm_password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /></label>}
    <p className="cms-message" role="status" aria-live="polite">{message}</p>
    <button type="submit" disabled={busy}>{busy ? "Lūdzu, uzgaidi…" : updatePassword ? "Saglabāt paroli" : reset ? "Saņemt saiti" : "Pieslēgties"}</button>
    {!updatePassword && <button className="cms-text-button" type="button" onClick={() => { setReset(!reset); setMessage(""); }}>{reset ? "Atpakaļ uz pieslēgšanos" : "Iestatīt vai atjaunot paroli"}</button>}
  </form>;
}
