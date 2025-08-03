"use client";

import { useSicilianContext } from "@ilokesto/sicilian/provider";
import { neato } from "neato";
import { KeyboardEvent, useEffect, useRef } from "react";

export function TextArea({
  className,
  height, // 추가된 height prop
  rows = 1,
  autoResize = true,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  height?: number; // 추가된 height prop
  autoResize?: boolean; // 자동 높이 조절 여부
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const { register, name, getValues } = useSicilianContext();
  const value = getValues(name);

  // 높이 자동 조절
  useEffect(() => {
    const textarea = ref.current;
    if (!autoResize || height || !textarea) return;
    const resize = () => {
      textarea.style.height = "auto";
      const maxHeight = textarea.style.maxHeight;
      if (maxHeight) {
        const scrollHeight = Math.min(
          textarea.scrollHeight,
          parseInt(maxHeight)
        );
        textarea.style.height = scrollHeight + "px";
      } else {
        textarea.style.height = textarea.scrollHeight + "px";
      }
    };
    resize();
  }, [value, height, autoResize]);

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
      rows={rows}
      ref={ref}
      onKeyDown={handleKeyDown}
      className={neato(
        "w-full flex-1 h-full resize-none text-base overflow-y-scroll",
        className
      )}
      {...props}
      {...register({ name })}
    />
  );
}
