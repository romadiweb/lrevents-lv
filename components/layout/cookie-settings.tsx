import Link from "next/link";
import "./cookie-settings.css";

export function CookieSettings({ onClick }: { onClick?: () => void }) {
  return <Link className="cookie-settings-trigger" href="/sikdatnu-iestatijumi" onClick={onClick}>Sīkdatņu iestatījumi</Link>;
}
