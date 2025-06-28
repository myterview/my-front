"use client";

import { useSicilianContext } from "@ilokesto/sicilian/provider";

export function Input() {
  const { register, name } = useSicilianContext();

  return <input className="input w-full" {...register({ name })} />;
}
