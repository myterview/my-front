"use client";

import { useAnchorPosition } from "@/hooks/useAnchorPosition";

export function Popover({
  position = { mainAxis: 8, crossAxis: 0 },
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
  position?: { mainAxis?: number; crossAxis?: number };
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
