import { useState } from "react";

export default function useServerAction<T, R>(
  serverAction: (data: T) => Promise<R>
) {
  const [isPending, setIsPending] = useState(false);
  const dispatch = async (data: T) => {
    setIsPending(true);
    try {
      const result = await serverAction(data);
      return result;
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return [dispatch, isPending] as const;
}
