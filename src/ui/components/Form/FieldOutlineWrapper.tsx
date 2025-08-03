"use client";

import { Show } from "@ilokesto/utilinent";
import { ClassValue, neato } from "neato";

export function FieldOutlineWrapper({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  className?: ClassValue;
}) {
  return (
    <div className="flex w-full flex-col gap-8 flex-1">
      <Show when={title}>
        {(title) => <div className="label">{title}</div>}
      </Show>

      <div
        className={neato(
          "focus-within:border-primary-600 h-full flex items-end justify-between gap-12 rounded-[4] border-1 border-gray-200 px-24 py-18",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
