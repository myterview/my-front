import { GradedScore } from "@/types";

export function gradeScore({
  type,
  score,
}: {
  score: number | undefined;
  type?: "pros" | "cons";
}) {
  if (score === undefined) {
    return type === "pros" ? GradedScore.no_pros : GradedScore.no_cons;
  }

  switch (true) {
    case score >= 80:
      return GradedScore.good;
    case score >= 50:
      return GradedScore.normal;
    default:
      return GradedScore.bad;
  }
}
