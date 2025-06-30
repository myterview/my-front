"use client";

import { useSicilianContext } from "@ilokesto/sicilian/provider";

import { useRef, useEffect } from "react";

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const { register, name } = useSicilianContext();

  // 높이 자동 조절
  useEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;
    const resize = () => {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    };
    resize();
    textarea.addEventListener("change", resize);
    textarea.addEventListener("input", resize);
    return () => {
      textarea.removeEventListener("change", resize);
      textarea.removeEventListener("input", resize);
    };
  }, []);

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
