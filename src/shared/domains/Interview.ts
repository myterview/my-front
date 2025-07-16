import { DateTime, DateTimeDomain } from "./DateTime";
import {
  IInterviewEvaluationFactory,
  InterviewEvaluationFactory,
} from "./InterviewEvaluation/InterviewEvaluationFactory";
import {
  components,
  InterviewExperienceKr,
  InterviewPositionKr,
  ProgressStatus,
} from "@/types";

interface InterviewDomain {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly position: InterviewPositionKr;
  readonly experience: InterviewExperienceKr;
  readonly isActive: boolean;
  readonly createdAt: DateTimeDomain;
  readonly messages?: components["schemas"]["InterviewMessage"][];
  readonly evaluation: IInterviewEvaluationFactory;
}

export class Interview implements InterviewDomain {
  public readonly id: string;
  public readonly userId: string;
  public readonly title: string;
  public readonly position: InterviewPositionKr;
  public readonly experience: InterviewExperienceKr;
  public readonly isActive: boolean;
  public readonly createdAt: DateTimeDomain;
  public readonly messages?: components["schemas"]["InterviewMessage"][];
  public readonly evaluation: IInterviewEvaluationFactory;

  constructor(data: {
    success: boolean;
    session: components["schemas"]["InterviewSession"];
  }) {
    this.id = data.session.id;
    this.userId = data.session.userId;
    this.title = data.session.title;
    this.position = data.session.position as InterviewPositionKr;
    this.experience = data.session.experience as InterviewExperienceKr;
    this.isActive = data.session.isActive;
    this.createdAt = new DateTime(data.session.createdAt);
    this.messages = data.session.messages;

    // API 데이터를 TInterviewEvaluation 타입에 맞게 변환
    if (data.session.evaluation && data.session.evaluationType === "default") {
      // 평가 데이터가 있고 타입이 "default"인 경우
      this.evaluation = new InterviewEvaluationFactory({
        evaluationType: "default",
        evaluation: data.session.evaluation,
      });
    } else {
      // 평가 데이터가 없거나 타입이 undefined인 경우
      this.evaluation = new InterviewEvaluationFactory({
        evaluationType: undefined,
        evaluation: undefined,
      });
    }
  }

  public get progressStatus(): ProgressStatus {
    if (this.isActive) return ProgressStatus.IN_PROGRESS;
    if (!this.evaluation.instance.evaluationType)
      return ProgressStatus.ANALYZING;
    return ProgressStatus.COMPLETED;
  }

  public isCompleted(): boolean {
    return this.progressStatus === ProgressStatus.COMPLETED;
  }

  public isAnalyzing(): boolean {
    return this.progressStatus === ProgressStatus.ANALYZING;
  }

  public isInProgress(): boolean {
    return this.progressStatus === ProgressStatus.IN_PROGRESS;
  }
}
