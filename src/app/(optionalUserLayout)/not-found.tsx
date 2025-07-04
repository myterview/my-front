import Image from "next/image";

export default function NotFound() {
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
      </div>
    </main>
  );
}
