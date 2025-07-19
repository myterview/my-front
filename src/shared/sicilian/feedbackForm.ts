import { FeedbackTypeKr } from "@/shared/types";
import { CreateForm } from "@ilokesto/sicilian";

export const { register, getValues, getErrors, handleServerAction } = new CreateForm<{
  type: "" | FeedbackTypeKr;
  message: string;
}>({
  initValue: {
    type: "",
    message: "",
  },
  validator: {
    type: {
      required: {
        required: true,
        message: "카테고리를 선택해주세요.",
      }
    },
    message: {
      required: {
        required: true,
        message: "피드백 내용을 입력해주세요.",
      },
    }
  },
  validateOn: ["submit"],
  clearFormOn: ["routeChange"],
});
