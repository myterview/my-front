import { components } from "./api";

export type BackendResponse = {
  evaluation: {
    default: components["schemas"]["EvaluationDto"];
  };
  interview: components["schemas"]["InterviewSession"];
  interviewMessages: components["schemas"]["InterviewMessage"][];
  interviewMessage: components["schemas"]["InterviewMessage"];
  user: components["schemas"]["UserResDTO"];
};
