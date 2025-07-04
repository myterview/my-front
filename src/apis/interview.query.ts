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
