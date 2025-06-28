"use server";

import { ApiResponse } from "@/types/apiUtils";
import { cookies } from "next/headers";
import { Fetcher } from "./Fetcher";

const interviewFetcher = new Fetcher().createCustomFetcher({
  prefixUrl: "/interview",
});

export async function startInterview<T>(data: T) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const Cookie = allCookies.reduce(
    (acc, { name, value }) => `${acc}${name}=${value}; `,
    ""
  );

  try {
    return await interviewFetcher.post<ApiResponse<"/interview/start", "post">>(
      `start`,
      {
        json: data,
        headers: {
          Cookie,
        },
      }
    );
  } catch (error) {
    console.error("Error occurred while starting interview:", error);
  }
}
