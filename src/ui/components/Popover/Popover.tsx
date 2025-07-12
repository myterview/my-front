"use client";

import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset,
  Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from "@floating-ui/react";
import { useRef, useState } from "react";

export interface IPopoverAnchor {
  anchor: ReturnType<typeof usePopoverPosition>["anchor"];
  helpers: ReturnType<typeof usePopoverPosition>["helper"];
  selectedOption: string;
}

export interface IPopoverFloater {
  floater: ReturnType<typeof usePopoverPosition>["floater"];
  helpers: ReturnType<typeof usePopoverPosition>["helper"];
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
    anchor: ReturnType<typeof usePopoverPosition>["anchor"],
    helpers: ReturnType<typeof usePopoverPosition>["helper"]
  ) => React.ReactElement;
  floaterElement: (
    floater: ReturnType<typeof usePopoverPosition>["floater"],
    helpers: ReturnType<typeof usePopoverPosition>["helper"]
  ) => React.ReactElement;
  position?: { mainAxis?: number; crossAxis?: number; placement?: Placement };
}) {
  const { anchor, floater, helper } = usePopoverPosition(position);

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

function usePopoverPosition({
  mainAxis = 8,
  crossAxis = 0,
  placement = "bottom-start",
}: {
  mainAxis?: number;
  crossAxis?: number;
  placement?: Placement;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>([]);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      setIsOpen(open);
      if (!open) setActiveIndex(null);
    },
    middleware: [offset({ mainAxis, crossAxis }), flip(), shift()],
    placement,
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context, {
    event: "mousedown", // input의 경우 mousedown 이벤트 사용
  });
  const dismiss = useDismiss(context, {
    outsidePressEvent: "mousedown",
    referencePress: false, // input 클릭 시 닫히지 않도록
  });

  const role = useRole(context, { role: "listbox" });

  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [click, dismiss, role, listNavigation]
  );

  const selectItem = (callback: () => void) => {
    callback();
    setIsOpen(false);
    setActiveIndex(null);
  };

  return {
    anchor: {
      ref: refs.setReference,
      ...getReferenceProps(),
    },
    floater: {
      ref: refs.setFloating,
      style: floatingStyles,
      ...getFloatingProps(),
    },
    helper: {
      isOpen,
      setIsOpen,
      getItemProps,
      activeIndex,
      selectItem,
      listRef,
      FloatingFocusManager,
      context,
    },
  };
}
