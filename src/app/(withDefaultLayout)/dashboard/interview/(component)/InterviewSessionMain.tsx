"use client";
import { InterviewClient } from "@/apis/interview.client";
import SizeWrapper from "@/components/SizeWrapper/SizeWrapper";
import { useInterviewLoading } from "@/hooks/caro-kann/useInterviewLoading";
import { components } from "@/types/api";
import { For, Show } from "@ilokesto/utilinent";
import { useSuspenseQuery } from "@tanstack/react-query";

export function InterviewSessionMain({ interviewId }: { interviewId: string }) {
  const isLoading = useInterviewLoading.readOnly();
  const interviewClient = new InterviewClient();
  const { data } = useSuspenseQuery(
    interviewClient.getInterviewById(interviewId)
  );

  const messageList = data.session.messages.reduce(
    (acc, message) => {
      const newMessage = message.content.split("\n\n");

      for (const word of newMessage) {
        const newWord = word.trim();
        acc.push({
          ...message,
          content: newWord.at(-1) === "." ? newWord : newWord + ".",
        });
      }

      return acc;
    },
    [] as Array<components["schemas"]["InterviewMessage"]>
  );

  return (
    <SizeWrapper
      asChild="div"
      className="@container/main flex-1 overflow-y-scroll py-100"
    >
      <For each={messageList}>
        {(message) => (
          <div key={message.content} className="whitespace-pre-line">
            {message.content}
          </div>
        )}
      </For>
      <Show when={isLoading}>aaa</Show>
    </SizeWrapper>
  );
}
