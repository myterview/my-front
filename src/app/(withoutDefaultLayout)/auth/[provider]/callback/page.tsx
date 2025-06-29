"use client";

import { Fetcher } from "@/apis/Fetcher";
import { useSearchParams, useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { provider } = useParams(); // 경로 파라미터 가져오기

  useEffect(() => {
    const doLogin = async () => {
      const { instance } = new Fetcher();

      const res = await instance("client").get<{ redirectUrl: string }>(
        `auth/${provider}/callback?${searchParams.toString()}`,
        {
          credentials: "include",
        }
      );

      if (res.ok) {
        const data = await res.json();
        router.push(data.redirectUrl);
      } else {
        // 로그인 실패 처리
        console.error("로그인 실패:", res.statusText);
      }
    };

    doLogin();
  }, [provider, searchParams, router]);

  return <div>인증 처리 중입니다...</div>;
}
