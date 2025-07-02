"use client";

import { useSicilianContext } from "@ilokesto/sicilian/provider";
import { useRef, useEffect } from "react";

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const { register, name, getValues } = useSicilianContext();
  const value = getValues(name);

  // 높이 자동 조절
  useEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;
    const resize = () => {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    };
    resize();
  }, [value]);

  return (
    <textarea
      rows={1}
      ref={ref}
      className="w-full flex-1 resize-none text-base"
      {...props}
      {...register({ name })}
    />
  );
}
