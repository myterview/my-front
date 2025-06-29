// import { UserQuery } from "@/apis/user.query";
import { redirect } from "next/navigation";

export default async function Home() {
  // const { getUser } = new UserQuery();
  // const user = await getUser();

  // if (user) {
  //   redirect("/dashboard")
  // }

  redirect("/dashboard");

  return <></>;
}
