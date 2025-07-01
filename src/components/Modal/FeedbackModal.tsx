import { SicilianProvider } from "@ilokesto/sicilian/provider";
import { For } from "@ilokesto/utilinent";
import { Clickable } from "../Clickable/Clickable";
import { DefaultInputWrapper } from "../Form/DefaultInputWrapper";
import { Form } from "../Form/Form";
import { Input } from "../Form/Input";
import { DropdownAnchor } from "../Popover/Dropdown/DropdownAnchor";
import { DropdownMenu } from "../Popover/Dropdown/DropdownMenu";
import { Popover } from "../Popover/Popover";
import { useActionState, useEffect } from "react";
import {
  FeedbackTypeKr,
  getValues,
  register,
  handleServerAction,
} from "@/hooks/sicilian/feedbackForm";
import { postFeedback } from "@/apis/feedback.action";

export function FeedbackModal({}) {
  const [state, execute, isPending] = useActionState(postFeedback, undefined);

  useEffect(() => {
    if (state?.message) {
      console.log("a");
    }
  }, [state?.message]);

  const DROPDOWN_ARRAY = [
    {
      title: "카테고리" as const,
      iconSrc: "/icons/interviewLaptop.svg",
      options: Object.values(FeedbackTypeKr),
      hooks: getStateByName("type"),
    },
  ];

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
