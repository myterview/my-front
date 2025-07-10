import { ScoreChip } from "../Chips/ScoreChip";
import { GradedScore } from "@/types";
import { getEnumKeyByValue, getEnumValueByKey } from "@/utils/enumUtils";
import { gradeScore } from "@/utils/gradeScore";
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
    <div className="@container/pac">
      <div
        className={neato(
          "flex flex-col items-center justify-center gap-24 bg-primary-100 w-full py-48 ",
          "@5xl/pac:flex-row @5xl/pac:gap-52 @5xl/pac:rounded-[12]"
        )}
      >
        <MyProsAndCons.Title />

        <div
          className={neato(
            "flex flex-col justify-center items-center gap-24",
            "@2xl/pac:flex-row"
          )}
        >
          <MyProsAndCons.Card {...pros} />
          <MyProsAndCons.Card {...cons} />
        </div>
      </div>
    </div>
  );
}

MyProsAndCons.Title = function MyProsAndConsTitle() {
  return (
    <div
      className={neato(
        "@5xl/pac:flex-row @5xl/pac:gap-24",
        "flex flex-col items-center justify-center gap-12"
      )}
    >
      <div className="relative overflow-hidden bg-white rounded-full shadow-custom w-80 h-80">
        <Image
          fill
          className="object-cover"
          src="/images/mrCatToSayHi.svg"
          alt="Pros and Cons"
          draggable={false}
        />
      </div>

      <div className="text-center text-white w-200 bg-primary-600 heading-03 rounded-[12]">
        내 강점과 약점은?
      </div>
    </div>
  );
};

MyProsAndCons.Card = function MyProsAndConsCard({
  keyName,
  score,
  grade,
}: {
  keyName?: string;
  score?: number;
  grade: GradedScore;
}) {
  return (
    <div
      className={neato(
        "flex flex-row items-center px-24 py-8 gap-24 bg-white rounded-[12] shadow-custom border-1",
        {
          "border-green-500": grade === GradedScore.good,
          "border-yellow-400": grade === GradedScore.normal,
          "border-red-500": grade === GradedScore.bad,
          "border-primary-600":
            grade === GradedScore.no_pros || grade === GradedScore.no_cons,
        }
      )}
    >
      <Image
        src={`/icons/evaluation/face/${getEnumKeyByValue(grade)}.svg`}
        alt=""
        width={90}
        height={90}
      />
      <div>
        <div className="heading-03 @3xl/pac:heading-02">
          {keyName ? getEnumValueByKey(keyName) : grade}
        </div>
        {score !== undefined && <ScoreChip score={score} />}
      </div>
    </div>
  );
};

export class ProsAndCons {
  public pros: { keyName?: string; score?: number; grade: GradedScore };
  public cons: { keyName?: string; score?: number; grade: GradedScore };

  constructor(private evaluation: { [x: string]: { score: number } }) {
    this.pros = this.getProsPipe();
    this.cons = this.getConsPipe();
  }

  private getFlatEvaluation() {
    return pipe(
      Object.entries(this.evaluation),
      filter(([key]) => key !== "overallAssessment"),
      map(([key, value]) => ({ keyName: key, score: value.score }))
    );
  }

  private getProsPipe() {
    return pipe(
      this.getFlatEvaluation(),
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

  private getConsPipe() {
    return pipe(
      this.getFlatEvaluation(),
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
