import { SwallowError } from "./decorators/SwallowError";
import { thisBind } from "./decorators/thisBind";
import { WithCookies } from "./decorators/WithCookie";
import { Fetcher } from "./Fetcher";

@thisBind
export class UserQuery extends Fetcher {
  @SwallowError()
  @WithCookies()
  public async getUser() {
    return await this.fetcher.get("auth/user");
  }

  @SwallowError()
  @WithCookies()
  public async patchUser() {
    return await this.fetcher.patch("auth/user/role", {
      body: {
        secret: "admin-secret", // API 스펙에 따르면 secret 필드가 필요
      },
    });
  }
}
