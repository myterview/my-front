"use server";

import { FeedbackTypeKr } from "@/hooks/sicilian/feedbackForm";
import { getCookieValue } from "@/utils/cookieUtils";
import { Fetcher } from "./Fetcher";
import { getEnumKeyByValue } from "@/utils/enumUtils";

const { serverFetcher: fetcher } = new Fetcher();

export async function postFeedback(
  prev: unknown,
  {
    title,
    type,
  }: {
    title: string;
    type: FeedbackTypeKr | "";
  }
) {
  try {
    return await fetcher.post(`feedback`, {
      json: {
        title,
        type: getEnumKeyByValue(FeedbackTypeKr, type),
      },
      headers: {
        Cookie: await getCookieValue(),
      },
    });
  } catch (error) {
    console.error("Error occurred while starting interview:", error);
  }
}
