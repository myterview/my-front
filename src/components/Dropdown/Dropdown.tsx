"use client";

import { neato } from "neato";
import { Popover } from "../Popover/Popover";
import { useAnchorPosition } from "@/hooks/useAnchorPosition";
import { For } from "utilinent";
import Image from "next/image";
import { useSicilianContext } from "@ilokesto/sicilian/provider";

export function Dropdown({
  options,
  title,
}: {
  options: string[];
  title: string;
}) {
  return (
    <Popover
      position={{ crossAxis: 30 }}
      anchorElement={(anchor, helpers) => (
        <Dropdown.Anchor anchor={anchor} helpers={helpers} title={title} />
      )}
      floaterElement={(floater, helpers) => (
        <Dropdown.Floater
          floater={floater}
          helpers={helpers}
          options={options}
        />
      )}
    />
  );
}

Dropdown.Anchor = function Anchor({
  anchor,
  helpers,
  title,
}: {
  anchor: ReturnType<typeof useAnchorPosition>["anchor"];
  helpers: ReturnType<typeof useAnchorPosition>["helper"];
  title: string;
}) {
  const { name, getValues } = useSicilianContext();

  const selectedOption = getValues(name) as string;

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="label">{title}</div>
      <button
        type="button"
        className={neato(
          "dropdown flex w-full items-center justify-between gap-16 border-b-1 border-b-black py-8 pr-16",
          helpers.isOpen && "border-b-primary-600"
        )}
        {...anchor}
      >
        <Image
          src="/icons/dropdownLaptop.svg"
          alt="Dropdown Arrow"
          width={22}
          height={18}
        />
        <span className="flex-1 text-left">{selectedOption}</span>
        <Image
          src="/icons/dropdownArrow.svg"
          alt="Dropdown Arrow"
          width={24}
          height={24}
        />
      </button>
    </div>
  );
};

Dropdown.Floater = function Floater({
  floater,
  helpers,
  options,
}: {
  floater: ReturnType<typeof useAnchorPosition>["floater"];
  helpers: ReturnType<typeof useAnchorPosition>["helper"];
  options: string[];
}) {
  const { name, getValues, register } = useSicilianContext();

  const selectedOption = getValues(name) as string;

  const { onChange } = register({ name });

  return (
    <div
      {...floater}
      className={neato(
        "dropdown-transition",
        helpers.isOpened ? "max-h-300 opacity-100" : "max-h-0 opacity-0"
      )}
    >
      <ul className="space-y-4 overflow-y-auto rounded-md border border-gray-200 bg-white px-12 py-10 shadow-lg">
        <For each={options}>
          {(option, index) => (
            <li
              key={option}
              ref={(node) => {
                helpers.listRef.current[index] = node;
              }}
              className={neato(
                "cursor-pointer px-4 py-2 font-semibold text-gray-600",
                helpers.activeIndex === index && "bg-blue-100",
                selectedOption === option && "text-blue-600"
              )}
              {...helpers.getItemProps({
                onClick: () =>
                  helpers.selectItem(() =>
                    onChange({
                      target: { name, value: option },
                    })
                  ),
              })}
            >
              {option}
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};
