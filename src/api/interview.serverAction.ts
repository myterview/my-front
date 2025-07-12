"use server";

import { Fetcher } from "./Fetcher";
import { getCookieValue } from "@/shared/utils/cookieUtils";
import { getEnumKeyByValue } from "@/shared/utils/enumUtils";
import { InterviewExperienceKr, InterviewPositionKr } from "@/types";

const { serverFetcher: fetcher } = new Fetcher();

export async function startInterview(
  prev: unknown,
  {
    title,
    position,
    experience,
  }: {
    title: string;
    position: InterviewPositionKr | "";
    experience: InterviewExperienceKr | "";
  }
) {
  try {
    return await fetcher.post(`interview/start`, {
      json: {
        title,
        position: getEnumKeyByValue(position),
        experience: getEnumKeyByValue(experience),
      },
      headers: {
        Cookie: await getCookieValue(),
      },
    });
  } catch (error) {
    console.error("Error occurred while starting interview:", error);
  }
}
