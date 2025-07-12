"use client";

import { InterviewClient } from "@/api/interview.client";
import { getEnumValueByKey } from "@/shared/utils/enumUtils";
import { EvaluationHeader } from "@/ui/components/Evaluation/EvaluationHeader";
import { SizeWrapper } from "@/ui/components/SizeWrapper/SizeWrapper";
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
