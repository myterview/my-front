import { GradedScore } from "@/types";

export interface ScoreDomain {
  score: number;
  grade: () => GradedScore;
  isGood: () => boolean;
  isNormal: () => boolean;
  isBad: () => boolean;
}

export class Score implements ScoreDomain {
  constructor(public score: number) {}

  public grade() {
    switch (true) {
      case this.score >= 80:
        return GradedScore.good;
      case this.score >= 50:
        return GradedScore.normal;
      default:
        return GradedScore.bad;
    }
  }

  public isGood() {
    return this.grade() === GradedScore.good;
  }

  public isNormal() {
    return this.grade() === GradedScore.normal;
  }

  public isBad() {
    return this.grade() === GradedScore.bad;
  }
}
