import { Clickable } from "@/ui/components/Clickable/Clickable";
import { Logo } from "@/ui/components/Logo/Logo";
import { For } from "@ilokesto/utilinent";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "로그인 | myterview",
  description: "Google 또는 Github 계정으로 myterview에 로그인하세요.",
};

export default function Page() {
  const SIGN_ARRAY = [
    {
      href: process.env.NEXT_PUBLIC_CLIENT_API_URL + "/auth/google",
      imageSrc: "/images/google.svg",
      altText: "Google Logo",
      text: "Google 로그인",
    },
    {
      href: process.env.NEXT_PUBLIC_CLIENT_API_URL + "/auth/github",
      imageSrc: "/images/github.svg",
      altText: "Github Logo",
      text: "github 로그인",
    },
  ];

  return (
    <div className="m-auto flex h-dvh w-full max-w-480 flex-col items-center justify-center gap-24 px-65">
      <header className="flex flex-col items-center justify-center gap-8 font-nanum">
        <Logo size="large" />
        <p className="text-xl font-bold">오직 당신만을 위한 AI 면접 코치</p>
      </header>

      <main className="mt-10 flex w-full flex-col items-center justify-center gap-22">
        <For each={SIGN_ARRAY}>
          {({ href, imageSrc, altText, text }) => (
            <Clickable
              key={text}
              types="shadow"
              size="large"
              className="w-full"
            >
              <Link href={href}>
                <Image
                  draggable={false}
                  src={imageSrc}
                  alt={altText}
                  width={24}
                  height={24}
                />
                {text}
              </Link>
            </Clickable>
          )}
        </For>
      </main>
    </div>
  );
}
