export function gradeScore(score: number) {
  switch (true) {
    case score >= 80:
      return "good";
    case score >= 50:
      return "normal";
    default:
      return "bad";
  }
}
