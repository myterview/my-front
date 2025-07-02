"use client";

import { InterviewClient } from "@/apis/interview.client";
import { Dialog } from "@/components/Modal/Dialog";
import { InterviewEvaluationModal } from "@/components/Modal/InterviewEvaluationModal";
import { useSuspenseQuery } from "@tanstack/react-query";
import { use } from "react";

export default function InterceptPage({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const { interviewId } = use(params);
  const {
    data: { session: interview },
  } = useSuspenseQuery(new InterviewClient().getInterviewById(interviewId));

  return (
    <Dialog
      title={interview.title}
      className="gap-8 desktop:w-700 h-dvh desktop:max-h-[80dvh] desktop:min-h-0 overflow-y-scroll py-60"
    >
      <InterviewEvaluationModal {...interview} />
    </Dialog>
  );
}
