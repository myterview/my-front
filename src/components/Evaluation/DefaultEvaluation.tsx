import { Radar } from "../Charts/Radar";
import { components } from "@/types/api";
import { For } from "@ilokesto/utilinent";
import { neato } from "neato";
import Image from "next/image";

export type DefaultEvaluationProps = {
  evaluation: components["schemas"]["EvaluationDto"];
  evaluationType: "default";
};

export function DefaultEvaluationOverall({
  evaluation,
}: Pick<DefaultEvaluationProps, "evaluation">) {
  const OVERALL_ARRAY = [
    { name: "분석", value: evaluation.overallAssessment.analysis },
    { name: "결론", value: evaluation.overallAssessment.finalNotes },
  ];

  return (
    <div>
      <div className="heading-02">종합 평가</div>

      <For each={OVERALL_ARRAY}>
        {({ name, value }) => (
          <div key={name} className="space-y-48">
            <h5 className="heading-03">{name}</h5>
            <hr className="my-4 border-t-1 border-gray-200" />
            <p className="text-lg/32 break-keep font-nanum font-bold">
              {value}
            </p>
          </div>
        )}
      </For>
    </div>
  );
}

export function DefaultEvaluationRadar({
  evaluation,
}: Pick<DefaultEvaluationProps, "evaluation">) {
  const RADAR_ARRAY = [
    {
      name: "기술 전문성",
      value: evaluation.technicalExpertise.score,
    },
    {
      name: "프로젝트 경험",

      value: evaluation.projectExperience.score,
    },
    {
      name: "문제 해결력",

      value: evaluation.problemSolving.score,
    },
    {
      name: "커뮤니케이션 능력",

      value: evaluation.communication.score,
    },
    {
      name: "코드 품질",

      value: evaluation.codeQuality.score,
    },
    {
      name: "성장 가능성",
      value: evaluation.growthPotential.score,
    },
  ];

  return <Radar data={RADAR_ARRAY} />;
}

export function DefaultEvaluation({
  evaluation,
}: Pick<DefaultEvaluationProps, "evaluation">) {
  const EVALUATION_ARRAY = [
    {
      name: "기술 전문성",
      image: "/icons/evaluation/technical-expertise.svg",
      value: evaluation.technicalExpertise.score,
      analysis: evaluation.technicalExpertise.analysis,
    },
    {
      name: "프로젝트 경험",
      image: "/icons/evaluation/project-experience.svg",
      value: evaluation.projectExperience.score,
      analysis: evaluation.projectExperience.analysis,
    },
    {
      name: "문제 해결력",
      image: "/icons/evaluation/problem-solving.svg",
      value: evaluation.problemSolving.score,
      analysis: evaluation.problemSolving.analysis,
    },
    {
      name: "커뮤니케이션 능력",
      image: "/icons/evaluation/communication.svg",
      value: evaluation.communication.score,
      analysis: evaluation.communication.analysis,
    },
    {
      name: "코드 품질",
      image: "/icons/evaluation/code-quality.svg",
      value: evaluation.codeQuality.score,
      analysis: evaluation.codeQuality.analysis,
    },
    {
      name: "성장 가능성",
      image: "/icons/evaluation/growth-potential.svg",
      value: evaluation.growthPotential.score,
      analysis: evaluation.growthPotential.analysis,
    },
  ];

  return (
    <div className="space-y-48">
      <For each={EVALUATION_ARRAY}>
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
  );
}
