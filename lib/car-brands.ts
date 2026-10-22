import catalog from "@/public/images/car-brands/catalog.json";

/** Store this stable id on a team when the CMS brand selector is added. */
export type CarBrandId =
  | "alfa-romeo" | "audi" | "bmw" | "chevrolet" | "chrysler" | "citroen"
  | "cupra" | "dacia" | "daewoo" | "dodge" | "fiat" | "ford" | "honda"
  | "hyundai" | "jaguar" | "jeep" | "kia" | "lada" | "land-rover" | "lexus"
  | "mazda" | "mercedes-benz" | "mini" | "mitsubishi" | "nissan" | "opel"
  | "peugeot" | "porsche" | "renault" | "saab" | "seat" | "skoda" | "smart"
  | "ssangyong" | "subaru" | "suzuki" | "toyota" | "volkswagen" | "volvo";

export const carBrands = catalog;

// Unknown or unassigned CMS values simply omit the decorative watermark.
export function getCarBrand(id?: string | null) {
  return carBrands.find((brand) => brand.id === id);
}
