"use server";

import { Fetcher } from "./Fetcher";
import { getCookieValue } from "@/shared/utils/cookieUtils";
import { getEnumKeyByValue } from "@/shared/utils/enumUtils";
import { FeedbackTypeKr } from "@/types";

const { onServer: fetcher } = new Fetcher();

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
    return await fetcher.post(
      `feedback`,
      {
        body: {
          type: getEnumKeyByValue(type, FeedbackTypeKr),
          message,
        },
      },
      {
        headers: {
          Cookie: await getCookieValue(),
        },
      }
    );
  } catch (error) {
    console.error("Error occurred while starting interview:", error);
  }
}
