import { DefaultEvaluationProps } from "@/components/Evaluation/DefaultEvaluation";

export type EvaluationProps =
  | DefaultEvaluationProps
  | {
      evaluation?: undefined;
      evaluationType?: undefined;
    };
