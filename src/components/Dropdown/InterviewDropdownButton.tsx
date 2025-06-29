import Image from "next/image";
import { neato } from "neato";
import { IPopoverAnchor } from "../Popover/Popover";
import { Show } from "@ilokesto/utilinent";

export function DropdownAnchor({
  anchor,
  helpers,
  title,
  selectedOption,
  iconSrc,
}: {
  title?: string;
  iconSrc?: string;
} & IPopoverAnchor) {
  return (
    <div className="flex w-full flex-col gap-8">
      <Show when={title}>
        {(title) => <div className="label">{title}</div>}
      </Show>

      <button
        type="button"
        className={neato(
          "flex w-full items-center justify-between gap-16 border-b-1 border-b-black py-8",
          helpers.isOpen && "border-b-primary-600"
        )}
        {...anchor}
      >
        <Show when={iconSrc}>
          {(iconSrc) => (
            <Image
              src={iconSrc}
              alt="Dropdown Icon"
              width={22}
              draggable={false}
              height={18}
            />
          )}
        </Show>

        <span className="dropdown min-h-30 flex-1 text-left">
          {selectedOption}
        </span>

        <Image
          src="/icons/dropdownArrow.svg"
          alt="Dropdown Arrow"
          width={24}
          draggable={false}
          height={24}
        />
      </button>
    </div>
  );
}
