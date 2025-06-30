import { InterviewSessionHeader } from "../(component)/InterviewSessionHeader";
import { InterviewSessionForm } from "../(component)/InterviewSessionForm";
import { InterviewSessionMain } from "../(component)/InterviewSessionMain";

export default async function InterviewSessionPage({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const { interviewId } = await params;

  return (
    <main className="flex h-dvh w-full flex-col overflow-y-scroll">
      <InterviewSessionHeader interviewId={interviewId} />

      <InterviewSessionMain interviewId={interviewId} />

      <InterviewSessionForm interviewId={interviewId} />
    </main>
  );
}
