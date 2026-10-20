import Image from "next/image";
import Link from "next/link";
export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="LR Events — sākums">
      <span className="brand-image">
        <Image
          src="/brand/lr-events.svg"
          alt="LR Events"
          width={1125}
          height={1125}
          priority
        />
      </span>
      <span className="brand-caption">
        SPORTA
        <br />
        BIEDRĪBA
      </span>
    </Link>
  );
}
