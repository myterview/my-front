import { CreateForm } from "@ilokesto/sicilian";

export enum FeedbackTypeKr {
  suggestion = "제안",
  complaint = "불만",
  praise = "칭찬",
  bug = "버그",
  other = "기타",
}

export const { register, getValues, handleServerAction } = new CreateForm<{
  type: "" | FeedbackTypeKr;
  message: string;
}>({
  initValue: {
    type: "",
    message: "",
  },
  clearFormOn: ["routeChange"],
});
