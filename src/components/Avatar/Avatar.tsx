import Image from "next/image";

export function Avatar({ src }: { src?: string }) {
  return (
    <div className="relative h-44 w-44 overflow-hidden rounded-full">
      <Image
        className="object-cover"
        src={src ?? "/images/AVATAR.svg"}
        alt="Avatar"
        fill
      />
    </div>
  );
}
