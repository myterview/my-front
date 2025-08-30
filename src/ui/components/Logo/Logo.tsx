import { PUBLIC_FOLDER } from "@/shared/types/public";
import Image from "next/image";
import Link from "next/link";

export function Logo({ size }: { size: "small" | "large" }) {
  return (
    <Link href="/" className="block w-fit">
      <Image
        src={
          PUBLIC_FOLDER.images[
            `${size.toUpperCase() === "SMALL" ? "LOGO_SMALL" : "LOGO_LARGE"}`
          ]
        }
        width={size === "small" ? 57 : 303}
        draggable={false}
        height={size === "small" ? 48 : 81}
        alt="logo"
      />
    </Link>
  );
}
