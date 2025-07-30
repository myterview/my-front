"use client";

import { useSicilianContext } from "@ilokesto/sicilian/provider";
import { neato } from "neato";

export function Input(
  props: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "name" | "id" | "onChange" | "value" | "onBlur" | "onFocus" | "type"
  >
) {
  const { register, name } = useSicilianContext();

  return (
    <input
      {...register({ name })}
      {...props}
      className={neato("input w-full", props.className)}
    />
  );
}
