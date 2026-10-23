import { NextResponse, type NextRequest } from "next/server";
import { getCmsIdentity } from "@/lib/supabase/auth-server";
import { createAdminClient } from "@/lib/supabase/admin";
export async function POST(request:NextRequest){
 if(request.headers.get("origin")!==request.nextUrl.origin)return NextResponse.json({error:"Nederīgs pieprasījums."},{status:403});
 const identity=await getCmsIdentity();if(!identity)return NextResponse.json({error:"Lūdzu, pieslēdzies vēlreiz."},{status:401});
 try{const {password}=await request.json();if(typeof password!=="string"||password.length<10||password.length>128)return NextResponse.json({error:"Parolei jābūt 10–128 rakstzīmes garai."},{status:400});
 const {error}=await createAdminClient().auth.admin.updateUserById(identity.user.id,{password});
 if(error)return NextResponse.json({error:"Neizdevās mainīt paroli. Mēģini vēlreiz."},{status:400});
 return NextResponse.json({ok:true,email:identity.user.email});}catch{return NextResponse.json({error:"Nederīgi dati."},{status:400});}
}
