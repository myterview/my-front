"use server";

import { Fetcher } from "./Fetcher";
import { getCookieValue } from "@/shared/utils/cookieUtils";
import { cookies } from "next/headers";

const { fetcher } = new Fetcher();

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
