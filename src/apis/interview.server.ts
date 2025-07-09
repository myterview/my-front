"use server";

import { InterviewExperienceKr, InterviewPositionKr } from "@/types";
import { getCookieValue } from "@/utils/cookieUtils";
import { getEnumKeyByValue } from "@/utils/enumUtils";
import { SwallowError } from "./decorators/SwallowError";
import { thisBind } from "./decorators/thisBind";
import { WithCookies } from "./decorators/WithCookie";
import { Fetcher } from "./Fetcher";

@thisBind
export class InterviewQuery extends Fetcher {
  @SwallowError()
  @WithCookies()
  public async getInterviewById(interviewId: string, withMessages: boolean = false) {
    return await this.serverFetcher.get(`interview/${interviewId}` as "interview/{sessionId}", {
      searchParams: { withMessages },
    });
  }
}

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
