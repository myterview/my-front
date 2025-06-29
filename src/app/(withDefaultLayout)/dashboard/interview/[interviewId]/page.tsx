import { InterviewQuery } from "@/apis/interview.query";
import { For } from "@ilokesto/utilinent";

export default async function InterviewSessionPage({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const { interviewId } = await params;

  const { getInterviewById } = new InterviewQuery();
  const interview = await getInterviewById(interviewId);

  return (
    <>
      <For each={interview.session.messages}>
        {(message) => <div key={message.id}>{message.content}</div>}
      </For>
    </>
  );
}
