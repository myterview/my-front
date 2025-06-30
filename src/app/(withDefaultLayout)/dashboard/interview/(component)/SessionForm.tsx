"use client";

import { InterviewClient } from "@/apis/interview.client";
import { DefaultTextAreaWrapper } from "@/components/Form/DefaultTextAreaWrapper";
import { TextArea } from "@/components/Form/TextArea";
import SizeWrapper from "@/components/SizeWrapper/SizeWrapper";
import { useInterviewLoading } from "@/hooks/caro-kann/useInterviewLoading";
import { CreateForm } from "@ilokesto/sicilian";
import { SicilianProvider } from "@ilokesto/sicilian/provider";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import Image from "next/image";

const { register, handleSubmit, getValues } = new CreateForm({
  initValue: { message: "" },
  clearFormOn: ["submit"],
});

export function SessionForm({ interviewId }: { interviewId: string }) {
  const [isLoading, setIsLoading] = useInterviewLoading();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    new InterviewClient().postInterviewMessage({
      interviewId,
      queryClient,
      setIsLoading,
    })
  );
  const {
    data: {
      session: { isActive },
    },
  } = useSuspenseQuery(new InterviewClient().getInterviewById(interviewId));

  return (
    <SizeWrapper
      asChild="form"
      className="@container/main overflow-y-scroll py-10"
      onSubmit={handleSubmit((data) => mutate(data))}
    >
      <SicilianProvider value={{ register, name: "message", getValues }}>
        <DefaultTextAreaWrapper>
          <TextArea
            disabled={isLoading || !isActive}
            placeholder="메시지를 입력하세요..."
          />
          <button disabled={isLoading || !isActive}>
            <Image
              src="/icons/submitArrow.svg"
              alt="Submit"
              draggable={false}
              width={24}
              height={24}
            />
          </button>
        </DefaultTextAreaWrapper>
      </SicilianProvider>
    </SizeWrapper>
  );
}
