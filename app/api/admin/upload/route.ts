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
    const logo = form.get("kind") === "logo";
    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/avif", ...(logo ? ["image/svg+xml"] : [])];
    const fileError = logo ? "Izvēlies SVG, PNG, JPG, WebP vai AVIF logotipu līdz 10 MB." : "Izvēlies PNG, JPG, WebP vai AVIF attēlu līdz 10 MB.";
    if (!(file instanceof File) || file.size > 10 * 1024 * 1024 || !(allowedTypes.includes(file.type) || (logo && /\.svg$/i.test(file.name) && ["", "application/octet-stream"].includes(file.type)))) throw Error(fileError);
    const input = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(input, { limitInputPixels: 40000000, animated: false }).metadata();
    const svg = metadata.format === "svg";
    if (svg && !logo) throw Error("SVG formāts ir pieejams tikai partneru logotipiem.");
    // Render SVG from memory, then store only static pixels; no active SVG is served.
    const density = svg ? Math.min(100000, Math.max(72, Math.ceil(640 * 72 / Math.max(metadata.width ?? 640, metadata.height ?? 640, 1)))) : 72;
    const buffer = await sharp(input, { limitInputPixels: 40000000, animated: false, density }).rotate().resize({ width: logo ? 640 : 1920, height: logo ? 640 : 1920, fit: "inside", withoutEnlargement: !svg }).webp({ quality: logo ? 85 : 80, lossless: svg }).toBuffer();
    const path = `${identity.user.id}/${crypto.randomUUID()}.webp`;
    const { error } = await identity.client.storage.from("cms-media").upload(path, buffer, { contentType: "image/webp", cacheControl: "31536000", upsert: false });
    if (error) throw Error("Augšupielāde neizdevās. Pārbaudi CMS krātuves iestatījumus.");
    return NextResponse.json({ url: identity.client.storage.from("cms-media").getPublicUrl(path).data.publicUrl, bytes: buffer.length });
  } catch (error) { return NextResponse.json({ error: error instanceof Error && !error.message.includes("Input buffer") ? error.message : "Šo attēlu nevar apstrādāt. Izvēlies citu failu." }, { status: 400 }); }
}
