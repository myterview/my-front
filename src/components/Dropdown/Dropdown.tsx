"use client";

import { Popover } from "../Popover/Popover";
import { useAnchorPosition } from "@/hooks/useAnchorPosition";
import { DropdownMenu } from "./DropdownMenu";

export interface IDropdownButton {
  anchor: ReturnType<typeof useAnchorPosition>["anchor"];
  helpers: ReturnType<typeof useAnchorPosition>["helper"];
  selectedOption: string;
}

export function Dropdown({
  options,
  children,
  selectedOption,
  setSelectedOption,
}: {
  options: string[];
  children: (
    anchor: ReturnType<typeof useAnchorPosition>["anchor"],
    helpers: ReturnType<typeof useAnchorPosition>["helper"]
  ) => React.ReactElement;
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}) {
  return (
    <Popover
      position={{ crossAxis: 30 }}
      anchorElement={children}
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
