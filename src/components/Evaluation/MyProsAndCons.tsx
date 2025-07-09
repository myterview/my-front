import { EvaluationScore } from "./DefaultEvaluation";
import { gradeScore } from "@/business/gradeScore";
import { EvaluationKeysKr } from "@/types";
import { getEnumValueByKey } from "@/utils/enumUtils";
import { filter, map, pipe, reduce } from "@fxts/core";
import { neato } from "neato";
import Image from "next/image";

export function MyProsAndCons({
  evaluation,
}: {
  evaluation: { [x: string]: { score: number } };
}) {
  const { pros, cons } = new ProsAndCons(evaluation);

  return (
    <div className="@container/pac bg-primary-100 w-full">
      <div
        className={neato(
          "@5xl/pac:flex @5xl/pac:py-48 @5xl/pac:flex-row @5xl/pac:justify-center @5xl/pac:items-center",
          "py-24 space-y-12"
        )}
      >
        <div
          className={neato(
            "flex flex-col items-center justify-center space-y-12",
            "@5xl/pac:flex-row @5xl/pac:justify-center @5xl/pac:gap-0"
          )}
        >
          <div className="rounded-full relative shadow-custom w-80 h-80 overflow-hidden bg-white">
            <Image
              className="object-cover"
              src="/images/mrCatToSayHi.svg"
              alt="Pros and Cons"
              fill
              draggable={false}
            />
          </div>

          <div className="heading-03 text-white px-12 bg-primary-600 py-4 w-fit rounded-[12] @5xl/pac:mx-50 ">
            내 강점과 약점은?
          </div>
        </div>

        <div
          className={neato(
            "flex flex-col items-center justify-center gap-12 @3xl/pac:flex-row"
          )}
        >
          <ComProsAndCons type="pros" item={pros} />
          <ComProsAndCons type="cons" item={cons} />
        </div>
      </div>
    </div>
  );
}

export function ProsAndConsHighlight() {
  return <></>;
}

export function ComProsAndCons({
  type,
  item,
}: {
  type: "pros" | "cons";
  item: { key: string; score: number } | undefined;
}) {
  return (
    <div
      className={neato(
        "flex flex-row items-center px-24 py-8 gap-24 bg-white rounded-[12] shadow-custom border-1",
        item === undefined && "border-primary-600",
        item?.score !== undefined && item.score >= 80 && "border-green-500",
        item?.score !== undefined &&
          item.score >= 50 &&
          item.score < 80 &&
          "border-yellow-400",
        item?.score !== undefined && item.score < 50 && "border-red-500"
      )}
    >
      <Image
        src={`/icons/evaluation/face/${findFace({ type, item })}.svg`}
        alt=""
        width={90}
        height={90}
      />
      <div>
        <div className="heading-03 @3xl/pac:heading-02">
          {item
            ? getEnumValueByKey(EvaluationKeysKr, item.key)
            : type === "cons"
              ? "단점 없음"
              : "장점 없음"}
        </div>
        {item && <EvaluationScore value={item.score} />}
      </div>
    </div>
  );
}

function findFace({
  type,
  item,
}: {
  type: "pros" | "cons";
  item: { key: string; score: number } | undefined;
}) {
  if (!item) {
    return type === "pros" ? "no_pros" : "no_cons";
  }

  return gradeScore(item.score);
}

class ProsAndCons {
  public pros: { key: string; score: number } | undefined;
  public cons: { key: string; score: number } | undefined;

  constructor(private evaluation: { [x: string]: { score: number } }) {
    this.pros = this.getProsPipe();
    this.cons = this.getConsPipe();
  }

  private getFlatEvaluation() {
    return pipe(
      Object.entries(this.evaluation),
      filter(([key]) => key !== "overallAssessment"),
      map(([key, value]) => ({ key: key, score: value.score }))
    );
  }

  private getProsPipe() {
    return pipe(
      this.getFlatEvaluation(),
      filter((item) => item.score >= 80),
      (arr) =>
        reduce(
          (acc, item) => (!acc || item.score > acc.score ? item : acc),
          undefined as { key: string; score: number } | undefined,
          arr
        )
    );
  }

  private getConsPipe() {
    return pipe(
      this.getFlatEvaluation(),
      filter((item) => item.score < 80),
      (arr) =>
        reduce(
          (acc, item) => (!acc || item.score < acc.score ? item : acc),
          undefined as { key: string; score: number } | undefined,
          arr
        )
    );
  }
}
