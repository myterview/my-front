"use server";

import { Fetcher } from "./Fetcher";
import { cookies } from "next/headers";

type User = {
  id: string;
  name: string;
  email: string;
  // 필요한 다른 필드들...
};

export async function patchUserRoleAction() {
  const userFetcher = new Fetcher().createCustomFetcher({
    prefixUrl: "/auth",
  });

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const Cookie = allCookies.reduce(
    (acc, { name, value }) => `${acc}${name}=${value}; `,
    ""
  );

  try {
    return await userFetcher.patch<User>(`user/role`, {
      json: { secret: "your_role_change_code" },
      headers: {
        Cookie,
      },
    });
  } catch (error) {
    console.error("Error occurred while patching user role:", error);
  }
}

export async function logoutAction() {
  const userFetcher = new Fetcher().createCustomFetcher({
    prefixUrl: "/auth",
  });

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
