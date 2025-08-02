import { Clickable } from "../Clickable/Clickable";
import { Form } from "../Form/Form";
import { TextArea } from "../Form/TextArea";
import { DropdownInput } from "../Popover/Dropdown/DropdownInput";
import { DropdownOption } from "../Popover/Dropdown/DropdownOption";
import { Popover } from "../Popover/Popover";
import { postFeedback } from "@/api/feedback.serverAction";
import {
  getErrors,
  getValues,
  handleServerAction,
  register,
} from "@/shared/sicilian/feedbackForm";
import { FeedbackTypeKr } from "@/shared/types";
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
        position={{ mainAxis: 0, crossAxis: 30, placement: "bottom-start" }}
        anchorElement={(anchorElementProps) => (
          <SicilianProvider value={{ register, getErrors, name: "type" }}>
            <DropdownInput
              {...anchorElementProps}
              title="카테고리"
              iconSrc="/icons/feedback.svg"
            />
          </SicilianProvider>
        )}
        floaterElement={(floaterElementProps) => (
          <DropdownOption
            {...floaterElementProps}
            options={Object.values(FeedbackTypeKr)}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            className="min-w-132"
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
