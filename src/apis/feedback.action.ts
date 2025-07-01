"use server";

import { Fetcher } from "./Fetcher";
import { FeedbackTypeKr } from "@/hooks/sicilian/feedbackForm";
import { getCookieValue } from "@/utils/cookieUtils";
import { getEnumKeyByValue } from "@/utils/enumUtils";

const { serverFetcher: fetcher } = new Fetcher();

export async function postFeedback(
  prev: unknown,
  {
    title,
    type,
    message,
  }: {
    title: string;
    type: FeedbackTypeKr | "";
    message: string;
  }
) {
  try {
    return await fetcher.post(`feedback`, {
      json: {
        title,
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
