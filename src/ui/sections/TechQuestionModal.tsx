"use client";

import { Card } from "../components/CardComponent/Card";
import { Tags } from "../components/Chips/Tags";
import { FieldOutlineWrapper } from "../components/Form/FieldOutlineWrapper";
import { Form } from "../components/Form/Form";
import { TextArea } from "../components/Form/TextArea";
import { MDViewer } from "../components/Markdown/MDViewer";
import { ModalWrapper } from "../components/Modal/ModalWrapper";
import { TechQuestionClient } from "@/api/tech-question.client";
import { DateTimeDomain } from "@/shared/domains/DateTime";
import { TechAnswer, TechAnswerDomain } from "@/shared/domains/TechAnswer";
import { TechQuestionDomain } from "@/shared/domains/TechQuestion";
import { grunfeld } from "@ilokesto/grunfeld";
import { CreateForm } from "@ilokesto/sicilian";
import { SicilianProvider } from "@ilokesto/sicilian/provider";
import { For, Show } from "@ilokesto/utilinent";
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { neato } from "neato";
import Image from "next/image";
import { useEffect, useState } from "react";

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
    <ModalWrapper className="md:w-770 h-dvh md:max-h-[80dvh] ">
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
  clearFormOn: ["submit", "routeChange"],
});

TechQuestionModal.Form = function TechQuestionModalForm({
  tags,
  question,
  code,
  mutate,
}: Pick<TechQuestionDomain, "tags" | "question" | "code"> & {
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
          <Card.Title className="line-clamp-none">{question}</Card.Title>

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

      <div>
        <Show when={code}>{(code) => <MDViewer>{code}</MDViewer>}</Show>
      </div>

      <Form
        onSubmit={handleSubmit((data) => mutate(data))}
        className="flex flex-1"
      >
        <SicilianProvider value={{ register, name: "userAnswer", getValues }}>
          <FieldOutlineWrapper>
            <TextArea autoResize={false} placeholder="메시지를 입력하세요..." />
            <button>
              <Image
                src="/icons/submitArrow.svg"
                alt="Submit"
                draggable={false}
                width={24}
                height={24}
              />
            </button>
          </FieldOutlineWrapper>
        </SicilianProvider>
      </Form>
    </div>
  );
};

TechQuestionModal.Submitting = function TechQuestionModalSubmitting() {
  const [dot, setDot] = useState("");
  useEffect(() => {
    const id = setInterval(() => {
      setDot((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full heading-02 gap-28">
      <Image
        src="/images/mrCatLoading.svg"
        alt="loading"
        width={210}
        height={210}
      />
      채점중{dot}
    </div>
  );
};

TechQuestionModal.Result = function TechQuestionModalResult({
  id: questionId,
  question,
  solution,
  code,
  tags,
}: Pick<TechQuestionDomain, "id" | "question" | "tags" | "code" | "solution">) {
  const { data } = useSuspenseQuery(
    new TechQuestionClient().getTechAnswerList({
      questionId,
    })
  );
  const answerList = data.map((item) => new TechAnswer(item));
  const [answer, setAnswer] = useState(answerList.at(-1));

  const handleClick = async () => {
    const date = await grunfeld.add<DateTimeDomain>((removeWith) => ({
      element: (
        <TechQuestionModal.DateSelector
          selectedAnswer={answer!}
          answerList={answerList}
          removeWith={removeWith}
        />
      ),
    }));
    setAnswer((prev) =>
      answerList.find((item) => item.createdAt.isEqual(date ?? prev?.createdAt))
    );
  };

  if (!answer) return null;

  const contentList = [
    {
      src: "/icons/userAnswer.svg",
      text: "내 답변",
      content: answer.userAnswer,
    },
    { src: "/icons/solution.svg", text: "모범 답안", content: solution },
    {
      src: "/icons/mrCatLLMAnswer.svg",
      text: "냥부장의 평가",
      content: answer.llmAnswer,
    },
  ];

  return (
    <div className="flex flex-col h-full gap-28 overflow-y-auto px-1 pb-1">
      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between gap-24">
          <Card.Title className="line-clamp-none">{question}</Card.Title>

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

        <div className={neato("flex items-center justify-between")}>
          <button
            type="button"
            className="flex hover:text-primary-500 hover:filter-primary-500 gap-8"
            onClick={handleClick}
          >
            <Image
              src="/icons/calendar.svg"
              alt="refresh"
              draggable="false"
              width={24}
              height={24}
            />
            {answer.createdAt.format("YYYY.MM.DD")}
          </button>

          <Tags each={tags} className="justify-end" />
        </div>
      </div>

      <div>
        <Show when={code}>{(code) => <MDViewer>{code}</MDViewer>}</Show>
      </div>

      <For each={contentList}>
        {(item) => (
          <div key={item.text} className="space-y-12">
            <div className="flex items-center gap-16">
              <Image src={item.src} alt={item.text} width={24} height={24} />
              <span className="text-xl/30 font-bold">{item.text}</span>
            </div>
            <MDViewer className="px-16 py-18 rounded-[4px] shadow-custom text-base/28">
              {item.content}
            </MDViewer>
          </div>
        )}
      </For>
    </div>
  );
};

TechQuestionModal.DateSelector = function TechQuestionModalDateSelector({
  answerList,
  removeWith,
  selectedAnswer,
}: {
  selectedAnswer: TechAnswerDomain;
  answerList: TechAnswerDomain[];
  removeWith: (data: DateTimeDomain) => void;
}) {
  return (
    <ModalWrapper className="flex flex-col gap-24 w-360">
      <ModalWrapper.Title title="이전 답변" />

      <div className="flex flex-col gap-8 items-start">
        <For each={answerList}>
          {(item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                removeWith(item.createdAt);
              }}
              className={neato(
                "cursor-pointer px-4 py-2 w-full font-semibold text-gray-600 text-left hover:bg-primary-100",
                selectedAnswer.createdAt.isEqual(item.createdAt) &&
                  "text-primary-600"
              )}
            >
              {item.createdAt.format("YYYY년 MM월 DD일 HH시 mm분")}
            </button>
          )}
        </For>
      </div>
    </ModalWrapper>
  );
};
