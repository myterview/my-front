import { TInterviewEvaluation } from "./InterviewEvaluationFactory";
import { filter, map, pipe, reduce, toArray } from "@fxts/core";

type ProsAndCons = {
  pros: { keyName: string; score: number } | undefined;
  cons: { keyName: string; score: number } | undefined;
};

export interface InterviewEvaluationDomain<T extends TInterviewEvaluation> {
  evaluation: T["evaluation"];
  evaluationType: T["evaluationType"];
  getProsAndCons(): ProsAndCons;
}

export abstract class InterviewEvaluation<T extends TInterviewEvaluation>
  implements InterviewEvaluationDomain<T>
{
  public evaluation: T["evaluation"];
  public evaluationType: T["evaluationType"];

  constructor({ evaluation, evaluationType }: T) {
    this.evaluation = evaluation;
    this.evaluationType = evaluationType;
  }

  public getProsAndCons() {
    return pipe(
      this.evaluation,
      Object.entries,
      filter(([key]) => key !== "overallAssessment"),
      map(([key, value]) => ({ keyName: key, score: value.score })),
      toArray,
      (arr) => ({
        pros: this.getPros([...arr]),
        cons: this.getCons([...arr]),
      })
    ) as ProsAndCons;
  }

  private getPros(
    arr: Array<{
      keyName: string;
      score: number;
    }>
  ) {
    return pipe(
      arr,
      filter((item) => item.score >= 80),
      (arr) =>
        reduce(
          (acc, item) => (!acc || item.score > acc.score ? item : acc),
          undefined as { keyName: string; score: number } | undefined,
          arr
        )
    );
  }

  private getCons(
    arr: Array<{
      keyName: string;
      score: number;
    }>
  ) {
    return pipe(
      arr,
      filter((item) => item.score < 80),
      (arr) =>
        reduce(
          (acc, item) => (!acc || item.score < acc.score ? item : acc),
          undefined as { keyName: string; score: number } | undefined,
          arr
        )
    );
  }
}
