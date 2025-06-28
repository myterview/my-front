"use server";

import { ApiResponse } from "@/types/apiUtils";
import { Fetcher } from "./Fetcher";
import { cookies } from "next/headers";

const userFetcher = new Fetcher().createCustomFetcher({
  prefixUrl: "/auth",
});

export async function patchUserRoleAction() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const Cookie = allCookies.reduce(
    (acc, { name, value }) => `${acc}${name}=${value}; `,
    ""
  );

  try {
    return await userFetcher.patch<ApiResponse<"/auth/user/role", "patch">>(
      `user/role`,
      {
        json: { secret: "your_role_change_code" },
        headers: {
          Cookie,
        },
      }
    );
  } catch (error) {
    console.error("Error occurred while patching user role:", error);
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const Cookie = allCookies.reduce(
    (acc, { name, value }) => `${acc}${name}=${value}; `,
    ""
  );

  try {
    // 백엔드 로그아웃 API 호출
    await userFetcher.post(`signout`, {
      headers: {
        Cookie,
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
