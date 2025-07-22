import { DateTime, DateTimeDomain } from "./DateTime";
import {
  IInterviewEvaluationFactory,
  InterviewEvaluationFactory,
} from "./InterviewEvaluation/InterviewEvaluationFactory";
import {
  BackendResponse,
  components,
  InterviewExperienceKr,
  InterviewPositionKr,
  ProgressStatus,
} from "@/shared/types";

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

    if (session.evaluationType === "default") {
      this.evaluation = new InterviewEvaluationFactory(
        session as components["schemas"]["DefaultEvaluationInterviewResponse"]
      );
    } else {
      this.evaluation = undefined;
    }
  }

  public get progressStatus(): ProgressStatus {
    if (this.isActive) return ProgressStatus.IN_PROGRESS;
    if (!this.evaluation) return ProgressStatus.ANALYZING;
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
