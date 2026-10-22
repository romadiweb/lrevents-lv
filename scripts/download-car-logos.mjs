import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

// Pin the asset source so refreshes remain reproducible.
const revision = "bb2d661f28ce617dba8a51bdfc2069a3381a23b0";
const upstream = `https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/${revision}`;
const slugs = [
  "alfa-romeo", "audi", "bmw", "chevrolet", "chrysler", "citroen", "cupra",
  "dacia", "daewoo", "dodge", "fiat", "ford", "honda", "hyundai", "jaguar",
  "jeep", "kia", "lada", "land-rover", "lexus", "mazda", "mercedes-benz",
  "mini", "mitsubishi", "nissan", "opel", "peugeot", "porsche", "renault",
  "saab", "seat", "skoda", "smart", "ssangyong", "subaru", "suzuki",
  "toyota", "volkswagen", "volvo",
];
async function download(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  return Buffer.from(await response.arrayBuffer());
}
const catalog = JSON.parse((await download(`${upstream}/logos/data.json`)).toString());
const directory = new URL("../public/images/car-brands/", import.meta.url);
await mkdir(directory, { recursive: true });
const brands = [];
// Small batches avoid overwhelming the upstream host.
for (let index = 0; index < slugs.length; index += 5) {
  brands.push(...await Promise.all(slugs.slice(index, index + 5).map(async (slug) => {
    const brand = catalog.find((entry) => entry.slug === slug);
    if (!brand) throw new Error(`Missing brand: ${slug}`);
    const source = `${upstream}/logos/thumb/${slug}.png`;
    const png = await sharp(await download(source))
      .trim()
      .resize(320, 320, { fit: "inside", withoutEnlargement: true })
      .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 })
      .toBuffer();
    await writeFile(new URL(`${slug}.png`, directory), png);
    console.log(`${slug}: ${png.length} bytes`);
    return { id: slug, name: brand.name, logo: `/images/car-brands/${slug}.png`, source, originalSource: brand.image.source };
  })));
}
await writeFile(new URL("catalog.json", directory), `${JSON.stringify(brands, null, 2)}\n`);
