"use client";

import { Card } from "../components/Card/Card";
import { InterviewClient } from "@/api/interview.client";
import { getEnumValueByKey } from "@/shared/utils/enumUtils";
import { toKST } from "@/shared/utils/toKST";
import { components, ProgressStatus } from "@/types";
import { For, Observer, Show } from "@ilokesto/utilinent";
import { useInfiniteQuery } from "@tanstack/react-query";
import { neato } from "neato";
import Link from "next/link";

export function InterviewBinder() {
  const { data: interviewList, fetchNextPage } = useInfiniteQuery(
    new InterviewClient().InfiniteInterviewList()
  );

  return (
    <div className="grid grid-cols-1 gap-24 @xl/main:grid-cols-2 @4xl/main:grid-cols-3">
      <Show when={interviewList}>
        {(interviewList) => (
          <For each={interviewList.pages.flatMap((page) => page.items)}>
            {(interview) => {
              const status =
                InterviewBinder.getInterviewProgressStatus(interview);

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

                    <div className="flex items-center justify-between mt-8 mb-72">
                      <Card.subTitle>
                        {toKST(interview.createdAt)}
                      </Card.subTitle>

                      <Card.ProgressChip>{status}</Card.ProgressChip>
                    </div>

                    <Card.Tags
                      each={[
                        getEnumValueByKey(interview.position),
                        getEnumValueByKey(interview.experience),
                      ]}
                    />
                  </Card>
                </InterviewBinder.CardWrapper>
              );
            }}
          </For>
        )}
      </Show>
      <Observer
        onIntersect={(isIntersecting) => {
          if (isIntersecting) fetchNextPage();
        }}
      />
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

  if (!evaluationType) return ProgressStatus.ANALYZING;

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
  switch (status) {
    case ProgressStatus.IN_PROGRESS:
      return (
        <Link href={`/dashboard/interview/${interview.id}`}>{children}</Link>
      );
    case ProgressStatus.ANALYZING:
      return <>{children}</>;
    case ProgressStatus.COMPLETED:
      // 모달? 띄우는 곳
      return (
        <Link href={`/dashboard/interview/${interview.id}/evaluation`}>
          {children}
        </Link>
      );
  }
};
