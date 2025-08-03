import { BackendResponse } from "../types";
import { DateTime, DateTimeDomain } from "./DateTime";

export interface TechAnswerDomain {
  id: string;
  userId: string;
  questionId: string;
  userAnswer: string;
  llmAnswer: string;
  createdAt: DateTimeDomain;
}

export class TechAnswer implements TechAnswerDomain {
  public id: string;
  public userId: string;
  public questionId: string;
  public userAnswer: string;
  public llmAnswer: string;
  public createdAt: DateTimeDomain;

  constructor(props: BackendResponse["techAnswer"]) {
    this.id = props.id;
    this.userId = props.userId;
    this.questionId = props.questionId;
    this.userAnswer = props.userAnswer;
    this.llmAnswer = props.llmAnswer;
    this.createdAt = new DateTime(props.createdAt);
  }
}
