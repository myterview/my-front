"use client";

import Link from "next/link";
import { Logo } from "../Logo/Logo";
import { useSidebar } from "@/hooks/useSidebar";
import { useRef } from "react";
import { neato } from "neato";

export function Sidebar({ children }: { children: React.ReactNode }) {
  const asideRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useSidebar();

  return (
    <aside
      ref={asideRef}
      onClick={(e) => {
        if (e.target === asideRef.current) {
          setIsOpen(false);
        }
      }}
      className={neato(
        "desktop:w-300 max-desktop:absolute top-0 flex h-dvh flex-col bg-black/5 transition-all duration-200 ease-in-out",
        isOpen ? "left-0 w-full" : "-left-300"
      )}
    >
      <div className="relative flex h-dvh w-300 flex-col gap-80 bg-gray-100 bg-[url('/images/pattern.svg')] bg-size-[120] px-24 pt-60">
        <div className="flex items-center justify-between">
          <Logo size="small" />

          <button
            className={neato(
              "desktop:hidden absolute transition-all duration-200 ease-in-out",
              isOpen ? "-right-0" : "-right-50"
            )}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            Toggle
          </button>
        </div>

        <menu className="text-primary-600 flex flex-col gap-40 font-bold">
          <Link href="/dashboard/interview">모의 인터뷰</Link>

          <Link href="/dashboard/tech-question">기술 면접 질문</Link>

          <Link href="/dashboard/feedback">피드백</Link>
        </menu>
      </div>

      {children}
    </aside>
  );
}
