import { useState, useCallback } from "react";

type Status = "idle" | "pending" | "success" | "error";

export function useServerAction<TArgs extends unknown[], TResult>(
  serverAction: (...args: TArgs) => Promise<TResult>
) {
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<TResult | null>(null);
  const [error, setError] = useState<unknown>(null);

  const execute = useCallback(
    async (...args: TArgs) => {
      setStatus("pending");
      setError(null);
      try {
        const result = await serverAction(...args);
        setData(result);
        setStatus("success");
        return result;
      } catch (err) {
        setError(err);
        setStatus("error");
        return null;
      }
    },
    [serverAction]
  );

  return { execute, data, status, isPending: status === "pending", error };
}
