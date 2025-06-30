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
  InterviewPositionKr,
  InterviewExperienceKr,
} from "@/hooks/sicilian/interviewForm";
import { Form } from "@/components/Form/Form";
import { DropdownAnchor } from "@/components/Popover/Dropdown/DropdownAnchor";
import { DropdownMenu } from "@/components/Popover/Dropdown/DropdownMenu";
import { For } from "@ilokesto/utilinent";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useState,
} from "react";
import { Popover } from "@/components/Popover/Popover";

export function InterviewForm() {
  const [state, execute, isPending] = useActionState(startInterview, undefined);
  const [position, setPosition] = useState<InterviewPositionKr | "">("");
  const [experience, setExperience] = useState<InterviewExperienceKr | "">("");
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
      hooks: {
        selectedOption: position as string,
        setSelectedOption: setPosition as Dispatch<SetStateAction<string>>,
      },
    },
    {
      title: "경력" as const,
      iconSrc: "/icons/interviewLevel.svg",
      options: Object.values(InterviewExperienceKr),
      hooks: {
        selectedOption: experience as string,
        setSelectedOption: setExperience as Dispatch<SetStateAction<string>>,
      },
    },
  ];

  return (
    <Form
      action={handleServerAction((data) =>
        execute({ ...data, position, experience })
      )}
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
                key={item.title}
                position={{ crossAxis: 30 }}
                anchorElement={(anchor, helpers) => (
                  <DropdownAnchor
                    anchor={anchor}
                    helpers={helpers}
                    title={item.title}
                    iconSrc={item.iconSrc}
                    {...item.hooks}
                  />
                )}
                floaterElement={(floater, helpers) => (
                  <DropdownMenu
                    floater={floater}
                    helpers={helpers}
                    options={item.options}
                    className="min-w-132"
                    {...item.hooks}
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
