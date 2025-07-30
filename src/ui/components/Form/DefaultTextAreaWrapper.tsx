"use client";

import { useSicilianContext } from "@ilokesto/sicilian/provider";
import { Show } from "@ilokesto/utilinent";
import { neato } from "neato";

export function FieldOutlineWrapper({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) {
  const { name } = useSicilianContext();

  return (
    <div className="flex w-full flex-col gap-8">
      <Show when={title}>
        {(title) => <div className="label">{title}</div>}
      </Show>

      <label
        htmlFor={name}
        className={neato(
          "focus-within:border-primary-600 flex items-end justify-between gap-12 rounded-[4] border-1 border-gray-200 px-24 py-18",
          className
        )}
      >
        {children}
      </label>
    </div>
  );
}
