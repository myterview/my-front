import { ScoreChip } from "../Chips/ScoreChip";
import { InterviewEvaluationFactory } from "@/shared/domains/InterviewEvaluation/InterviewEvaluationFactory";
import { Score } from "@/shared/domains/Score";
import { getEnumKeyByValue, getEnumValueByKey } from "@/shared/utils/enumUtils";
import { BackendResponse } from "@/types/response";
import { neato } from "neato";
import Image from "next/image";

export function UserInterviewProsAndCons({
  evaluation,
}: {
  evaluation: BackendResponse["evaluation"]["default"];
}) {
  const interviewEvaluation = new InterviewEvaluationFactory({
    evaluationType: "default",
    evaluation,
  });

  const { pros, cons } = interviewEvaluation.instance.getProsAndCons();

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
          <UserInterviewProsAndCons.Card type="pros" item={pros} />
          <UserInterviewProsAndCons.Card type="cons" item={cons} />
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

// TODO: 객체지향적으로 객체가 스스로 평가할 방법을 찾으면 좋겠다
UserInterviewProsAndCons.Card = function MyProsAndConsCard({
  type,
  item,
}: {
  type: "pros" | "cons";
  item: { keyName: string; score: number } | undefined;
}) {
  if (!item) {
    return (
      <div
        className={neato(
          "flex flex-row items-center px-24 py-8 gap-24 bg-white rounded-[12] shadow-custom border-1",
          "border-primary-600"
        )}
      >
        <Image
          src={`/icons/evaluation/face/no_${type}.svg`}
          alt=""
          width={90}
          height={90}
        />
        <div>
          <div className="heading-03 @3xl/pac:heading-02">
            {type === "pros" ? "장점 없음" : "단점 없음"}
          </div>
        </div>
      </div>
    );
  }

  const scoreInstance = new Score(item.score);

  return (
    <div
      className={neato(
        "flex flex-row items-center px-24 py-8 gap-24 bg-white rounded-[12] shadow-custom border-1",
        {
          "border-green-500": scoreInstance.isGood(),
          "border-yellow-400": scoreInstance.isNormal(),
          "border-red-500": scoreInstance.isBad(),
        }
      )}
    >
      <Image
        src={`/icons/evaluation/face/${getEnumKeyByValue(scoreInstance.grade)}.svg`}
        alt=""
        width={90}
        height={90}
      />
      <div>
        <div className="heading-03 @3xl/pac:heading-02">
          {getEnumValueByKey(item.keyName)}
        </div>
        <ScoreChip score={item.score} />
      </div>
    </div>
  );
};
