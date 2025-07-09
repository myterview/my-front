import { InterviewQuery } from "@/apis/interview.query";
import { SessionHeader } from "@/app/(withDefaultLayout)/dashboard/interview/(component)/SessionHeader";
import {
  DefaultEvaluation,
  DefaultEvaluationOverall,
  DefaultEvaluationRadar,
} from "@/components/Evaluation/DefaultEvaluation";
import { EvaluationProsAndCons } from "@/components/Evaluation/EvaluationProsAndCons";
import SizeWrapper from "@/components/SizeWrapper/SizeWrapper";
import { EvaluationProps } from "@/types";

export default async function NotInter({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const { interviewId } = await params;
  const interviewQuery = new InterviewQuery();
  const { session } = await interviewQuery.getInterviewById(interviewId, false);

  const { evaluation: e, evaluationType: eT } = {
    evaluation: session.evaluation,
    evaluationType: session.evaluationType,
  } as EvaluationProps;

  if (!eT) return;

  return (
    <div className="flex flex-col h-dvh">
      <SessionHeader interviewId={interviewId} />

      <SizeWrapper
        asChild={"main"}
        className="@container/main flex-1 flex w-full flex-col overflow-y-scroll py-48 gap-60"
      >
        <div className="@3xl/main:flex @3xl/main:flex-row-reverse gap-56">
          <DefaultEvaluationOverall evaluation={e} />

          <DefaultEvaluationRadar evaluation={e} />
        </div>

        <EvaluationProsAndCons evaluation={e} />

        <DefaultEvaluation evaluation={e} />
      </SizeWrapper>
    </div>
  );
}
