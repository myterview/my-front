import { Score } from "@/shared/domains/Score";
import { neato } from "neato";

export function ScoreChip({ score }: { score: number }) {
  const scoreInstance = new Score(score);

  return (
    <div
      className={neato(
        "rounded-[12] px-12 py-8 text-base/16 font-bold text-white w-fit",
        {
          "bg-green-500": scoreInstance.isGood(),
          "bg-yellow-400": scoreInstance.isNormal(),
          "bg-red-500": scoreInstance.isBad(),
        }
      )}
    >
      {scoreInstance.score}점
    </div>
  );
}
