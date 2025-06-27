import Image from "next/image";
import Link from "next/link";

export function Logo({ size }: { size: "small" | "large" }) {
  return (
    <Link href="/" className="block w-fit">
      <Image
        src={`/images/LOGO_${size.toUpperCase()}.svg`}
        width={size === "small" ? 57 : 303}
        height={size === "small" ? 48 : 81}
        alt="logo"
      />
    </Link>
  );
}
