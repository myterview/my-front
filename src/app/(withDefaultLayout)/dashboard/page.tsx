import { redirect } from "next/navigation";

export const metadata = {
  title: "대시보드 | myterview",
  description: "myterview의 대시보드에서 다양한 기능을 확인하세요.",
};

export default async function DashboardPage() {
  redirect("/dashboard/interview");

  return <></>;
}
