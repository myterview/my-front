"use client";

import { Fetcher } from "@/api/Fetcher";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { provider } = useParams(); // 경로 파라미터 가져오기

  useEffect(() => {
    const doLogin = async () => {
      const { onClient } = new Fetcher();

      try {
        const response = await onClient.get(
          `auth/${provider}/callback?${searchParams.toString()}` as `auth/google/callback`,
          {
            credentials: "include",
          }
        );

        router.push(response.redirectUrl || "/");
      } catch (error) {
        console.error("Error occurred while logging in:", error);
      }
    };

    doLogin();
  }, [provider, searchParams, router]);

  return <div>인증 처리 중입니다...</div>;
}
