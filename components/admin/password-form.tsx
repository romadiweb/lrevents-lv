"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserAuthClient } from "@/lib/supabase/browser";
export function PasswordForm() {
 const router=useRouter();
 const [busy,setBusy]=useState(false); const [message,setMessage]=useState("");
 return <section className="cms-editor"><h1>Mainīt paroli</h1><p>Jaunā parole stāsies spēkā uzreiz. E-pasta apstiprinājums nav vajadzīgs.</p>
 <form onSubmit={async event=>{event.preventDefault();const form=event.currentTarget;const data=new FormData(form);setMessage("");if(data.get("password")!==data.get("confirm")){setMessage("Paroles nesakrīt.");return;}setBusy(true);try{const response=await fetch("/api/admin/password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:data.get("password")})});const result=await response.json();if(!response.ok)throw Error(result.error);const {error}=await createBrowserAuthClient().auth.signInWithPassword({email:result.email,password:String(data.get("password"))});form.reset();if(error){setMessage("Parole nomainīta. Pieslēdzies vēlreiz ar jauno paroli.");router.push("/login");return;}setMessage("Parole nomainīta.");router.refresh();}catch(error){setMessage(error instanceof Error?error.message:"Neizdevās mainīt paroli.");}finally{setBusy(false);}}}>
 <fieldset disabled={busy} className="cms-fields"><label className="cms-field">Jaunā parole<input name="password" type="password" autoComplete="new-password" minLength={10} maxLength={128} required/><small>Vismaz 10 rakstzīmes.</small></label><label className="cms-field">Parole atkārtoti<input name="confirm" type="password" autoComplete="new-password" minLength={10} maxLength={128} required/></label></fieldset><button disabled={busy}>{busy?"Saglabā…":"Saglabāt paroli"}</button><p className="cms-message" role="status">{message}</p></form></section>;
}
