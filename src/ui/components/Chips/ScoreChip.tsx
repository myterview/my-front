import { InterviewEvaluation } from "@/shared/domains/InterviewEvaluation/InterviewEvaluation";
import { GradedScore } from "@/types";
import { neato } from "neato";

export function ScoreChip({ score }: { score: number }) {
  const grade = InterviewEvaluation.gradeScore({ score });

  return (
    <div
      className={neato(
        "rounded-[12] px-12 py-8 text-base/16 font-bold text-white w-fit",
        {
          "bg-green-500": grade === GradedScore.good,
          "bg-yellow-400": grade === GradedScore.normal,
          "bg-red-500": grade === GradedScore.bad,
        }
      )}
    >
      {score}점
    </div>
  );
}
