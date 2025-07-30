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
import { useEffect, useRef, useState } from "react";

export type PopoverProps = {
  anchorElement: {
    anchor: ReturnType<typeof usePopoverPosition>["anchor"];
    helper: ReturnType<typeof usePopoverPosition>["helper"];
  };
  floaterElement: {
    floater: ReturnType<typeof usePopoverPosition>["floater"];
    helper: ReturnType<typeof usePopoverPosition>["helper"];
  };
  position?: { mainAxis: number; crossAxis: number; placement: Placement };
};

export function Popover({
  anchorElement,
  floaterElement,
  position,
}: {
  anchorElement: (
    anchorElementProps: PopoverProps["anchorElement"]
  ) => React.ReactElement;
  floaterElement: (
    floaterElementProps: PopoverProps["floaterElement"]
  ) => React.ReactElement;
} & Pick<PopoverProps, "position">) {
  const { anchor, floater, helper } = usePopoverPosition({ position });

  return (
    <>
      {anchorElement({ anchor, helper })}

      {helper.isOpen && (
        <helper.FloatingFocusManager context={helper.context} modal={false}>
          {floaterElement({ floater, helper })}
        </helper.FloatingFocusManager>
      )}
    </>
  );
}

function usePopoverPosition({
  position = { mainAxis: 0, crossAxis: 0, placement: "bottom-start" },
}: Pick<PopoverProps, "position">) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [anchorWidth, setAnchorWidth] = useState<number>();
  const listRef = useRef<Array<HTMLElement | null>>([]);
  const anchorRef = useRef<HTMLElement | null>(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      setIsOpen(open);
      if (!open) setActiveIndex(null);
    },
    middleware: [
      offset({ mainAxis: position.mainAxis, crossAxis: position.crossAxis }),
      flip(),
      shift(),
    ],
    placement: position.placement,
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (!anchorRef.current) return;
    function updateWidth() {
      setAnchorWidth(
        anchorRef.current ? anchorRef.current.offsetWidth : undefined
      );
    }
    updateWidth();
    const ro = new window.ResizeObserver(updateWidth);
    ro.observe(anchorRef.current);
    window.addEventListener("resize", updateWidth);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const click = useClick(context, {
    event: "mousedown", // input의 경우 mousedown 이벤트 사용
  });
  // const hover = useHover(context);
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
    [click, dismiss, role, listNavigation] //, hover]
  );

  const selectItem = (callback: () => void) => {
    callback();
    setIsOpen(false);
    setActiveIndex(null);
  };

  return {
    anchor: {
      ref: (node: HTMLElement | null) => {
        refs.setReference(node);
        anchorRef.current = node;
      },
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
      anchorWidth,
    },
  };
}
