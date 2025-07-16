import { DefaultInterviewEvaluation } from "./DefaultInterviewEvaluation";
import { components } from "@/types";

export interface TDefaultInterviewEvaluation {
  evaluationType: "default";
  evaluation: components["schemas"]["EvaluationDto"];
}

export type TUndefinedInterviewEvaluation = {
  evaluationType?: undefined;
  evaluation?: undefined;
};

export type TInterviewEvaluationWithoutUndefined = TDefaultInterviewEvaluation;

export type TInterviewEvaluation =
  | TInterviewEvaluationWithoutUndefined
  | TUndefinedInterviewEvaluation;

export interface IInterviewEvaluationFactory {
  instance: DefaultInterviewEvaluation | TUndefinedInterviewEvaluation;
  isDefaultEvaluation(): this is { instance: DefaultInterviewEvaluation };
}

export class InterviewEvaluationFactory implements IInterviewEvaluationFactory {
  public instance: DefaultInterviewEvaluation | TUndefinedInterviewEvaluation;

  constructor({ evaluationType, evaluation }: TInterviewEvaluation) {
    switch (evaluationType) {
      case "default":
        this.instance = new DefaultInterviewEvaluation({
          evaluation,
          evaluationType,
        });
        break;

      case undefined:
        this.instance = { evaluationType: undefined, evaluation: undefined };
        break;

      default:
        throw new Error("Invalid evaluation type");
    }
  }

  isDefaultEvaluation(): this is { instance: DefaultInterviewEvaluation } {
    return this.instance instanceof DefaultInterviewEvaluation;
  }
}
