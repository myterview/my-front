import { Card } from "../CardComponent/Card";
import { grunfeld } from "@ilokesto/grunfeld";
import { Show } from "@ilokesto/utilinent";
import { ClassValue, neato } from "neato";
import Image from "next/image";

export function ModalWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  className?: ClassValue;
}) {
  return (
    <div
      className={neato(
        "shadow-custom flex flex-col rounded-[12] bg-white px-40 py-48",
        "max-md:w-dvw max-md:h-dvh max-md:rounded-none",
        className
      )}
    >
      {children}
    </div>
  );
}

ModalWrapper.Title = function ModalWrapperTitle({
  title,
  className,
}: {
  title?: string;
  className?: ClassValue;
}) {
  return (
    <div className="flex items-start justify-between gap-24">
      <Show when={title} fallback={<div className="flex-1"></div>}>
        {(title) => <Card.Title className={className}>{title}</Card.Title>}
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
  );
};
