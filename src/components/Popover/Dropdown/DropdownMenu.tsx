import { IPopoverFloater } from "../Popover";
import { For } from "@ilokesto/utilinent";
import { neato } from "neato";
import { useEffect, useState } from "react";

export function DropdownMenu({
  floater,
  helpers,
  options,
  selectedOption,
  className,
  setSelectedOption,
}: IPopoverFloater & {
  className?: string;
}) {
  const [isOpened, setIsOpened] = useState(helpers.isOpen);
  useEffect(() => {
    setIsOpened(helpers.isOpen);
  }, [helpers.isOpen]);

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
                helpers.listRef.current[index] = node;
              }}
              className={neato(
                "cursor-pointer px-4 py-2 font-semibold text-gray-600",
                helpers.activeIndex === index && "bg-blue-100",
                selectedOption === option && "text-blue-600",
                className
              )}
              {...helpers.getItemProps({
                onClick: () =>
                  helpers.selectItem(() => setSelectedOption(option)),
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
