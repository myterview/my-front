import { InterviewQuery } from "@/api/interview.serverQuery";
import { getEnumValueByKey } from "@/shared/utils/enumUtils";
import { EvaluationProps } from "@/types";
import {
  DefaultEvaluation,
  DefaultEvaluationOverall,
  DefaultEvaluationRadar,
} from "@/ui/components/Evaluation/DefaultEvaluation";
import { UserInterviewProsAndCons } from "@/ui/components/Evaluation/MyProsAndCons";
import { SizeWrapper } from "@/ui/components/SizeWrapper/SizeWrapper";
import { SessionHeader } from "@/ui/sections/SessionHeader";
import { neato } from "neato";

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
    <main className="flex flex-col h-dvh">
      <SessionHeader
        title={session.title}
        createdAt={session.createdAt}
        tags={[
          getEnumValueByKey(session.position),
          getEnumValueByKey(session.experience),
        ]}
      />

      <div
        className={neato(
          "@container/main flex flex-col overflow-y-scroll gap-48 py-48"
        )}
      >
        <SizeWrapper
          asChild={"div"}
          className={neato(
            "flex flex-col gap-56",
            "@4xl/main:flex-row-reverse"
          )}
        >
          <DefaultEvaluationOverall evaluation={e} />

          <DefaultEvaluationRadar evaluation={e} />
        </SizeWrapper>

        <SizeWrapper
          asChild={"div"}
          className={neato("px-0", "@5xl/main:px-40")}
        >
          <UserInterviewProsAndCons evaluation={e} />
        </SizeWrapper>

        <SizeWrapper asChild={"div"}>
          <DefaultEvaluation evaluation={e} />
        </SizeWrapper>
      </div>
    </main>
  );
}
