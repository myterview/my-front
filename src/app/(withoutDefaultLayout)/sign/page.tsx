import { Clickable } from "@/components/Clickable/Clickable";
import { Logo } from "@/components/Logo/Logo";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center m-auto gap-46 max-w-480 w-full h-dvh px-65">
      <header className="flex flex-col items-center justify-center gap-16">
        <Logo size="large"/>
        <p className="font-bold text-xl">오직 당신만을 위한 AI 면접 코치</p>
      </header>

      <main className="flex flex-col items-center justify-center gap-22 mt-10 w-full">
        <Clickable types="social">
          <Link href="http://localhost:3000/api/auth/google">
            <Image src="/images/google.svg" alt="Google Logo" width={24} height={24} />
            Google 로그인
          </Link>
        </Clickable>

        <Clickable types="social">
          <Link href="http://localhost:3000/api/auth/github">
            <Image src="/images/github.svg" alt="Github Logo" width={24} height={24} />
            github 로그인
          </Link>
        </Clickable>
      </main>
    </div>
  );
}