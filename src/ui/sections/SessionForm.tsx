"use client";

import { Dictaphone } from "../components/Dictaphone/Dictaphone";
import { FieldOutlineWrapper } from "../components/Form/FieldOutlineWrapper";
import { InterviewClient } from "@/api/interview.client";
import { useInterviewLoading } from "@/shared/caro-kann/useInterviewLoading";
import {
  getValues,
  handleSubmit,
  register,
  setValues,
} from "@/shared/sicilian/sessionForm";
import { useSpeechToText } from "@/shared/utils/useSpeechToText";
import { TextArea } from "@/ui/components/Form/TextArea";
import { SizeWrapper } from "@/ui/components/SizeWrapper/SizeWrapper";
import { SicilianProvider } from "@ilokesto/sicilian/provider";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import Image from "next/image";
import { useEffect } from "react";

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

  const {
    text,
    setText,
    textAreaRef,
    listening,
    toggleListening,
    handleTextChange,
    browserSupportsSpeechRecognition,
  } = useSpeechToText();

  useEffect(() => {
    if (text) {
      setValues({ message: text });
    }
  }, [text, setValues]);

  return (
    <SizeWrapper
      asChild="form"
      className="@container/main overflow-y-scroll py-10"
      onSubmit={handleSubmit((data) => mutate(data))}
    >
      <SicilianProvider value={{ register, name: "message", getValues }}>
        <FieldOutlineWrapper>
          <TextArea
            ref={textAreaRef}
            disabled={isLoading || !isActive || listening}
            placeholder="메시지를 입력하세요..."
            className="max-h-240"
          />
          <div className="flex items-center justify-between">
            <Dictaphone
              listening={listening}
              onClick={toggleListening}
              isBrowserSupported={browserSupportsSpeechRecognition}
            />
            <button>
              <Image
                src="/icons/submitArrow.svg"
                alt="Submit"
                draggable={false}
                width={24}
                height={24}
              />
            </button>
          </div>
        </FieldOutlineWrapper>
      </SicilianProvider>
    </SizeWrapper>
  );
}
