import { redirect } from "next/navigation";

export const metadata = {
  title: "홈 | myterview",
  description: "AI 면접 코치 myterview의 홈입니다.",
};

export default async function Home() {
  // const { getUser } = new UserQuery();
  // const user = await getUser();

  // if (user) {
  //   redirect("/dashboard")
  // }

  redirect("/dashboard/interview");

  return <></>;
}
