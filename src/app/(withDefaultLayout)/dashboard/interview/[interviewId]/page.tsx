import { InterviewQuery } from "@/apis/interview.query";
import { For } from "@ilokesto/utilinent";
import { InterviewHeader } from "../(component)/InterviewHeader";

export default async function InterviewSessionPage({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const { interviewId } = await params;
  const { session } = await new InterviewQuery().getInterviewById(interviewId);

  return (
    <main className="flex h-dvh w-full flex-col overflow-y-scroll">
      <InterviewHeader interview={session} />

      <div className="@container/main mx-auto w-full max-w-1160 flex-1 overflow-y-scroll px-40 py-100">
        <For each={session.messages}>
          {(message) => <div key={message.id}>{message.content}</div>}
        </For>
      </div>
    </main>
  );
}
