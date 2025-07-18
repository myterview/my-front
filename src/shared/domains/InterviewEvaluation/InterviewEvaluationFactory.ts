import { DefaultInterviewEvaluation } from "./DefaultInterviewEvaluation";
import { BackendResponse } from "@/shared/types";

export interface TDefaultInterviewEvaluation {
  evaluationType: "default";
  evaluation: BackendResponse["evaluation"]["default"];
}

export type TInterviewEvaluation = TDefaultInterviewEvaluation;

export interface IInterviewEvaluationFactory {
  instance: DefaultInterviewEvaluation;
  isDefaultEvaluation(): this is { instance: DefaultInterviewEvaluation };
}

export class InterviewEvaluationFactory implements IInterviewEvaluationFactory {
  public instance: DefaultInterviewEvaluation;

  constructor({ evaluationType, evaluation }: TInterviewEvaluation) {
    switch (evaluationType) {
      case "default":
        this.instance = new DefaultInterviewEvaluation({
          evaluation,
          evaluationType,
        });
        break;

      default:
        throw new Error("Invalid evaluation type");
    }
  }

  isDefaultEvaluation(): this is { instance: DefaultInterviewEvaluation } {
    return this.instance instanceof DefaultInterviewEvaluation;
  }
}
