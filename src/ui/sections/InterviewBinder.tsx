"use client";

import { Card } from "../components/CardComponent/Card";
import { Tags } from "../components/Chips/Tags";
import { InterviewClient } from "@/api/interview.client";
import { Interview, InterviewDomain } from "@/shared/domains/Interview";
import { getEnumValueByKey } from "@/shared/utils/enumUtils";
import { useIntersectionQuery } from "@/shared/utils/useIntersectionQuery";
import { For } from "@ilokesto/utilinent";
import { neato } from "neato";
import Link from "next/link";

export function InterviewBinder() {
  const { data, ref } = useIntersectionQuery(
    new InterviewClient().InfiniteInterviewList()
  );

  return (
    <div className="grid grid-cols-1 gap-24 @xl/main:grid-cols-2 @4xl/main:grid-cols-3">
      <For
        each={data?.pages
          ?.flatMap((page) => page.items)
          .map((item) => new Interview(item))}
      >
        {(interview) => {
          return (
            <InterviewBinder.CardWrapper
              key={interview.id}
              interview={interview}
            >
              <Card
                className={neato("border-l-8 pl-24", {
                  "border-secondary bg-white": interview.isInProgress(),
                  "border-gray-200 bg-gray-100": interview.isAnalyzing(),
                  "border-primary-100 bg-white": interview.isCompleted(),
                })}
              >
                <Card.Title>{interview.title}</Card.Title>

                <div className="flex items-center justify-between mt-8 mb-72">
                  <Card.subTitle>{interview.createdAt.format()}</Card.subTitle>

                  <Card.ProgressChip>
                    {interview.progressStatus}
                  </Card.ProgressChip>
                </div>

                <Tags
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

      <div ref={ref} />
    </div>
  );
}

InterviewBinder.CardWrapper = function CardWrapper({
  interview,
  children,
}: {
  interview: InterviewDomain;
  children: React.ReactNode;
}) {
  switch (true) {
    case interview.isInProgress():
      return (
        <Link href={`/dashboard/interview/${interview.id}`}>{children}</Link>
      );

    case interview.isCompleted():
      return (
        <Link href={`/dashboard/interview/${interview.id}/evaluation`}>
          {children}
        </Link>
      );

    case interview.isAnalyzing():
      return <>{children}</>;

    default:
      return <>{children}</>;
  }
};
