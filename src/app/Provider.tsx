"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GrunfeldProvider } from "grunfeld";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 0,
    },
  },
});

export function Provider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <GrunfeldProvider>{children}</GrunfeldProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "font-bold",
        }}
      />
    </QueryClientProvider>
  );
}
