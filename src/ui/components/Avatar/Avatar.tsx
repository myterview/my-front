import { PUBLIC_FOLDER } from "@/shared/types/public";
import { ClassValue, neato } from "neato";
import Image from "next/image";

export function Avatar({
  src,
  className,
}: {
  src?: string;
  className?: ClassValue;
}) {
  return (
    <div
      className={neato(
        "relative h-44 w-44 overflow-hidden rounded-full",
        className
      )}
    >
      <Image
        className="object-cover"
        src={src ?? PUBLIC_FOLDER.images.AVATAR}
        alt="Avatar"
        draggable={false}
        fill
      />
    </div>
  );
}
