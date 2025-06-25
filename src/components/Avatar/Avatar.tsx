import Image from "next/image";

export function Avatar({src}: {src?: string}) {
  return (
    <div className="w-44 h-44 overflow-hidden rounded-full relative">
      <Image
        className="object-cover"
        src={src ?? "/images/AVATAR.svg"}
        alt="Avatar"
        fill
      />
    </div>
  );
}