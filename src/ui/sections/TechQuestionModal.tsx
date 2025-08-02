"use client";

import { Card } from "../components/CardComponent/Card";
import { Tags } from "../components/Chips/Tags";
import FieldOutlineWithButtonWrapper from "../components/Form/FieldOutlineWithButtonWrapper";
import { Form } from "../components/Form/Form";
import { TextArea } from "../components/Form/TextArea";
import { ModalWrapper } from "../components/Modal/ModalWrapper";
import { TechQuestionClient } from "@/api/tech-question.client";
import { DateTimeDomain } from "@/shared/domains/DateTime";
import { TechAnswer, TechAnswerDomain } from "@/shared/domains/TechAnswer";
import { TechQuestionDomain } from "@/shared/domains/TechQuestion";
import { grunfeld } from "@ilokesto/grunfeld";
import { CreateForm } from "@ilokesto/sicilian";
import { SicilianProvider } from "@ilokesto/sicilian/provider";
import { For } from "@ilokesto/utilinent";
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { neato } from "neato";
import Image from "next/image";
import { useState } from "react";

export type TechQuestionModalStep = "form" | "submitting" | "result";

export function TechQuestionModal(props: TechQuestionDomain) {
  const [step, setStep] = useState<TechQuestionModalStep>(
    props.isUserAnswered ? "result" : "form"
  );
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    new TechQuestionClient().postTechAnswer({
      questionId: props.id,
      queryClient,
      setStep,
    })
  );

  return (
    <ModalWrapper className="md:w-770 h-dvh md:max-h-[80dvh]">
      {step === "form" && <TechQuestionModal.Form {...props} mutate={mutate} />}
      {step === "submitting" && <TechQuestionModal.Submitting />}
      {step === "result" && <TechQuestionModal.Result {...props} />}
    </ModalWrapper>
  );
}

const { register, getValues, handleSubmit } = new CreateForm({
  initValue: {
    userAnswer: "",
  },
});

TechQuestionModal.Form = function TechQuestionModalForm({
  tags,
  question,
  mutate,
}: Pick<TechQuestionDomain, "tags" | "question"> & {
  mutate: UseMutateFunction<
    never,
    Error,
    {
      userAnswer: string;
    },
    void
  >;
}) {
  return (
    <div className="flex flex-col h-full gap-28">
      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between gap-24">
          <Card.Title>{question}</Card.Title>

          <button type="button" onClick={grunfeld.clear}>
            <Image
              src="/icons/close.svg"
              alt="close"
              draggable="false"
              width={24}
              height={24}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <Tags each={tags} className="justify-end" />
        </div>
      </div>

      <div></div>

      <Form
        onSubmit={handleSubmit((data) => mutate(data))}
        className="flex flex-1"
      >
        <SicilianProvider value={{ register, name: "userAnswer", getValues }}>
          <FieldOutlineWithButtonWrapper>
            <TextArea autoResize={false} placeholder="메시지를 입력하세요..." />
          </FieldOutlineWithButtonWrapper>
        </SicilianProvider>
      </Form>
    </div>
  );
};

TechQuestionModal.Submitting = function TechQuestionModalSubmitting() {
  return <>로딩중</>;
};

TechQuestionModal.Result = function TechQuestionModalResult({
  id: questionId,
  question,
  tags,
}: Pick<TechQuestionDomain, "id" | "question" | "tags">) {
  const { data } = useSuspenseQuery(
    new TechQuestionClient().getTechAnswerList({
      questionId,
    })
  );
  const answerList = data.map((item) => new TechAnswer(item));

  const [answer, setAnswer] = useState(answerList.at(-1));

  return (
    <div className="flex flex-col h-full gap-28">
      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between gap-24">
          <Card.Title>{question}</Card.Title>

          <button type="button" onClick={grunfeld.clear}>
            <Image
              src="/icons/close.svg"
              alt="close"
              draggable="false"
              width={24}
              height={24}
            />
          </button>
        </div>

        <div className={neato("flex items-center justify-between", "")}>
          <button
            type="button"
            className="flex hover:text-primary-500 hover:primary-500-filter"
            onClick={async () => {
              const a = await grunfeld.add<DateTimeDomain>((removeWith) => ({
                element: (
                  <TechQuestionModal.DateSelector
                    answerList={answerList}
                    removeWith={removeWith}
                  />
                ),
              }));

              console.log("a", a);
            }}
          >
            <Image
              src="/icons/submitArrow.svg"
              alt="refresh"
              draggable="false"
              width={24}
              height={24}
            />
            {answer?.createdAt.format("YYYY.MM.DD")}
          </button>
          <Tags each={tags} className="justify-end" />
        </div>
      </div>
    </div>
  );
};

TechQuestionModal.DateSelector = function TechQuestionModalDateSelector({
  answerList,
  removeWith,
}: {
  answerList: TechAnswerDomain[];
  removeWith: (data: DateTimeDomain) => void;
}) {
  return (
    <ModalWrapper>
      <ModalWrapper.Title title="이전 답변" />

      <For each={answerList}>
        {(item) => (
          <button
            onClick={() => {
              removeWith(item.createdAt);
            }}
            type="button"
            key={item.id}
          >
            {item.createdAt.format("YYYY년 MM월 DD일")}
          </button>
        )}
      </For>
    </ModalWrapper>
  );
};
