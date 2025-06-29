import { neato } from "neato";
import { For } from "@ilokesto/utilinent";
import { IPopoverFloater } from "../Popover/Popover";

export function DropdownFloater({
  floater,
  helpers,
  options,
  selectedOption,
  setSelectedOption,
}: IPopoverFloater) {
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
                "min-w-132 cursor-pointer px-4 py-2 font-semibold text-gray-600",
                helpers.activeIndex === index && "bg-blue-100",
                selectedOption === option && "text-blue-600"
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
