import { SwallowError } from "./decorators/SwallowError";
import { thisBind } from "./decorators/thisBind";
import { WithCookies } from "./decorators/WithCookie";
import { Fetcher } from "./Fetcher";

type User = {
  id: string;
  email: string;
  nickname: string;
  role: string;
  provider: string;
  profileImage?: string;
  bio?: string;
};

@thisBind
export class UserQuery extends Fetcher {
  private userFetcher = this.createCustomFetcher({
    prefixUrl: "/auth",
  });

  @SwallowError()
  @WithCookies()
  public async getUser() {
    return await this.userFetcher.get<User>("user", {
      searchParams: { include: "id,name,email" }, // json 대신 searchParams 사용
    });
  }

  @SwallowError()
  @WithCookies()
  public async patchUser() {
    return await this.userFetcher.patch<User>("user/role", {
      json: { secret: "your_role_change_code" },
    });
  }
}
