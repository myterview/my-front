"use client";

import { For, Observer, Show } from "@ilokesto/utilinent";
import { Card, ProgressStatus } from "./Card";
import { getEnumValueByKey } from "@/utils/enumUtils";
import {
  InterviewPositionKr,
  InterviewExperienceKr,
} from "@/hooks/sicilian/interviewForm";
import { neato } from "neato";
import { components } from "@/types/api";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { InterviewClient } from "@/apis/interview.client";

export function InterviewBinder() {
  const { data: interviewList, fetchNextPage } = useInfiniteQuery(new InterviewClient().InfiniteInterviewList());

  console.log(interviewList);

  return (
    <div className="grid grid-cols-1 gap-24 md:grid-cols-2 lg:grid-cols-3">
      <Show when={interviewList}>
        {(interviewList) => <For each={interviewList.pages.flatMap(page => page.items)}>
          {(interview) => {
            const status = InterviewBinder.getInterviewProgressStatus(interview);

            return (
              <InterviewBinder.CardWrapper
                key={interview.id}
                status={status}
                interview={interview}
              >
                <Card
                  className={neato(
                    "border-l-8 pl-24",
                    status === ProgressStatus.IN_PROGRESS &&
                      "border-secondary bg-white",
                    status === ProgressStatus.ANALYZING &&
                      "border-gray-200 bg-gray-100",
                    status === ProgressStatus.COMPLETED &&
                      "border-blue-100 bg-white"
                  )}
                >
                  <Card.Title>{interview.title}</Card.Title>
                  <div className="mt-8 mb-72 flex items-center justify-between">
                    <Card.subTitle>{interview.createdAt}</Card.subTitle>
                    <Card.ProgressChip>{status}</Card.ProgressChip>
                  </div>
                  <Card.Tags
                    each={[
                      getEnumValueByKey(InterviewPositionKr, interview.position),
                      getEnumValueByKey(
                        InterviewExperienceKr,
                        interview.experience
                      ),
                    ]}
                  />
                </Card>
              </InterviewBinder.CardWrapper>
            );
          }}
        </For>}
      </Show>
      <Observer onIntersect={(isIntersecting) => {
      if (isIntersecting) fetchNextPage();
    }} />
    </div>
  );
}

InterviewBinder.getInterviewProgressStatus = function ({
  isActive,
  evaluationType,
}: {
  isActive: boolean;
  evaluationType?: unknown;
}): ProgressStatus {
  if (isActive) return ProgressStatus.IN_PROGRESS;

  if (evaluationType) return ProgressStatus.ANALYZING;

  return ProgressStatus.COMPLETED;
};

InterviewBinder.CardWrapper = function CardWrapper({
  status,
  interview,
  children,
}: {
  status: ProgressStatus;
  interview: components["schemas"]["InterviewSessionWithoutMessages"];
  children: React.ReactNode;
}) {
  if (status === ProgressStatus.IN_PROGRESS) {
    return (
      <Link href={`/dashboard/interview/${interview.id}`}>{children}</Link>
    );
  } else if (status === ProgressStatus.ANALYZING) {
    return <>{children}</>;
  } else {
    // 모달? 띄우는 곳
    return <>{children}</>;
  }
};
