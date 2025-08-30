import { PUBLIC_FOLDER } from "@/shared/types/public";
import Image from "next/image";
import Link from "next/link";

export function Logo({ size }: { size: "small" | "large" }) {
  const LogoSize = {
    small: {
      width: 57,
      height: 48,
    },
    large: {
      width: 303,
      height: 81,
    },
  };

  return (
    <Link href="/" className="block w-fit">
      <Image
        src={
          PUBLIC_FOLDER.images[
            `${size === "small" ? "LOGO_SMALL" : "LOGO_LARGE"}`
          ]
        }
        draggable={false}
        {...LogoSize[size]}
        alt="logo"
      />
    </Link>
  );
}
