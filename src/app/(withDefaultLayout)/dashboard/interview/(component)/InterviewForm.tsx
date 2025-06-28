"use client";

import { startInterview } from "@/apis/interview.action";
import { Dropdown } from "@/components/Dropdown/Dropdown";
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
import useServerAction from "@/hooks/useServerAction";
import { InterviewDropdownButton } from "@/components/Dropdown/InterviewDropdownButton";
import { For } from "utilinent";

export function InterviewForm() {
  const [dispatch, isPending] = useServerAction(startInterview);
  const router = useRouter();

  const DROPDOWN_ARRAY = [
    {
      title: "직군" as const,
      sicilian: {
        name: "position",
        state: getStateByName("position"),
      },
      options: Object.values(InterviewPositionKr),
    },
    {
      title: "경력" as const,
      sicilian: {
        name: "experience",
        state: getStateByName("experience"),
      },
      options: Object.values(InterviewExperienceKr),
    },
  ];

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
          <DefaultInputWrapper title="인터뷰 제목">
            <Input />
          </DefaultInputWrapper>
        </SicilianProvider>

        <div className="flex w-full gap-16">
          <For each={DROPDOWN_ARRAY}>
            {(item) => (
              <Dropdown
                key={item.sicilian.name}
                options={item.options}
                {...item.sicilian.state}
              >
                {(anchor, helpers) => (
                  <InterviewDropdownButton
                    anchor={anchor}
                    helpers={helpers}
                    title={item.title}
                    selectedOption={getValues(item.sicilian.name) as string}
                  />
                )}
              </Dropdown>
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
