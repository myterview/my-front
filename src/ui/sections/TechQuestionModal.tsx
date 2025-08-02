"use client";

import { Card } from "../components/CardComponent/Card";
import { Tags } from "../components/Chips/Tags";
import FieldOutlineWithButtonWrapper from "../components/Form/FieldOutlineWithButtonWrapper";
import { TextArea } from "../components/Form/TextArea";
import { ModalWrapper } from "../components/Modal/ModalWrapper";
import { TechQuestionDomain } from "@/shared/domains/TechQuestion";
import { grunfeld } from "@ilokesto/grunfeld";
import { CreateForm } from "@ilokesto/sicilian";
import { SicilianProvider } from "@ilokesto/sicilian/provider";
import Image from "next/image";
import { useState } from "react";

type TechQuestionModalStep = "form" | "submitting" | "result";

export function TechQuestionModal(props: TechQuestionDomain) {
  const [step, setStep] = useState<TechQuestionModalStep>(
    props.isUserAnswered ? "result" : "form"
  );

  return (
    <ModalWrapper className="md:w-770 h-dvh md:max-h-[80dvh]">
      {step === "form" && <TechQuestionModal.Form {...props} />}
      {step === "submitting" && <TechQuestionModal.Submitting />}
      {step === "result" && <TechQuestionModal.Result />}
    </ModalWrapper>
  );
}

const { register, getValues } = new CreateForm({
  initValue: {
    answer: "",
  },
});

TechQuestionModal.Form = function TechQuestionModalForm({
  tags,
  question,
}: TechQuestionDomain) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-16">
        <div className="flex items-start justify-between gap-24">
          <Card.Title>{question}</Card.Title>

          <button type="button" onClick={() => grunfeld.clear()}>
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

      <SicilianProvider value={{ register, name: "answer", getValues }}>
        <FieldOutlineWithButtonWrapper>
          <TextArea
            // disabled={isLoading || !isActive}
            autoResize={false}
            placeholder="메시지를 입력하세요..."
          />
        </FieldOutlineWithButtonWrapper>
      </SicilianProvider>
    </div>
  );
};

TechQuestionModal.Submitting = function TechQuestionModalSubmitting() {
  return <></>;
};

TechQuestionModal.Result = function TechQuestionModalResult() {
  return <></>;
};
