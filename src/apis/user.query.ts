import { SwallowError } from "./decorators/SwallowError";
import { thisBind } from "./decorators/thisBind";
import { WithCookies } from "./decorators/WithCookie";
import { Fetcher } from "./Fetcher";

type User = {
  id: string;
  name: string;
  email: string;
  // 필요한 다른 필드들...
};

@thisBind
export class UserQuery extends Fetcher {
  private userFetcher = this.createCustomFetcher({
    prefixUrl: '/auth',
  });

  @SwallowError()
  @WithCookies()
  public async getUser() {
    return await this.userFetcher.get<User>('user',{
      searchParams: { include: 'id,name,email' }  // json 대신 searchParams 사용
    });
  }

  @SwallowError()
  @WithCookies()
  public async patchUser() {
    return await this.userFetcher.patch<User>('user/role',{
      json: { secret: "your_role_change_code" },
    });
  }
}