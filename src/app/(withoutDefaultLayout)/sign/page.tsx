import { Clickable } from "@/components/Clickable/Clickable";
import { Logo } from "@/components/Logo/Logo";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center m-auto gap-46 max-w-480 w-full h-dvh px-65">
      <header className="flex flex-col items-center justify-center gap-16">
        <Logo size="large"/>
        <p className="font-bold text-xl">오직 당신만을 위한 AI 면접 코치</p>
      </header>

      <main className="flex flex-col items-center justify-center gap-22 mt-10">
        <Clickable types="social">
          <Link href="http://localhost:3000/api/auth/google">google</Link>
        </Clickable>

        <Clickable types="social">
          <Link href="http://localhost:3000/api/auth/github">github</Link>
        </Clickable>
      </main>
    </div>
  );
}