import { cookies } from "next/headers";

export async function getCookieValue() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  return allCookies.reduce(
    (acc, { name, value }) => `${acc}${name}=${value}; `,
    ""
  );
}
