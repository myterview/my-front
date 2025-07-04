import { SessionForm } from "../(component)/SessionForm";
import { SessionHeader } from "../(component)/SessionHeader";
import { SessionMain } from "../(component)/SessionMain";
import { InterviewQuery } from "@/apis/interview.query";
import { UserQuery } from "@/apis/user.query";
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
    <main className="flex h-dvh w-full flex-col overflow-y-scroll">
      <SessionHeader interviewId={interviewId} />

      <SessionMain interviewId={interviewId} />

      <SessionForm interviewId={interviewId} />
    </main>
  );
}
