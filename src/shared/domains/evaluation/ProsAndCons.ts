import { gradeScore } from "@/shared/utils/gradeScore";
import { filter, map, pipe, reduce } from "@fxts/core";

export class ProsAndCons {
  public static extract(evaluation: { [x: string]: { score: number } }) {
    return pipe(
      evaluation,
      Object.entries,
      filter(([key]) => key !== "overallAssessment"),
      map(([key, value]) => ({ keyName: key, score: value.score })),
      (arr) => ({
        pros: this.getPros(arr),
        cons: this.getCons(arr),
      })
    );
  }

  private static getPros(
    arr: IterableIterator<{
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
        ),
      (item) => ({
        ...item,
        grade: gradeScore({ score: item?.score, type: "pros" }),
      })
    );
  }

  private static getCons(
    arr: IterableIterator<{
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
        ),
      (item) => ({
        ...item,
        grade: gradeScore({ score: item?.score, type: "cons" }),
      })
    );
  }
}
