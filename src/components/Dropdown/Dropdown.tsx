"use client";

import { neato } from "neato";
import { Popover } from "../Popover/Popover";
import { useAnchorPosition } from "@/hooks/useAnchorPosition";
import { useSicilianContext } from "@ilokesto/sicilian/provider";
import { DropdownMenu } from "./DropdownMenu";
import Image from "next/image";

export function Dropdown({
  options,
  title,
}: {
  options: string[];
  title: string;
}) {
  const { name, getValues, register } = useSicilianContext();

  const selectedOption = getValues(name) as string;

  const { onChange } = register({ name });

  const setSelectedOption = (option: string) => {
    onChange({
      target: { name, value: option },
    });
  };

  return (
    <Popover
      position={{ crossAxis: 30 }}
      anchorElement={(anchor, helpers) => (
        <Dropdown.Anchor
          anchor={anchor}
          helpers={helpers}
          title={title}
          selectedOption={selectedOption}
        />
      )}
      floaterElement={(floater, helpers) => (
        <DropdownMenu
          floater={floater}
          helpers={helpers}
          options={options}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      )}
    />
  );
}

Dropdown.Anchor = function Anchor({
  anchor,
  helpers,
  title,
  selectedOption,
}: {
  anchor: ReturnType<typeof useAnchorPosition>["anchor"];
  helpers: ReturnType<typeof useAnchorPosition>["helper"];
  title: string;
  selectedOption: string;
}) {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="label">{title}</div>
      <button
        type="button"
        className={neato(
          "dropdown flex w-full items-center justify-between gap-16 border-b-1 border-b-black py-8",
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
