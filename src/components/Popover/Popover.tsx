"use client";

import { useAnchorPosition } from "@/hooks/useAnchorPosition";
import { Placement } from "@floating-ui/react";

export interface IPopoverAnchor {
  anchor: ReturnType<typeof useAnchorPosition>["anchor"];
  helpers: ReturnType<typeof useAnchorPosition>["helper"];
  selectedOption: string;
}

export interface IPopoverFloater {
  floater: ReturnType<typeof useAnchorPosition>["floater"];
  helpers: ReturnType<typeof useAnchorPosition>["helper"];
  options: string[];
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}

export function Popover({
  position = { mainAxis: 8, crossAxis: 0, placement: "bottom-start" },
  anchorElement,
  floaterElement,
}: {
  anchorElement: (
    anchor: ReturnType<typeof useAnchorPosition>["anchor"],
    helpers: ReturnType<typeof useAnchorPosition>["helper"]
  ) => React.ReactElement;
  floaterElement: (
    floater: ReturnType<typeof useAnchorPosition>["floater"],
    helpers: ReturnType<typeof useAnchorPosition>["helper"]
  ) => React.ReactElement;
  position?: { mainAxis?: number; crossAxis?: number; placement?: Placement };
}) {
  const { anchor, floater, helper } = useAnchorPosition(position);

  return (
    <>
      {anchorElement(anchor, helper)}

      {helper.isOpen && (
        <helper.FloatingFocusManager context={helper.context} modal={false}>
          {floaterElement(floater, helper)}
        </helper.FloatingFocusManager>
      )}
    </>
  );
}
