"use server";

import { Fetcher } from "./Fetcher";
import { getCookieValue } from "@/shared/utils/cookieUtils";
import { getEnumKeyByValue } from "@/shared/utils/enumUtils";
import { InterviewExperienceKr, InterviewPositionKr } from "@/types";

const { onServer } = new Fetcher();

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
    return await onServer.post(
      "interview/start",
      {
        body: {
          title,
          position: getEnumKeyByValue(position, InterviewPositionKr),
          experience: getEnumKeyByValue(experience, InterviewExperienceKr),
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
