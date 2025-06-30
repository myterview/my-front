import { thisBind } from "./decorators/thisBind";
import { WithCookies } from "./decorators/WithCookie";
import { Fetcher } from "./Fetcher";

@thisBind
export class InterviewQuery extends Fetcher {
  @WithCookies()
  public async getInterview() {
    return await this.serverFetcher.get("interview");
  }
}
