"use client";

import { ModalWrapper } from "../components/Modal/ModalWrapper";
import { useState } from "react";

type TechQuestionModalStep = "form" | "submitting" | "result";
export function TechQuestionModal({
  isUserAnswered,
}: {
  isUserAnswered: boolean;
}) {
  const [step, setStep] = useState<TechQuestionModalStep>(
    isUserAnswered ? "result" : "form"
  );
  return (
    <ModalWrapper className="md:w-770 h-dvh md:max-h-[80dvh]">
      {step === "form" && <TechQuestionModal.Form />}
      {step === "submitting" && <TechQuestionModal.Submitting />}
      {step === "result" && <></>}
    </ModalWrapper>
  );
}

TechQuestionModal.Form = function TechQuestionModalForm() {
  return <></>;
};

TechQuestionModal.Submitting = function TechQuestionModalSubmitting() {
  return <></>;
};

TechQuestionModal.Result = function TechQuestionModalResult() {
  return <></>;
};
