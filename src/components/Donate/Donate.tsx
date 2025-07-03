import { Clickable } from "../Clickable/Clickable";
import Image from "next/image";
import Link from "next/link";

export function Donate() {
  return (
    <div
      className={
        "flex items-center justify-evenly w-full h-full bg-primary-100 rounded-[8px]"
      }
    >
      <div className="relative w-260 h-110">
        <Image
          className="cover"
          fill
          src="/images/donate.svg"
          alt="Donate"
          draggable={false}
        />
      </div>

      <div>
        <Clickable types="shadow" size="large">
          <Link href="supertoss://send?amount=0&bank=KB%EA%B5%AD%EB%AF%BC%EC%9D%80%ED%96%89&accountNo=21780204433132&origin=qr">
            토스로 후원하기
          </Link>
        </Clickable>
      </div>
    </div>
  );
}
