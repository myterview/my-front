"use client";

import { Clickable } from "../Clickable/Clickable";
import { ModalWrapper } from "../Modal/ModalWrapper";
import { Show } from "@ilokesto/utilinent";
import { grunfeld } from "grunfeld";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Donate() {
  const [isWide, setIsWide] = useState<boolean>(false);

  useEffect(() => {
    const checkWidth = () => setIsWide(window.innerWidth >= 770);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  return (
    <Show when={isWide} fallback={<DonateMobile />}>
      <DonateDesktop />
    </Show>
  );
}

function DonateMobile() {
  return (
    <Link
      href="supertoss://send?amount=0&bank=KB%EA%B5%AD%EB%AF%BC%EC%9D%80%ED%96%89&accountNo=21780204433132&origin=qr"
      className="w-full h-full bg-primary-100 rounded-[8px] flex items-center justify-center"
    >
      <Image
        className="cover"
        width={220}
        height={90}
        src="/images/donateToMrCat.png"
        alt="Donate"
        draggable={false}
      />
    </Link>
  );
}

function DonateDesktop() {
  return (
    <div className="flex items-center justify-evenly w-full bg-primary-100 rounded-[8px]">
      <Image
        className="cover"
        width={220}
        height={90}
        src="/images/donateToMrCat.svg"
        alt="Donate"
        draggable={false}
      />
      <Clickable types="shadow" size="large" className="gap-8">
        <button
          onClick={() =>
            grunfeld.add(
              <ModalWrapper className="space-y-16">
                <div>
                  <ModalWrapper.Title title="QR 코드로 후원" />
                  <p className="dropdown">스캔하면 토스로 이동합니다</p>
                </div>
                <Image
                  src="/images/donateQR.png"
                  alt="QR Code"
                  width={218}
                  height={218}
                  draggable={false}
                />
              </ModalWrapper>
            )
          }
        >
          <Image
            src="/icons/toss.png"
            alt="toss"
            width={20}
            height={20}
            draggable={false}
          />
          먀터뷰 후원하기
        </button>
      </Clickable>
    </div>
  );
}
