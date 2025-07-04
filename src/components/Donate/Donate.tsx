import { DonateWrapper } from "./DonateWrapper";
import Image from "next/image";

export function Donate() {
  return (
    <div
      className={
        "flex items-center justify-evenly w-full h-full bg-primary-100 rounded-[8px]"
      }
    >
      <div className="relative w-260 h-95">
        <Image
          className="cover"
          fill
          src="/images/donateCat.svg"
          alt="Donate"
          draggable={false}
        />
      </div>

      <div>
        <DonateWrapper>
          <Image
            src="/icons/toss.png"
            alt="Toss Logo"
            width={24}
            height={24}
            draggable={false}
          />
          토스로 후원하기
        </DonateWrapper>
      </div>
    </div>
  );
}
