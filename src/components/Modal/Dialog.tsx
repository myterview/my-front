"use client";

import { Card } from "../Binder/Card";
import { Show } from "@ilokesto/utilinent";
import { neato } from "neato";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function Dialog({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(undefined!);

  useEffect(() => {
    if (!ref.current.open) {
      ref.current.showModal(); // 모달을 열기 위해 showModal 호출

      ref.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <dialog
      ref={ref}
      onClick={(e) => {
        if (e.target === ref.current) {
          router.back();
        }
      }}
      className={neato(
        "shadow-custom flex flex-col rounded-[12] bg-white px-40 py-48",
        "fixed inset-0 m-auto w-fit h-fit", // 데스크톱: 중앙 정렬, 내용 크기
        "max-desktop:w-full max-desktop:h-full max-desktop:max-w-none max-desktop:max-h-none max-desktop:m-0 max-desktop:rounded-none max-desktop:backdrop:hidden", // 모바일: 전체 화면, backdrop 숨김
        className
      )}
    >
      <div className="flex items-start justify-between gap-24">
        <Show when={title} fallback={<div className="flex-1"></div>}>
          {(title) => <Card.Title>{title}</Card.Title>}
        </Show>

        <button type="button" onClick={router.back}>
          <Image
            src="/icons/close.svg"
            alt="modal close"
            width={24}
            height={24}
            draggable={false}
          />
        </button>
      </div>

      {children}
    </dialog>
  );
}
