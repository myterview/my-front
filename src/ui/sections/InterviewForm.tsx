"use client";

import { startInterview } from "@/api/interview.serverAction";
import {
  getErrors,
  getValues,
  handleServerAction,
  register
} from "@/shared/sicilian/interviewForm";
import { InterviewExperienceKr, InterviewPositionKr } from "@/shared/types";
import { Clickable } from "@/ui/components/Clickable/Clickable";
import { DefaultInputWrapper } from "@/ui/components/Form/DefaultInputWrapper";
import { Form } from "@/ui/components/Form/Form";
import { Input } from "@/ui/components/Form/Input";
import { DropdownInput } from "@/ui/components/Popover/Dropdown/DropdownAnchor";
import { DropdownMenu } from "@/ui/components/Popover/Dropdown/DropdownMenu";
import { Popover } from "@/ui/components/Popover/Popover";
import { SicilianProvider } from "@ilokesto/sicilian/provider";
import { For } from "@ilokesto/utilinent";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export function InterviewForm() {
  const [state, execute, isPending] = useActionState(startInterview, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.sessionId) {
      router.push("/dashboard/interview/" + state.sessionId);
    }
  }, [state?.sessionId, router]);

  const DROPDOWN_ARRAY = [
    {
      title: "직군" as const,
      iconSrc: "/icons/interviewLaptop.svg",
      options: Object.values(InterviewPositionKr),
      hooks: getStateByName("position"),
    },
    {
      title: "경력" as const,
      iconSrc: "/icons/interviewLevel.svg",
      options: Object.values(InterviewExperienceKr),
      hooks: getStateByName("experience"),
    },
  ];

  return (
    <Form
      action={handleServerAction(execute)}
      className="flex flex-col w-full gap-24"
    >
      <div className="flex flex-col max-w-480 gap-28">
        <SicilianProvider value={{ register, getErrors, name: "title" }}>
          <DefaultInputWrapper title="인터뷰 제목">
            <Input />
          </DefaultInputWrapper>
        </SicilianProvider>

        <div className="flex w-full gap-16">
          <For each={DROPDOWN_ARRAY}>
            {(item) => (
              <Popover
                key={item.title}
                position={{ mainAxis: 0, crossAxis: 30, placement: "bottom-start" }}
                anchorElement={(anchorElementProps) => (
                  <SicilianProvider value={{ register, getErrors, name: item.title === "직군" ? "position" : "experience" }}>
                    <DropdownInput
                      {...anchorElementProps}
                      title={item.title}
                      iconSrc={item.iconSrc}
                    />
                  </SicilianProvider>
                )}
                floaterElement={(floaterElementProps) => (
                  <DropdownMenu
                    {...floaterElementProps}
                    {...item.hooks}
                    options={item.options}
                    className="min-w-132"
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
