import { ScoreChip } from "../Chips/ScoreChip";
import { ProsAndCons } from "@/shared/domains/evaluation/ProsAndCons";
import { getEnumKeyByValue, getEnumValueByKey } from "@/shared/utils/enumUtils";
import { GradedScore } from "@/types";
import { neato } from "neato";
import Image from "next/image";

export function UserInterviewProsAndCons({
  evaluation,
}: {
  evaluation: { [x: string]: { score: number } };
}) {
  const { pros, cons } = ProsAndCons.extract(evaluation);

  return (
    <div className="@container/pac">
      <div
        className={neato(
          "flex flex-col items-center justify-center gap-24 bg-primary-100 w-full py-48 ",
          "@5xl/pac:flex-row @5xl/pac:gap-52 @5xl/pac:rounded-[12]"
        )}
      >
        <UserInterviewProsAndCons.Title />

        <div
          className={neato(
            "flex flex-col justify-center items-center gap-24",
            "@2xl/pac:flex-row"
          )}
        >
          <UserInterviewProsAndCons.Card {...pros} />
          <UserInterviewProsAndCons.Card {...cons} />
        </div>
      </div>
    </div>
  );
}

UserInterviewProsAndCons.Title = function MyProsAndConsTitle() {
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

UserInterviewProsAndCons.Card = function MyProsAndConsCard({
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
