"use server";

import { Fetcher } from "./Fetcher";
import {
  InterviewPositionKr,
  InterviewExperienceKr,
} from "@/hooks/sicilian/interviewForm";
import { getCookieValue } from "@/utils/cookieUtils";
import { getEnumKeyByValue } from "@/utils/enumUtils";

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
        position: getEnumKeyByValue(InterviewPositionKr, position),
        experience: getEnumKeyByValue(InterviewExperienceKr, experience),
      },
      headers: {
        Cookie: await getCookieValue(),
      },
    });
  } catch (error) {
    console.error("Error occurred while starting interview:", error);
  }
}
