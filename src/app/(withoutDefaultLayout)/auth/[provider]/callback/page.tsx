'use client';

import { useSearchParams, useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { provider } = useParams(); // 경로 파라미터 가져오기
  
  useEffect(() => {
    const doLogin = async () => {      
      const res = await fetch(`http://localhost:3000/api/auth/${provider}/callback?${searchParams.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        // 로그인 성공 후 리다이렉트
        router.push(data.redirectUrl || '/');
      } else {
        // 로그인 실패 처리
        console.error('로그인 실패:', res.statusText);
        router.push('/login?error=login_failed');
      }
    };

    doLogin();
  }, [provider, searchParams, router]);

  return <div>인증 처리 중입니다...</div>;
}