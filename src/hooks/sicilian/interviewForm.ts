import { CreateForm } from "@ilokesto/sicilian";

export enum InterviewPositionKr {
  frontend = "프론트엔드",
  backend = "백엔드",
  fullstack = "풀스택",
  infra = "인프라",
}

export enum InterviewExperienceKr {
  junior = "주니어",
  mid = "미들급",
  senior = "시니어",
  expert = "테크 리더",
}

export const { register, getValues, handleServerAction } = new CreateForm<{
  title: string;
  position: InterviewPositionKr | "";
  experience: InterviewExperienceKr | "";
}>({
  initValue: {
    title: "",
    position: "",
    experience: "",
  },
});
