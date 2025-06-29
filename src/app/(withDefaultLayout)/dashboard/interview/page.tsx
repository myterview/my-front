// import { SearchParams } from "next/dist/server/request/search-params";
import { For } from "utilinent";
import { InterviewForm } from "./(component)/InterviewForm";
import { InterviewQuery } from "@/apis/interview.query";
import { Card } from "@/components/Binder/Card";
import { ProgressStatus } from "@/components/Binder/Card";
import { getEnumValueByKey } from "@/utils/enumUtils";
import {
  InterviewExperienceKr,
  InterviewPositionKr,
} from "@/hooks/sicilian/interviewForm";
import { neato } from "neato";

export default async function Home() {
  const interview = new InterviewQuery();

  return (
    <>
      <h2 className="heading-01">기술 인터뷰</h2>

      <div className="mt-24 mb-60 space-y-12">
        <h3 className="heading-02">인터뷰 생성하기</h3>
        <p className="heading-03">
          직군과 경력을 선택해 맞춤형 인터뷰를 시작해보세요.
        </p>
      </div>

      <InterviewForm />

      <div className="mt-60 mb-24 space-y-12">
        <h3 className="heading-02">나의 인터뷰</h3>
        <p className="heading-03"></p>
      </div>

      <div className="grid grid-cols-1 gap-24 md:grid-cols-2 lg:grid-cols-3">
        <For each={await interview.getInterview()}>
          {(interview) => (
            <Card
              key={interview.id}
              className={neato(
                "border-l-8 pl-24",
                getStatusByActiveAndEvaluation(interview) ===
                  ProgressStatus.IN_PROGRESS && "border-secondary bg-white",
                getStatusByActiveAndEvaluation(interview) ===
                  ProgressStatus.ANALYZING && "border-gray-200 bg-gray-100",
                getStatusByActiveAndEvaluation(interview) ===
                  ProgressStatus.COMPLETED && "border-blue-100 bg-white"
              )}
            >
              <Card.Title>{interview.title}</Card.Title>
              <div className="mt-8 mb-72 flex items-center justify-between">
                <Card.subTitle>{interview.createdAt}</Card.subTitle>
                <Card.ProgressChip>
                  {getStatusByActiveAndEvaluation(interview)}
                </Card.ProgressChip>
              </div>
              <Card.Tags
                each={[
                  getEnumValueByKey(InterviewPositionKr, interview.position),
                  getEnumValueByKey(
                    InterviewExperienceKr,
                    interview.experience
                  ),
                ]}
              />
            </Card>
          )}
        </For>
      </div>
    </>
  );
}

function getStatusByActiveAndEvaluation({
  isActive,
  evaluation,
}: {
  isActive: boolean;
  evaluation?: unknown;
}): ProgressStatus {
  // isActive가 true이면 무조건 진행중

  if (isActive) {
    return ProgressStatus.IN_PROGRESS;
  }

  if (evaluation) {
    return ProgressStatus.ANALYZING;
  }

  return ProgressStatus.COMPLETED;
}
