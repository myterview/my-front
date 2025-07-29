"use client";

import { PopoverProps } from "../Popover";
import { For } from "@ilokesto/utilinent";
import { neato } from "neato";
import { useEffect, useState } from "react";

export function DropdownOption({
  floater,
  helper,
  options,
  selectedOption,
  className,
  setSelectedOption,
}: PopoverProps["floaterElement"] & {
  className?: string;
  options: string[];
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}) {
  const [isOpened, setIsOpened] = useState(helper.isOpen);
  useEffect(() => setIsOpened(helper.isOpen), [helper.isOpen]);

  return (
    <div
      {...floater}
      className={neato(
        "dropdown-transition",
        isOpened ? "max-h-300 opacity-100" : "max-h-0 opacity-0"
      )}
    >
      <ul className="space-y-4 overflow-y-auto rounded-md border border-gray-200 bg-white px-12 py-10 shadow-lg">
        <For each={options}>
          {(option, index) => (
            <li
              key={option}
              ref={(node) => {
                helper.listRef.current[index] = node;
              }}
              className={neato(
                "cursor-pointer px-4 py-2 font-semibold text-gray-600",
                helper.activeIndex === index && "bg-blue-100",
                selectedOption === option && "text-blue-600",
                className
              )}
              {...helper.getItemProps({
                onClick: () =>
                  helper.selectItem(() => setSelectedOption(option)),
              })}
            >
              {option}
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}
