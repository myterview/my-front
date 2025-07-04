import { Donate } from "../Donate/Donate";
import {
  DefaultEvaluation,
  DefaultEvaluationOverall,
  DefaultEvaluationProps,
  DefaultEvaluationRadar,
} from "../Evaluation/DefaultEvaluation";
import { EvaluationHeader } from "../Evaluation/EvaluationHeader";
import {
  InterviewExperienceKr,
  InterviewPositionKr,
} from "@/hooks/sicilian/interviewForm";
import { components } from "@/types/api";
import { getEnumValueByKey } from "@/utils/enumUtils";
import { grunfeld } from "grunfeld";

type EvaluationProps =
  | DefaultEvaluationProps
  | {
      evaluation?: undefined;
      evaluationType?: undefined;
    };

export function InterviewEvaluationModal({
  evaluation,
  evaluationType,
  createdAt,
  position,
  experience,
  title,
}: components["schemas"]["InterviewSession"]) {
  const { evaluation: e, evaluationType: eT } = {
    evaluation,
    evaluationType,
  } as EvaluationProps;

  if (!eT) return;

  if (eT === "default") {
    return (
      <div className="flex flex-col gap-60">
        <EvaluationHeader
          onClose={() => grunfeld.clear()}
          title={title}
          createdAt={createdAt}
          tags={[
            getEnumValueByKey(InterviewPositionKr, position),
            getEnumValueByKey(InterviewExperienceKr, experience),
          ]}
        />

        <Donate />

        <DefaultEvaluationOverall evaluation={e} />

        <DefaultEvaluationRadar evaluation={e} />

        <DefaultEvaluation evaluation={e} />
      </div>
    );
  }
}
