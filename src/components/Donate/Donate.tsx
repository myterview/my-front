import { DonateWrapper } from "./DonateWrapper";
import { neato } from "neato";
import Image from "next/image";

export function Donate() {
  return (
    <div
      className={neato(
        "flex items-center justify-evenly w-full h-full bg-primary-100 rounded-[8px]"
      )}
    >
      <div className="relative w-220 h-90">
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
          먀터뷰 후원하기
        </DonateWrapper>
      </div>
    </div>
  );
}
