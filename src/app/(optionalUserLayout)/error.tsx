"use client";

import NotFound from "../(optionalUserLayout)/not-found";
import { HTTPError } from "ky";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: HTTPError;
  reset: () => void;
}) {
  const router = useRouter();

  if (error.response?.status === 404) {
    return <NotFound />;
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">에러 발생</h1>
      <p className="mb-4 text-red-500">{error.message}</p>
      <button
        onClick={() => {
          router.refresh();
          reset();
        }}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        다시 시도
      </button>
    </div>
  );
}
