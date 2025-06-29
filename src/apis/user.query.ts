import { SwallowError } from "./decorators/SwallowError";
import { thisBind } from "./decorators/thisBind";
import { WithCookies } from "./decorators/WithCookie";
import { Fetcher } from "./Fetcher";

@thisBind
export class UserQuery extends Fetcher {
  @SwallowError()
  @WithCookies()
  public async getUser() {
    return await this.serverFetcher.get("auth/user", {
      searchParams: { include: "id,name,email" },
    });
  }

  @SwallowError()
  @WithCookies()
  public async patchUser() {
    return await this.serverFetcher.patch("auth/user/role", {
      json: { secret: "your_role_change_code" },
    });
  }
}
