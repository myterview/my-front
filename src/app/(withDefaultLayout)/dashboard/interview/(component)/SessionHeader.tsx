"use client";

import { InterviewClient } from "@/apis/interview.client";
import { Card } from "@/components/Binder/Card";
import SizeWrapper from "@/components/SizeWrapper/SizeWrapper";
import {
  InterviewPositionKr,
  InterviewExperienceKr,
} from "@/hooks/sicilian/interviewForm";
import { getEnumValueByKey } from "@/utils/enumUtils";
import { toKST } from "@/utils/toKST";
import { useSuspenseQuery } from "@tanstack/react-query";

export function SessionHeader({ interviewId }: { interviewId: string }) {
  const { data } = useSuspenseQuery(
    new InterviewClient().getInterviewById(interviewId)
  );

  return (
    <div className="shadow-custom">
      <SizeWrapper asChild="header" className="pt-64 pb-48">
        <div className="w-fit min-w-400 space-y-8">
          <Card.Title>{data?.session.title}</Card.Title>
          <div className="flex items-center justify-between">
            <Card.subTitle>{toKST(data.session.createdAt)}</Card.subTitle>
            <Card.Tags
              each={[
                getEnumValueByKey(InterviewPositionKr, data.session.position),
                getEnumValueByKey(
                  InterviewExperienceKr,
                  data.session.experience
                ),
              ]}
            />
          </div>
        </div>
      </SizeWrapper>
    </div>
  );
}
