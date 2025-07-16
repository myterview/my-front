import { InterviewEvaluation } from "./InterviewEvaluation";
import { TDefaultInterviewEvaluation } from "./InterviewEvaluationFactory";

export class DefaultInterviewEvaluation extends InterviewEvaluation<TDefaultInterviewEvaluation> {
  constructor({ evaluation, evaluationType }: TDefaultInterviewEvaluation) {
    super({ evaluation, evaluationType });
  }
}
