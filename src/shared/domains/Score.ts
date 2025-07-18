import { GradedScore } from "@/shared/types";

export interface ScoreDomain {
  score: number;
  grade: GradedScore.good | GradedScore.normal | GradedScore.bad;
  isGood: () => boolean;
  isNormal: () => boolean;
  isBad: () => boolean;
}

export class Score implements ScoreDomain {
  public grade: GradedScore.good | GradedScore.normal | GradedScore.bad;

  constructor(public score: number) {
    switch (true) {
      case this.score >= 80:
        this.grade = GradedScore.good;
        break;

      case this.score >= 50:
        this.grade = GradedScore.normal;
        break;

      default:
        this.grade = GradedScore.bad;
    }
  }

  public isGood() {
    return this.grade === GradedScore.good;
  }

  public isNormal() {
    return this.grade === GradedScore.normal;
  }

  public isBad() {
    return this.grade === GradedScore.bad;
  }
}
