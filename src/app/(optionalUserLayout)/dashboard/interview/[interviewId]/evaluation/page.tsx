import { InterviewQuery } from "@/api/interview.serverQuery";
import { Interview } from "@/shared/domains/Interview";
import { getEnumValueByKey } from "@/shared/utils/enumUtils";
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
  const interview = new Interview(session);

  if (interview.evaluation?.isDefaultEvaluation()) {
    return (
      <main className="flex flex-col h-dvh">
        <SessionHeader
          title={interview.title}
          createdAt={interview.createdAt}
          tags={[
            getEnumValueByKey(interview.position),
            getEnumValueByKey(interview.experience),
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
            <DefaultEvaluationOverall
              evaluation={interview.evaluation.instance.evaluation}
            />

            <DefaultEvaluationRadar
              evaluation={interview.evaluation.instance.evaluation}
            />
          </SizeWrapper>

          <SizeWrapper
            asChild={"div"}
            className={neato("px-0", "@5xl/main:px-40")}
          >
            <UserInterviewProsAndCons
              evaluation={interview.evaluation.instance.evaluation}
            />
          </SizeWrapper>

          <SizeWrapper asChild={"div"}>
            <DefaultEvaluation
              evaluation={interview.evaluation.instance.evaluation}
            />
          </SizeWrapper>
        </div>
      </main>
    );
  }
}
