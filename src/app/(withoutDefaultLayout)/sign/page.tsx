import { Clickable } from "@/components/Clickable/Clickable";
import { Logo } from "@/components/Logo/Logo";
import Image from "next/image";
import Link from "next/link";
import { For } from "@ilokesto/utilinent";

export default function Page() {
  const SIGN_ARRAY = [
    {
      href: "http://localhost:3000/api/auth/google",
      imageSrc: "/images/google.svg",
      altText: "Google Logo",
      text: "Google 로그인",
    },
    {
      href: "http://localhost:3000/api/auth/github",
      imageSrc: "/images/github.svg",
      altText: "Github Logo",
      text: "github 로그인",
    },
  ];

  return (
    <div className="m-auto flex h-dvh w-full max-w-480 flex-col items-center justify-center gap-46 px-65">
      <header className="flex flex-col items-center justify-center gap-16">
        <Logo size="large" />
        <p className="text-xl font-bold">오직 당신만을 위한 AI 면접 코치</p>
      </header>

      <main className="mt-10 flex w-full flex-col items-center justify-center gap-22">
        <For each={SIGN_ARRAY}>
          {({ href, imageSrc, altText, text }) => (
            <Clickable types="shadow" size="large" className="w-full">
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
