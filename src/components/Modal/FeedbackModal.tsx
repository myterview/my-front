import { Clickable } from "../Clickable/Clickable";
import { Form } from "../Form/Form";
import { TextArea } from "../Form/TextArea";
import { DropdownAnchor } from "../Popover/Dropdown/DropdownAnchor";
import { DropdownMenu } from "../Popover/Dropdown/DropdownMenu";
import { Popover } from "../Popover/Popover";
import { postFeedback } from "@/apis/feedback.server";
import {
  getValues,
  handleServerAction,
  register,
} from "@/hooks/sicilian/feedbackForm";
import { FeedbackTypeKr } from "@/types";
import { grunfeld } from "@ilokesto/grunfeld";
import { SicilianProvider } from "@ilokesto/sicilian/provider";
import { useActionState, useEffect } from "react";
import { toast } from "react-hot-toast";

export function FeedbackModal() {
  const [state, execute, isPending] = useActionState(postFeedback, undefined);

  useEffect(() => {
    if (state?.message) {
      grunfeld.clear();
      toast.success("피드백이 제출되었습니다.");
    }
  }, [state?.message]);

  const { selectedOption, setSelectedOption } = getStateByName("type");

  return (
    <Form
      action={handleServerAction(execute)}
      className="flex flex-col w-full gap-24 overflow-y-scroll md:min-w-400"
    >
      <Popover
        key="카테고리"
        position={{ crossAxis: 30 }}
        anchorElement={(anchor, helpers) => (
          <DropdownAnchor
            anchor={anchor}
            helpers={helpers}
            title="카테고리"
            iconSrc="/icons/feedback.svg"
            selectedOption={selectedOption}
          />
        )}
        floaterElement={(floater, helpers) => (
          <DropdownMenu
            floater={floater}
            helpers={helpers}
            options={Object.values(FeedbackTypeKr)}
            className="min-w-132"
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        )}
      />

      <SicilianProvider value={{ register, name: "message", getValues }}>
        <div className="flex flex-col w-full gap-16">
          <div className="label">본문</div>
          <label
            htmlFor={"message"}
            className="focus-within:border-primary-600 flex items-end justify-between gap-12 rounded-[4] bg-gray-100 px-24 py-18"
          >
            <TextArea rows={10} />
          </label>
        </div>
      </SicilianProvider>

      <Clickable types="default" className="self-end">
        <button type="submit" disabled={isPending}>
          {isPending ? "제출 중..." : "피드백 제출"}
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
