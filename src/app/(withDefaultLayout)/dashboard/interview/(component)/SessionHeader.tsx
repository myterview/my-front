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
import Image from "next/image";
import { useRouter } from "next/navigation";

export function SessionHeader({ interviewId }: { interviewId: string }) {
  const router = useRouter();
  const { data } = useSuspenseQuery(
    new InterviewClient().getInterviewById(interviewId)
  );

  return (
    <div className="shadow-custom">
      <SizeWrapper asChild="header" className="space-y-24 pt-64 pb-48">
        <div className="flex items-start justify-between">
          <Card.Title>{data?.session.title}</Card.Title>
          <button type="button" onClick={() => router.back()}>
            <Image
              src="/icons/close.svg"
              alt="close"
              draggable="false"
              width={24}
              height={24}
            />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <Card.subTitle>{toKST(data.session.createdAt)}</Card.subTitle>
          <Card.Tags
            each={[
              getEnumValueByKey(InterviewPositionKr, data.session.position),
              getEnumValueByKey(InterviewExperienceKr, data.session.experience),
            ]}
          />
        </div>
      </SizeWrapper>
    </div>
  );
}
