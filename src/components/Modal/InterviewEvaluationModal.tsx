import { Card } from "../Binder/Card";
import { Radar } from "../Charts/Radar";
import { Donate } from "../Donate/Donate";
import {
  InterviewExperienceKr,
  InterviewPositionKr,
} from "@/hooks/sicilian/interviewForm";
import { components } from "@/types/api";
import { getEnumValueByKey } from "@/utils/enumUtils";
import { toKST } from "@/utils/toKST";
import { For } from "@ilokesto/utilinent";
import { neato } from "neato";
import Image from "next/image";

type EvaluationProps =
  | {
      evaluation: components["schemas"]["EvaluationDto"];
      evaluationType: "default";
    }
  | {
      evaluation?: undefined;
      evaluationType?: undefined;
    };

export function InterviewEvaluationModal({
  evaluation,
  evaluationType,
  createdAt,
  position,
  experience,
}: components["schemas"]["InterviewSession"]) {
  const { evaluation: e, evaluationType: eT } = {
    evaluation,
    evaluationType,
  } as EvaluationProps;

  if (!eT) {
    return;
  }

  const DETAIL_ARRAY = [
    {
      name: "기술 전문성",
      image: "/icons/evaluation/technical-expertise.svg",
      value: e.technicalExpertise.score,
      analysis: e.technicalExpertise.analysis,
    },
    {
      name: "프로젝트 경험",
      image: "/icons/evaluation/project-experience.svg",
      value: e.projectExperience.score,
      analysis: e.projectExperience.analysis,
    },
    {
      name: "문제 해결력",
      image: "/icons/evaluation/problem-solving.svg",
      value: e.problemSolving.score,
      analysis: e.problemSolving.analysis,
    },
    {
      name: "커뮤니케이션 능력",
      image: "/icons/evaluation/communication.svg",
      value: e.communication.score,
      analysis: e.communication.analysis,
    },
    {
      name: "코드 품질",
      image: "/icons/evaluation/code-quality.svg",
      value: e.codeQuality.score,
      analysis: e.codeQuality.analysis,
    },
    {
      name: "성장 가능성",
      image: "/icons/evaluation/growth-potential.svg",
      value: e.growthPotential.score,
      analysis: e.growthPotential.analysis,
    },
  ];

  const OVERALL_ARRAY = [
    { name: "분석", value: e.overallAssessment.analysis },
    { name: "결론", value: e.overallAssessment.finalNotes },
  ];

  return (
    <div className="flex flex-col gap-60">
      <div className="flex items-center justify-between">
        <Card.subTitle>{toKST(createdAt)}</Card.subTitle>
        <Card.Tags
          each={[
            getEnumValueByKey(InterviewPositionKr, position),
            getEnumValueByKey(InterviewExperienceKr, experience),
          ]}
        />
      </div>

      <Donate />

      <div>
        <div className="heading-02">종합 평가</div>

        <For each={OVERALL_ARRAY}>
          {({ name, value }) => (
            <div key={name} className="mt-16">
              <h5 className="heading-03">{name}</h5>
              <p className="text-lg/32 break-keep font-nanum font-bold">
                {value}
              </p>
            </div>
          )}
        </For>
      </div>

      <Radar data={DETAIL_ARRAY} />

      <div className="space-y-48">
        <For each={DETAIL_ARRAY}>
          {({ name, value, image, analysis }) => (
            <div key={name}>
              <h5 className={neato("flex items-center gap-4 heading-03")}>
                <Image
                  src={image}
                  alt={name}
                  width={20}
                  height={20}
                  draggable={false}
                />
                {name} -{" "}
                <span
                  className={neato(
                    value >= 80 && "text-green-500",
                    value >= 50 && value < 80 && "text-yellow-400",
                    value < 50 && "text-red-500"
                  )}
                >
                  {value}점
                </span>
              </h5>

              <hr className="my-4 border-t-1 border-gray-200" />

              <p className="text-lg/32 break-keep font-nanum font-bold">
                {analysis}
              </p>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
