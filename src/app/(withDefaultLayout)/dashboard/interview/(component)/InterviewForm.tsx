"use client";

import { startInterview } from "@/apis/interview.action";
import { DefaultInputWrapper } from "@/components/Form/DefaultInputWrapper";
import { Input } from "@/components/Form/Input";
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
import Form from "@/components/Form/Form";
import { DropdownAnchor } from "@/components/Dropdown/InterviewDropdownButton";
import { DropdownFloater } from "@/components/Dropdown/DropdownMenu";
import { For } from "@ilokesto/utilinent";
import { useActionState, useEffect } from "react";
import { Popover } from "@/components/Popover/Popover";

export function InterviewForm() {
  const [state, execute, isPending] = useActionState(startInterview, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.sessionId) {
      router.push("/dashboard/interview/" + state.sessionId);
    }
  }, [state?.sessionId]);

  return (
    <Form
      action={handleServerAction(execute)}
      className="flex w-full flex-col gap-24"
    >
      <div className="flex max-w-480 flex-col gap-28">
        <SicilianProvider value={{ register, name: "title" }}>
          <DefaultInputWrapper title="인터뷰 제목">
            <Input />
          </DefaultInputWrapper>
        </SicilianProvider>

        <div className="flex w-full gap-16">
          <For each={DROPDOWN_ARRAY}>
            {(item) => (
              <Popover
                key={item.title[0]}
                position={{ crossAxis: 30 }}
                anchorElement={(anchor, helpers) => (
                  <DropdownAnchor
                    anchor={anchor}
                    helpers={helpers}
                    title={item.title[0]}
                    iconSrc={item.iconSrc}
                    {...getStateByName(item.title[1])}
                  />
                )}
                floaterElement={(floater, helpers) => (
                  <DropdownFloater
                    floater={floater}
                    helpers={helpers}
                    options={item.options}
                    {...getStateByName(item.title[1])}
                  />
                )}
              />
            )}
          </For>
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

function getStateByName(name: string) {
  const selectedOption = getValues(name) as string;

  const { onChange } = register({ name });

  const setSelectedOption = (option: string) => {
    onChange({
      target: {
        value: option,
        name,
      },
    });
  };

  return { selectedOption, setSelectedOption };
}

const DROPDOWN_ARRAY = [
  {
    title: ["직군", "position"] as const,
    iconSrc: "/icons/interviewLaptop.svg",
    options: Object.values(InterviewPositionKr),
  },
  {
    title: ["경력", "experience"] as const,
    iconSrc: "/icons/interviewLevel.svg",
    options: Object.values(InterviewExperienceKr),
  },
];
