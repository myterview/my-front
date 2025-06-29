import { For } from "@ilokesto/utilinent";
import { Card, ProgressStatus } from "./Card";
import { getEnumValueByKey } from "@/utils/enumUtils";
import {
  InterviewPositionKr,
  InterviewExperienceKr,
} from "@/hooks/sicilian/interviewForm";
import { neato } from "neato";
import { components } from "@/types/api";

export function InterviewBinder({
  interview,
}: {
  interview: Array<components["schemas"]["InterviewSessionWithoutMessages"]>;
}) {
  return (
    <div className="grid grid-cols-1 gap-24 md:grid-cols-2 lg:grid-cols-3">
      <For each={interview}>
        {(interview) => (
          <Card
            key={interview.id}
            className={neato(
              "border-l-8 pl-24",
              InterviewBinder.getInterviewProgressStatus(interview) ===
                ProgressStatus.IN_PROGRESS && "border-secondary bg-white",
              InterviewBinder.getInterviewProgressStatus(interview) ===
                ProgressStatus.ANALYZING && "border-gray-200 bg-gray-100",
              InterviewBinder.getInterviewProgressStatus(interview) ===
                ProgressStatus.COMPLETED && "border-blue-100 bg-white"
            )}
          >
            <Card.Title>{interview.title}</Card.Title>
            <div className="mt-8 mb-72 flex items-center justify-between">
              <Card.subTitle>{interview.createdAt}</Card.subTitle>
              <Card.ProgressChip>
                {InterviewBinder.getInterviewProgressStatus(interview)}
              </Card.ProgressChip>
            </div>
            <Card.Tags
              each={[
                getEnumValueByKey(InterviewPositionKr, interview.position),
                getEnumValueByKey(InterviewExperienceKr, interview.experience),
              ]}
            />
          </Card>
        )}
      </For>
    </div>
  );
}

InterviewBinder.getInterviewProgressStatus = function ({
  isActive,
  evaluation,
}: {
  isActive: boolean;
  evaluation?: unknown;
}): ProgressStatus {
  if (isActive) {
    return ProgressStatus.IN_PROGRESS;
  }

  if (evaluation) {
    return ProgressStatus.ANALYZING;
  }

  return ProgressStatus.COMPLETED;
};
