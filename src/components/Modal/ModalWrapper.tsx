import { Card } from "../Binder/Card";
import { Show } from "@ilokesto/utilinent";
import { grunfeld } from "grunfeld";
import { neato } from "neato";
import Image from "next/image";

export function ModalWrapper({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <div
      className={neato(
        "shadow-custom flex flex-col rounded-[12] bg-white px-40 py-48",
        "max-desktop:w-dvw max-desktop:h-dvh max-desktop:rounded-none",
        className
      )}
    >
      <div className="flex items-start justify-between gap-24">
        <Show when={title} fallback={<div className="flex-1"></div>}>
          {(title) => <Card.Title>{title}</Card.Title>}
        </Show>

        <button type="button" onClick={grunfeld.remove}>
          <Image
            src="/icons/close.svg"
            alt="modal close"
            width={24}
            height={24}
            draggable={false}
          />
        </button>
      </div>

      {children}
    </div>
  );
}
