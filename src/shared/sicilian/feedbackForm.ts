import { FeedbackTypeKr } from "@/shared/types";
import { CreateForm } from "@ilokesto/sicilian";

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
