import Image from "next/image";
export function CmsLoader({ label = "Ielādē CMS…" }: { label?: string }) {
 return <div className="cms-loader" role="status"><div className="cms-loader-mark"><span aria-hidden="true" /><Image src="/brand/romadi-black.webp" alt="" width={90} height={72} priority /></div><p>{label}</p></div>;
}
