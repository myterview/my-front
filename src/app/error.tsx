"use client";

import { HTTPError } from "ky";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error:  HTTPError;
  reset: () => void;
}) {
  const router = useRouter();


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">에러 발생</h1>
      <p className="text-red-500 mb-4">{error.message}</p>
      <button
        onClick={() => {router.refresh(); reset(); }}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        다시 시도
      </button>
    </div>
  );
}
