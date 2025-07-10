"use client";

import { InterviewClient } from "@/apis/interview.client";
import { EvaluationHeader } from "@/components/Evaluation/EvaluationHeader";
import { SizeWrapper } from "@/components/SizeWrapper/SizeWrapper";
import { getEnumValueByKey } from "@/utils/enumUtils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function SessionHeader({ interviewId }: { interviewId: string }) {
  const router = useRouter();
  const { data } = useSuspenseQuery(
    new InterviewClient().getInterviewById(interviewId)
  );

  return (
    <div className="shadow-custom">
      <SizeWrapper asChild="header">
        <EvaluationHeader
          className="pb-48 space-y-8 pt-52"
          onClose={router.back}
          title={data.session.title}
          createdAt={data.session.createdAt}
          tags={[
            getEnumValueByKey(data.session.position),
            getEnumValueByKey(data.session.experience),
          ]}
        />
      </SizeWrapper>
    </div>
  );
}
