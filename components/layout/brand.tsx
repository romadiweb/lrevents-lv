import Image from "next/image";
import Link from "next/link";
import "./brand.css";
export function Brand({ tone = "adaptive" }: { tone?: "adaptive" | "white" }) {
  return (
    <Link className={`brand brand--${tone}`} href="/" aria-label="LR Events — sākums">
      <span className="brand-image">
        <Image
          className="brand-logo-black"
          src="/brand/lr-events-black.svg"
          alt="LR Events"
          width={2000}
          height={1114}
          priority
        />
        <Image className="brand-logo-white" src="/brand/lr-events-white.svg" alt="LR Events" width={2000} height={1114} priority />
      </span>
      <span className="brand-caption">
        SPORTA
        <br />
        BIEDRĪBA
      </span>
    </Link>
  );
}
