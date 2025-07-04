import { Card } from "../Binder/Card";
import { Donate } from "../Donate/Donate";
import {
  DefaultEvaluation,
  DefaultEvaluationOverall,
  DefaultEvaluationProps,
  DefaultEvaluationRadar,
} from "../Evaluation/DefaultEvaluation";
import {
  InterviewExperienceKr,
  InterviewPositionKr,
} from "@/hooks/sicilian/interviewForm";
import { components } from "@/types/api";
import { getEnumValueByKey } from "@/utils/enumUtils";
import { toKST } from "@/utils/toKST";

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
}: components["schemas"]["InterviewSession"]) {
  const { evaluation: e, evaluationType: eT } = {
    evaluation,
    evaluationType,
  } as EvaluationProps;

  if (!eT) {
    return;
  }

  if (eT === "default") {
    return (
      <div className="flex flex-col gap-60">
        <div className="flex items-center justify-between">
          <Card.subTitle>{toKST(createdAt)}</Card.subTitle>
          <Card.Tags
            each={[
              getEnumValueByKey(InterviewPositionKr, position),
              getEnumValueByKey(InterviewExperienceKr, experience),
            ]}
          />
        </div>

        <Donate />

        <DefaultEvaluationOverall evaluation={e} />

        <DefaultEvaluationRadar evaluation={e} />

        <DefaultEvaluation evaluation={e} />
      </div>
    );
  }
}
