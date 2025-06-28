"use client";

import { startInterview } from "@/apis/interview.action";
import { Dropdown } from "@/components/Dropdown/Dropdown";
import { DefaultInputWrapper } from "@/components/Form/DefaultInputWrapper";
import Form from "@/components/Form/Form";
import { Input } from "@/components/Form/Input";
import useServerAction from "@/hooks/useServerAction";
import { SicilianProvider } from "@ilokesto/sicilian/provider";
import { useRouter } from "next/navigation";

import { Clickable } from "@/components/Clickable/Clickable";
import {
  handleServerAction,
  register,
  getValues,
  InterviewPositionKr,
  InterviewExperienceKr,
} from "@/hooks/sicilian/interviewForm";

export function InterviewForm() {
  const [dispatch, isPending] = useServerAction(startInterview);
  const router = useRouter();

  return (
    <Form
      action={handleServerAction(async (data) => {
        const result = await dispatch(data);
        router.push("/dashboard/interview/" + result?.sessionId);
      })}
      className="flex w-full flex-col gap-24"
    >
      <div className="flex max-w-480 flex-col gap-28">
        <SicilianProvider value={{ register, name: "title" }}>
          <DefaultInputWrapper title="기본 입력">
            <Input />
          </DefaultInputWrapper>
        </SicilianProvider>

        <div className="flex w-full gap-16">
          <SicilianProvider value={{ register, name: "position", getValues }}>
            <Dropdown
              options={Object.values(InterviewPositionKr)}
              title="직군"
            />
          </SicilianProvider>

          <SicilianProvider value={{ register, name: "experience", getValues }}>
            <Dropdown
              options={Object.values(InterviewExperienceKr)}
              title="경력"
            />
          </SicilianProvider>
        </div>
      </div>

      <Clickable types="default" className="self-end">
        <button type="submit" disabled={isPending}>
          인터뷰 시작
        </button>
      </Clickable>
    </Form>
  );
}
