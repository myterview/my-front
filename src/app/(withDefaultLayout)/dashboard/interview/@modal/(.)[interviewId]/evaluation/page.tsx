"use client";

import { InterviewClient } from "@/apis/interview.client";
import { EvaluationProps } from "@/types";
import { Donate } from "@/ui/components/Donate/Donate";
import {
  DefaultEvaluation,
  DefaultEvaluationOverall,
  DefaultEvaluationRadar,
} from "@/ui/components/Evaluation/DefaultEvaluation";
import { EvaluationHeader } from "@/ui/components/Evaluation/EvaluationHeader";
import { UserInterviewProsAndCons } from "@/ui/components/Evaluation/MyProsAndCons";
import { ModalWrapper } from "@/ui/components/Modal/ModalWrapper";
import { getEnumValueByKey } from "@/utils/enumUtils";
import { grunfeld } from "@ilokesto/grunfeld";
import { useSuspenseQuery } from "@tanstack/react-query";
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

  const { evaluation: e, evaluationType: eT } = {
    evaluation: interview.evaluation,
    evaluationType: interview.evaluationType,
  } as EvaluationProps;

  useEffect(() => {
    if (!eT) return;

    grunfeld.add(() => ({
      element: (
        <ModalWrapper className="md:w-770 h-dvh md:max-h-[80dvh] py-60 px-0 md:min-h-0 overflow-y-scroll flex flex-col gap-60">
          <div className="flex flex-col px-40 gap-28">
            <EvaluationHeader
              onClose={grunfeld.clear}
              title={interview.title}
              createdAt={interview.createdAt}
              className="space-y-8"
              tags={[
                getEnumValueByKey(interview.position),
                getEnumValueByKey(interview.experience),
              ]}
            />

            <Donate />

            <DefaultEvaluationOverall evaluation={e} />

            <DefaultEvaluationRadar evaluation={e} />
          </div>

          <UserInterviewProsAndCons evaluation={e} />

          <div className="flex flex-col gap-24 px-40">
            <DefaultEvaluation evaluation={e} />
          </div>
        </ModalWrapper>
      ),
      dismissCallback: router.back,
    }));

    return grunfeld.remove;
  }, [interview, router, e, eT]);

  return <></>;
}
