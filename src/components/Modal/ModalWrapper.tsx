import { Card } from "../Binder/Card";
import { Show } from "@ilokesto/utilinent";
import { grunfeld } from "grunfeld";
import { neato } from "neato";
import Image from "next/image";

export function ModalWrapper({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div
      className={neato(
        "shadow-custom flex flex-col rounded-[12] bg-white px-44 py-48"
      )}
    >
      <div className="flex items-center justify-between">
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
