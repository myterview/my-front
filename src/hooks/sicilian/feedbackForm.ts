import { CreateForm } from "@ilokesto/sicilian";

export enum FeedbackTypeKr {
  suggestion = "제안",
  complaint = "불만",
  praise = "칭찬",
  bug = "버그",
  other = "기타",
}

// export enum InterviewExperienceKr {
//   junior = "주니어",
//   mid = "미들급",
//   senior = "시니어",
//   expert = "테크 리더",
// }

export const { register, getValues, handleServerAction } = new CreateForm<{
  title: string;
  type: "" | FeedbackTypeKr;
  message: string;
}>({
  initValue: {
    title: "",
    type: "",
    message: "",
  },
  clearFormOn: ["routeChange"],
});
