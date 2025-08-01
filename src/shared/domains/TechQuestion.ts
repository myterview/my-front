import { BackendResponse } from "../types";
import { DateTime, DateTimeDomain } from "./DateTime";
import { UseMutateFunction } from "@tanstack/react-query";

export interface TechQuestionDomain {
  id: string;
  question: string;
  solution: string;
  createdAt: DateTimeDomain;
  code?: string;
  tags: string[];
  isUserBookmarked: boolean;
  isUserAnswered: boolean;

  toggleBookmark: (
    mutate: UseMutateFunction<
      unknown,
      unknown,
      {
        questionId: string;
        isBookmarked: boolean;
      },
      unknown
    >
  ) => () => void;
}

export class TechQuestion implements TechQuestionDomain {
  public id: string;
  public question: string;
  public solution: string;
  public createdAt: DateTimeDomain;
  public code?: string;
  public tags: string[];
  public isUserBookmarked: boolean;
  public isUserAnswered: boolean;

  constructor(tq: BackendResponse["techQuestion"]) {
    this.id = tq.id;
    this.question = tq.question;
    this.solution = tq.solution;
    this.createdAt = new DateTime(tq.createdAt);
    this.code = tq.code;
    this.tags = tq.tags;
    this.isUserBookmarked = tq.isUserBookmarked;
    this.isUserAnswered = tq.isUserAnswered;
  }

  public toggleBookmark(
    mutate: UseMutateFunction<
      unknown,
      unknown,
      { questionId: string; isBookmarked: boolean },
      unknown
    >
  ) {
    return () =>
      mutate({
        questionId: this.id,
        isBookmarked: this.isUserBookmarked,
      });
  }
}
