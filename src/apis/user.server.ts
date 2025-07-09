
"use server"

import { getCookieValue } from "@/utils/cookieUtils";
import { cookies } from "next/headers";
import { SwallowError } from "./decorators/SwallowError";
import { thisBind } from "./decorators/thisBind";
import { WithCookies } from "./decorators/WithCookie";
import { Fetcher } from "./Fetcher";

@thisBind
export class UserQuery extends Fetcher {
  @SwallowError()
  @WithCookies()
  public async getUser() {
    return await this.serverFetcher.get("auth/user");
  }

  @SwallowError()
  @WithCookies()
  public async patchUser() {
    return await this.serverFetcher.patch("auth/user/role", {
      json: { secret: "your_role_change_code" },
    });
  }
}

const { serverFetcher: fetcher } = new Fetcher();

// 사용되지 않고 있음
// export async function patchUserRoleAction() {
//   try {
//     return await fetcher.patch("auth/user/role", {
//       json: { secret: "your_role_change_code" },
//       headers: {
//         Cookie: await getCookieValue(),
//       },
//     });
//   } catch (error) {
//     console.error("Error occurred while patching user role:", error);
//   }
// }

export async function logoutAction() {
  try {
    // 백엔드 로그아웃 API 호출
    await fetcher.post(`auth/signout`, {
      headers: {
        Cookie: await getCookieValue(),
      },
    });
  } catch (error) {
    console.error("Error occurred during logout:", error);
  } finally {
    // 쿠키 삭제
    const cookieStoreForDelete = await cookies();
    cookieStoreForDelete.delete("connect.sid");
  }
}
