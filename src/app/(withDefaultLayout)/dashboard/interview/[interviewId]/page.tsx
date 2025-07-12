import { SessionForm } from "../../../../../ui/sections/SessionForm";
import { SessionHeader } from "../../../../../ui/sections/SessionHeader";
import { SessionMain } from "../../../../../ui/sections/SessionMain";
import { InterviewQuery } from "@/apis/interview.serverQuery";
import { UserQuery } from "@/apis/user.serverQuery";
import { notFound, redirect } from "next/navigation";

export default async function InterviewSessionPage({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const { interviewId } = await params;
  const userQuery = new UserQuery();
  const interviewQuery = new InterviewQuery();

  const currentUser = await userQuery.getUser();
  const currentInterview = await interviewQuery.getInterviewById(interviewId);

  if (!currentInterview) {
    notFound();
  }

  if (!currentUser) {
    redirect("/sign");
  }

  if (currentUser.id !== currentInterview.session.userId) {
    redirect("/dashboard/interview");
  }

  return (
    <main className="flex flex-col w-full overflow-y-scroll h-dvh">
      <SessionHeader interviewId={interviewId} />

      <SessionMain interviewId={interviewId} />

      <SessionForm interviewId={interviewId} />
    </main>
  );
}
