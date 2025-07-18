import { InterviewQuery } from "@/api/interview.serverQuery";
import { UserQuery } from "@/api/user.serverQuery";
import { getEnumValueByKey } from "@/shared/utils/enumUtils";
import { SessionForm } from "@/ui/sections/SessionForm";
import { SessionHeader } from "@/ui/sections/SessionHeader";
import { SessionMain } from "@/ui/sections/SessionMain";
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
      <SessionHeader
        title={currentInterview.session.title}
        createdAt={currentInterview.session.createdAt}
        tags={[
          getEnumValueByKey(currentInterview.session.position),
          getEnumValueByKey(currentInterview.session.experience),
        ]}
      />

      <SessionMain interviewId={interviewId} />

      <SessionForm interviewId={interviewId} />
    </main>
  );
}
