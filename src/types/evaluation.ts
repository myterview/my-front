import { DefaultEvaluationProps } from "@/ui/components/Evaluation/DefaultEvaluation";

export type EvaluationProps =
  | DefaultEvaluationProps
  | {
      evaluation?: undefined;
      evaluationType?: undefined;
    };
