import Image from "next/image";
import { neato } from "neato";
import { IDropdownButton } from "./Dropdown";

export function InterviewDropdownButton({
  anchor,
  helpers,
  title,
  selectedOption,
}: {
  title: "직군" | "경력";
} & IDropdownButton) {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="label">{title}</div>
      <button
        type="button"
        className={neato(
          "flex w-full items-center justify-between gap-16 border-b-1 border-b-black py-8",
          helpers.isOpen && "border-b-primary-600"
        )}
        {...anchor}
      >
        <Image
          src={getImageByTitle(title)}
          alt="Dropdown Arrow"
          width={22}
          draggable={false}
          height={18}
        />
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

function getImageByTitle(title: "직군" | "경력"): string {
  switch (title) {
    case "직군":
      return "/icons/interviewLaptop.svg";
    case "경력":
      return "/icons/interviewLevel.svg";
    default:
      return "";
  }
}
