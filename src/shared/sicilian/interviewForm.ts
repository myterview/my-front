import { InterviewExperienceKr, InterviewPositionKr } from "@/shared/types";
import { CreateForm } from "@ilokesto/sicilian";

export const { register, getValues, getErrors, handleServerAction } = new CreateForm<{
  title: string;
  position: "" | InterviewPositionKr;
  experience: "" | InterviewExperienceKr;
}>({
  initValue: {
    title: "",
    position: "",
    experience: "",
  },
  validator: {
    title: {
      required: { required: true, message: "인터뷰 제목을 입력해주세요." },
    },
    position: {
      required: { required: false, message: "직군을 선택해주세요." },
    },
    experience: {
      required: { required: true, message: "경력을 선택해주세요." },
    },
  },
  validateOn: ["submit"],
  clearFormOn: ["routeChange"],
});
