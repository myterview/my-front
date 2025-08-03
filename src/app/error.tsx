"use client";

import NotFound from "./(optionalUserLayout)/not-found";
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
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="mb-4 text-2xl font-bold">에러 발생</h1>
      <p className="mb-4 text-red-500">{error.message}</p>
      <button
        onClick={() => {
          router.refresh();
          reset();
        }}
        className="px-4 py-2 text-white bg-primary-500 rounded hover:bg-primary-600"
      >
        다시 시도
      </button>
    </div>
  );
}
