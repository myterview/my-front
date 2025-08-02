import { FieldOutlineWrapper } from "./FieldOutlineWrapper";
import { ClassValue } from "neato";
import Image from "next/image";

export default function FieldOutlineWithButtonWrapper({
  disabled,
  children,
  className,
}: {
  disabled?: boolean;
  className?: ClassValue;
  children: React.ReactNode;
}) {
  return (
    <FieldOutlineWrapper className={className}>
      {children}
      <button disabled={disabled}>
        <Image
          src="/icons/submitArrow.svg"
          alt="Submit"
          draggable={false}
          width={24}
          height={24}
        />
      </button>
    </FieldOutlineWrapper>
  );
}
