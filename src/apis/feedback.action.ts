"use server";

import { Fetcher } from "./Fetcher";
import { FeedbackTypeKr } from "@/types";
import { getCookieValue } from "@/utils/cookieUtils";
import { getEnumKeyByValue } from "@/utils/enumUtils";

const { serverFetcher: fetcher } = new Fetcher();

export async function postFeedback(
  prev: unknown,
  {
    type,
    message,
  }: {
    type: FeedbackTypeKr | "";
    message: string;
  }
) {
  try {
    return await fetcher.post(`feedback`, {
      json: {
        type: getEnumKeyByValue(FeedbackTypeKr, type),
        message,
      },
      headers: {
        Cookie: await getCookieValue(),
      },
    });
  } catch (error) {
    console.error("Error occurred while starting interview:", error);
  }
}
