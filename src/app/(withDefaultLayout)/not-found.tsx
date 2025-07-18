"use client";

import { Clickable } from "@/ui/components/Clickable/Clickable";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="m-auto flex h-dvh w-full max-w-780 flex-col items-center justify-center gap-24 px-65">
      <div className="flex flex-col items-center justify-center gap-8">
        <Image
          src="/images/not-found.gif"
          alt="Not Found"
          width={1200}
          height={300}
          draggable={false}
        />
        <div className="heading-02">페이지를 찾을 수 없습니다.</div>
        <Clickable types="default">
          <button type="button" onClick={() => router.back()}>
            뒤로가기
          </button>
        </Clickable>
      </div>
    </main>
  );
}
