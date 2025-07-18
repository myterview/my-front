"use client";

import { useSicilianContext } from "@ilokesto/sicilian/provider";
import { KeyboardEvent, useEffect, useRef } from "react";

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

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      // form의 submit 이벤트 트리거
      const form = e.currentTarget.closest("form");
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <textarea
      rows={1}
      ref={ref}
      onKeyDown={handleKeyDown}
      className="w-full flex-1 resize-none text-base"
      {...props}
      {...register({ name })}
    />
  );
}
