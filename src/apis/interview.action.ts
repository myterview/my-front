"use server";

import { ApiResponse } from "@/types/apiUtils";
import { Fetcher } from "./Fetcher";
import { getEnumKeyByValue } from "@/utils/enumUtils";
import {
  InterviewPositionKr,
  InterviewExperienceKr,
} from "@/hooks/sicilian/interviewForm";
import { getCookieValue } from "@/utils/cookieUtils";

const interviewFetcher = new Fetcher().createCustomFetcher({
  prefixUrl: "/interview",
});

export async function startInterview({
  title,
  position,
  experience,
}: {
  title: string;
  position: InterviewPositionKr | "";
  experience: InterviewExperienceKr | "";
}) {
  try {
    return await interviewFetcher.post<ApiResponse<"/interview/start", "post">>(
      `start`,
      {
        json: {
          title,
          position: getEnumKeyByValue(InterviewPositionKr, position),
          experience: getEnumKeyByValue(InterviewExperienceKr, experience),
        },
        headers: {
          Cookie: await getCookieValue(),
        },
      }
    );
  } catch (error) {
    console.error("Error occurred while starting interview:", error);
  }
}
