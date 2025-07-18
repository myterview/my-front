import { InterviewExperienceKr, InterviewPositionKr } from "@/shared/types";
import { CreateForm } from "@ilokesto/sicilian";

export const { register, getValues, handleServerAction } = new CreateForm<{
  title: string;
  position: "" | InterviewPositionKr;
  experience: "" | InterviewExperienceKr;
}>({
  initValue: {
    title: "",
    position: "",
    experience: "",
  },
  clearFormOn: ["routeChange"],
});
