"use client";

import { components } from "@/types/api";
import { Avatar } from "../Avatar/Avatar";
import Link from "next/link";
import Image from "next/image";
import { logoutAction } from "@/apis/user.action";
import { useEffect } from "react";

export function SidebarFooter({
  user,
}: {
  user: components["schemas"]["UserResDTO"];
}) {
  useEffect(() => {
    setInterval(
      async () => {
        fetch(process.env.NEXT_PUBLIC_CLIENT_API_URL + "/auth/user", {
          credentials: "include", // 쿠키를 포함하여 요청
        });
      },
      1000 * 60 * 30
    ); // 30분마다 자동 로그아웃 방지
  }, []);

  return (
    <div className="bg-primary-600 flex w-280 flex-col gap-20 px-20 pt-18 pb-28">
      <div className="flex items-center justify-between">
        <Avatar src={user.profileImage} />
        <div className="flex flex-col items-end gap-12 text-base/12 font-semibold text-gray-100">
          <p>{user.email}</p>
          <button onClick={logoutAction}>로그아웃</button>
        </div>
      </div>

      <div className="flex flex-col gap-16 font-semibold text-blue-100">
        <Link href="/setting" className="flex gap-12">
          <Image
            src="/icons/setting.svg"
            alt="설정"
            draggable={false}
            width={24}
            height={24}
            className="brightness-[104%] contrast-[104%] hue-rotate-[183deg] invert-[81%] saturate-[237%] sepia-[28%]"
          />
          설정
        </Link>

        <Link href="/term" className="flex gap-12">
          <Image
            src="/icons/term.svg"
            alt="이용약관"
            draggable={false}
            width={24}
            height={24}
            className="brightness-[104%] contrast-[104%] hue-rotate-[183deg] invert-[81%] saturate-[237%] sepia-[28%]"
          />
          이용약관
        </Link>
      </div>
    </div>
  );
}
