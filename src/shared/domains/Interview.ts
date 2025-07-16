import { DateTime, DateTimeDomain } from "./DateTime";
import {
  IInterviewEvaluationFactory,
  InterviewEvaluationFactory,
} from "./InterviewEvaluation/InterviewEvaluationFactory";
import {
  InterviewExperienceKr,
  InterviewPositionKr,
  ProgressStatus,
} from "@/types";
import { BackendResponse } from "@/types/response";

export interface InterviewDomain {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly position: InterviewPositionKr;
  readonly experience: InterviewExperienceKr;
  readonly isActive: boolean;
  readonly createdAt: DateTimeDomain;
  readonly messages?: BackendResponse["interviewMessages"];
  readonly evaluation: IInterviewEvaluationFactory | undefined;

  get progressStatus(): ProgressStatus;
  isCompleted(): boolean;
  isAnalyzing(): boolean;
  isInProgress(): boolean;
}

export class Interview implements InterviewDomain {
  public readonly id;
  public readonly userId;
  public readonly title;
  public readonly position;
  public readonly experience;
  public readonly isActive;
  public readonly createdAt;
  public readonly messages;
  public readonly evaluation;

  constructor(session: BackendResponse["interview"]) {
    this.id = session.id;
    this.userId = session.userId;
    this.title = session.title;
    this.position = session.position as InterviewPositionKr;
    this.experience = session.experience as InterviewExperienceKr;
    this.isActive = session.isActive;
    this.createdAt = new DateTime(session.createdAt);
    this.messages = session.messages;

    // API 데이터를 TInterviewEvaluation 타입에 맞게 변환
    if (session.evaluation && session.evaluationType === "default") {
      // 평가 데이터가 있고 타입이 "default"인 경우
      this.evaluation = new InterviewEvaluationFactory({
        evaluationType: "default",
        evaluation: session.evaluation,
      });
    } else {
      // 평가 데이터가 없거나 타입이 undefined인 경우
      this.evaluation = undefined;
    }
  }

  public get progressStatus(): ProgressStatus {
    if (this.isActive) return ProgressStatus.IN_PROGRESS;
    if (!this.evaluation?.instance.evaluationType)
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
