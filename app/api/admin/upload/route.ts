import { NextResponse, type NextRequest } from "next/server";
import sharp from "sharp";
import { getCmsIdentity } from "@/lib/supabase/auth-server";
export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({ error: "Nederīgs pieprasījums." }, { status: 403 });
  const identity = await getCmsIdentity();
  if (!identity) return NextResponse.json({ error: "Lūdzu, pieslēdzies vēlreiz." }, { status: 401 });
  if (Number(request.headers.get("content-length") ?? 0) > 12 * 1024 * 1024) return NextResponse.json({ error: "Attēla maksimālais izmērs ir 10 MB." }, { status: 413 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size > 10 * 1024 * 1024 || !["image/png", "image/jpeg", "image/webp", "image/avif"].includes(file.type)) throw Error("Izvēlies PNG, JPG, WebP vai AVIF attēlu līdz 10 MB.");
    const logo = form.get("kind") === "logo";
    const buffer = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 40000000, animated: false }).rotate().resize({ width: logo ? 640 : 1920, height: logo ? 640 : 1920, fit: "inside", withoutEnlargement: true }).webp({ quality: logo ? 85 : 80 }).toBuffer();
    const path = `${identity.user.id}/${crypto.randomUUID()}.webp`;
    const { error } = await identity.client.storage.from("cms-media").upload(path, buffer, { contentType: "image/webp", cacheControl: "31536000", upsert: false });
    if (error) throw Error("Augšupielāde neizdevās. Pārbaudi CMS krātuves iestatījumus.");
    return NextResponse.json({ url: identity.client.storage.from("cms-media").getPublicUrl(path).data.publicUrl, bytes: buffer.length });
  } catch (error) { return NextResponse.json({ error: error instanceof Error && !error.message.includes("Input buffer") ? error.message : "Šo attēlu nevar apstrādāt. Izvēlies citu failu." }, { status: 400 }); }
}
