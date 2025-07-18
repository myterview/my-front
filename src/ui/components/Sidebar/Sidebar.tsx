"use client";

import { Clickable } from "../Clickable/Clickable";
import { Logo } from "../Logo/Logo";
import { create } from "@ilokesto/caro-kann";
import { neato } from "neato";
import Image from "next/image";
import { useRef } from "react";

export const useSidebar = create(false);

export function Sidebar({
  children,
  menu,
}: {
  children: React.ReactNode;
  menu: React.ReactNode;
}) {
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
        "md:w-280 max-md:absolute top-0 flex h-dvh flex-col bg-black/5 transition-all duration-200 ease-in-out",
        isOpen ? "left-0 w-full" : "-left-300"
      )}
    >
      <div className="relative flex h-dvh w-280 flex-col gap-80 bg-gray-100 bg-[url('/images/sidebar-pattern.svg')] bg-size-[120] px-24 pt-60">
        <div className="flex items-center justify-between">
          <Logo size="small" />

          <Clickable
            types="shadow"
            size="small"
            className={neato(
              "md:hidden absolute transition-all duration-200 ease-in-out",
              isOpen
                ? "-right-0 ml-0 rounded-r-none"
                : "-right-50 mr-0 rounded-l-none"
            )}
          >
            <button onClick={() => setIsOpen((prev) => !prev)}>
              <Image
                src="/icons/paw.svg"
                alt="sidebar toggle image"
                style={{
                  transform: isOpen ? "scaleX(-1)" : "scaleX(1)",
                }}
                draggable={false}
                width={28}
                height={24}
              />
            </button>
          </Clickable>
        </div>
        {menu}
      </div>

      {children}
    </aside>
  );
}
