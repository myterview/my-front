import { SessionHeader } from "../(component)/SessionHeader";
import { SessionForm } from "../(component)/SessionForm";
import { SessionMain } from "../(component)/SessionMain";

export default async function InterviewSessionPage({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const { interviewId } = await params;

  return (
    <main className="flex h-dvh w-full flex-col overflow-y-scroll">
      <SessionHeader interviewId={interviewId} />

      <SessionMain interviewId={interviewId} />

      <SessionForm interviewId={interviewId} />
    </main>
  );
}
