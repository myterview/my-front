"use client";

import { InterviewClient } from "@/apis/interview.client";
import { DefaultTextAreaWrapper } from "@/components/Form/DefaultTextAreaWrapper";
import { TextArea } from "@/components/Form/TextArea";
import SizeWrapper from "@/components/SizeWrapper/SizeWrapper";
import { useInterviewLoading } from "@/hooks/caro-kann/useInterviewLoading";
import { CreateForm } from "@ilokesto/sicilian";
import { SicilianProvider } from "@ilokesto/sicilian/provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const { register, handleSubmit } = new CreateForm({
  initValue: { message: "" },
  clearFormOn: ["submit"],
});

export function InterviewSessionForm({ interviewId }: { interviewId: string }) {
  const [isLoading, setIsLoading] = useInterviewLoading();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    new InterviewClient().postInterviewMessage({
      interviewId,
      queryClient,
      setIsLoading,
    })
  );

  return (
    <SizeWrapper
      asChild="form"
      className="@container/main overflow-y-scroll py-10"
      onSubmit={handleSubmit((data) => mutate(data))}
    >
      <SicilianProvider value={{ register, name: "message" }}>
        <DefaultTextAreaWrapper>
          <TextArea placeholder="메시지를 입력하세요..." />
          <button disabled={isLoading}>전송</button>
        </DefaultTextAreaWrapper>
      </SicilianProvider>
    </SizeWrapper>
  );
}
