"use client";

import { useSicilianContext } from "@ilokesto/sicilian/provider";
import { neato } from "neato";

export function FieldUnderlineWrapper({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { name, getErrors } = useSicilianContext();

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="label">{title}</div>
      <label
        htmlFor={name}
        className={neato(
          "focus-within:border-b-primary-600 border-b-1 border-b-black py-8",
          getErrors(name) && "border-b-red-600"
        )}
      >
        {children}
      </label>
    </div>
  );
}
