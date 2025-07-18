import { useSicilianContext } from "@ilokesto/sicilian/provider";
import { Show } from "@ilokesto/utilinent";
import { neato } from "neato";
import Image from "next/image";
import { PopoverProps } from "../Popover";

export function DropdownInput({
  anchor,
  helper,
  title,
  iconSrc,
}: {
  title?: string;
  iconSrc?: string;
} & PopoverProps["anchorElement"]) {
  const { register, name, getErrors } = useSicilianContext()


  return (
    <div className="w-full space-y-8">
      <Show when={title}>
        {(title) => <div className="label">{title}</div>}
      </Show>

      <button
        type="button"
        className={neato(
          "flex w-full items-center justify-between gap-16 border-b-1 border-b-black py-8 cursor-pointer",
          helper.isOpen && "border-b-primary-600",
          getErrors(name) && "border-b-red-600"
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

        <input {...register({ name })} readOnly className="dropdown block min-h-30 flex-1 w-1 text-left  cursor-pointer" />

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
