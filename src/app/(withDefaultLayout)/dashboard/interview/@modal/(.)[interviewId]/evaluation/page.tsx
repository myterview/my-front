"use client";

import { InterviewClient } from "@/apis/interview.client";
import { InterviewEvaluationModal } from "@/components/Modal/InterviewEvaluationModal";
import { ModalWrapper } from "@/components/Modal/ModalWrapper";
import { useSuspenseQuery } from "@tanstack/react-query";
import { grunfeld } from "grunfeld";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function InterceptPage({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const router = useRouter();
  const { interviewId } = use(params);
  const {
    data: { session: interview },
  } = useSuspenseQuery(new InterviewClient().getInterviewById(interviewId));

  useEffect(() => {
    grunfeld.add(() => ({
      element: (
        <ModalWrapper className="gap-8 desktop:w-700 h-dvh desktop:max-h-[80dvh] desktop:min-h-0 overflow-y-scroll py-60">
          <InterviewEvaluationModal {...interview} />
        </ModalWrapper>
      ),
      dismissCallback: () => {
        router.back();
      },
    }));

    return () => {
      grunfeld.remove();
    };
  }, [interview, router]);

  return <></>;
}
