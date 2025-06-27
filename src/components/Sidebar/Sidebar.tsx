"use client";

import Link from "next/link";
import { Logo } from "../Logo/Logo";
import { useSidebar } from "@/hooks/useSidebar";
import { useRef } from "react";
import { neato } from "neato";

export function Sidebar() {
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
        "bg-gray-100/10 transition-all duration-300 ease-in-out",
        "desktop:w-300 max-desktop:absolute top-0 h-dvh",
        isOpen ? "left-0 w-full" : "-left-300"
      )}
    >
      <menu className="relative h-dvh w-300 bg-gray-100">
        <Logo size="small" />

        <button
          className={neato(
            "desktop:hidden absolute transition-all duration-300 ease-in-out",
            isOpen ? "-right-0" : "-right-50"
          )}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          Toggle
        </button>

        <Link href="">모의 인터뷰</Link>

        <Link href="">기술 면접 질문</Link>
      </menu>
    </aside>
  );
}
