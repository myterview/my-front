import { neato } from "neato";
import Image from "next/image";

export function Avatar({
  src,
  className,
}: {
  src?: string;
  className?: string;
}) {
  return (
    <div
      className={neato(
        `relative h-44 w-44 overflow-hidden rounded-full ${className}`
      )}
    >
      <Image
        className="object-cover"
        src={src ?? "/images/AVATAR.svg"}
        alt="Avatar"
        draggable={false}
        fill
      />
    </div>
  );
}
