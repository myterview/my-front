"use client";

import { InterviewClient } from "@/api/interview.client";
import { Interview } from "@/shared/domains/Interview";
import { getEnumValueByKey } from "@/shared/utils/enumUtils";
import { Donate } from "@/ui/components/Donate/Donate";
import {
  DefaultEvaluation,
  DefaultEvaluationOverall,
  DefaultEvaluationRadar,
} from "@/ui/components/Evaluation/DefaultEvaluation";
import { EvaluationHeader } from "@/ui/components/Evaluation/EvaluationHeader";
import { UserInterviewProsAndCons } from "@/ui/components/Evaluation/MyProsAndCons";
import { ModalWrapper } from "@/ui/components/Modal/ModalWrapper";
import { grunfeld } from "@ilokesto/grunfeld";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo } from "react";

export default function InterceptPage({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const router = useRouter();
  const { interviewId } = use(params);
  const {
    data: { session },
  } = useSuspenseQuery(new InterviewClient().getInterviewById(interviewId));

  const interview = useMemo(() => new Interview(session), [session]);

  useEffect(() => {
    const evaluation = interview.evaluation;
    if (evaluation && evaluation?.isDefaultEvaluation()) {
      grunfeld.add(() => ({
        element: (
          <ModalWrapper className="md:w-770 h-dvh md:max-h-[80dvh] py-60 px-0 md:min-h-0 overflow-y-scroll flex flex-col gap-60">
            <div className="flex flex-col px-40 gap-28">
              <EvaluationHeader
                onClose={grunfeld.clear}
                title={interview.title}
                createdAt={interview.createdAt.format()}
                className="space-y-8"
                tags={[
                  getEnumValueByKey(interview.position),
                  getEnumValueByKey(interview.experience),
                ]}
              />

              <Donate />

              <DefaultEvaluationOverall
                evaluation={evaluation.instance.evaluation}
              />

              <DefaultEvaluationRadar
                evaluation={evaluation.instance.evaluation}
              />
            </div>

            <UserInterviewProsAndCons
              evaluation={evaluation.instance.evaluation}
            />

            <div className="flex flex-col gap-24 px-40">
              <DefaultEvaluation evaluation={evaluation.instance.evaluation} />
            </div>
          </ModalWrapper>
        ),
        dismissCallback: router.back,
      }));

      return grunfeld.remove;
    }
  }, [interview, router]);

  return <></>;
}
