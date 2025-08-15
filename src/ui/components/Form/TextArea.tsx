"use client";

import { useSicilianContext } from "@ilokesto/sicilian/provider";
import { neato } from "neato";
import { ComponentPropsWithRef, KeyboardEvent, useEffect, useRef } from "react";

export function TextArea({
  className,
  height, // 추가된 height prop
  rows = 1,
  autoResize = true,
  ref,
  ...props
}: ComponentPropsWithRef<"textarea"> & {
  height?: number; // 추가된 height prop
  autoResize?: boolean; // 자동 높이 조절 여부
}) {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const { register, name, getValues } = useSicilianContext();
  const value = getValues(name);

  // 높이 자동 조절
  useEffect(() => {
    const textarea = internalRef.current;
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
      ref={(element) => {
        internalRef.current = element;

        if (typeof ref === "function") {
          // forwardedRef가 함수 형태일 경우 (클래스 컴포넌트의 레거시 ref)
          ref(element);
        } else if (ref) {
          // forwardedRef가 객체 형태일 경우 (useRef로 생성된 ref)
          ref.current = element;
        }
      }}
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
