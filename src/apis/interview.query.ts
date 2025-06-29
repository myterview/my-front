import { thisBind } from "./decorators/thisBind";
import { WithCookies } from "./decorators/WithCookie";
import { Fetcher } from "./Fetcher";

@thisBind
export class InterviewQuery extends Fetcher {
  @WithCookies()
  public async getInterview() {
    return await this.serverFetcher.get("interview");
  }

  @WithCookies()
  public async getInterviewById(interviewId: string) {
    return await this.serverFetcher.get(
      `interview/${interviewId}` as "interview/{sessionId}"
    );
  }
}
