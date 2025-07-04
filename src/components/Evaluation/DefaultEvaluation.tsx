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
    <div className="space-y-48 relative">
      <div className="heading-02">종합 평가</div>

      <Image
        src={`/icons/evaluation/paw/${evaluation.overallAssessment.recommendation}.svg`}
        alt={evaluation.overallAssessment.recommendation}
        width={160}
        height={160}
        className="absolute -top-24 -right-12 opacity-70 -rotate-40 z-10"
        draggable={false}
      />

      <For each={OVERALL_ARRAY}>
        {({ name, value }) => (
          <div key={name}>
            <h5 className="heading-03">{name}</h5>
            <p className="text-lg/32 break-keep font-nanum font-bold">
              {value}
            </p>
          </div>
        )}
      </For>
    </div>
  );
}

export enum EvaluationKeysKr {
  technicalExpertise = "기술 전문성",
  projectExperience = "프로젝트 경험",
  problemSolving = "문제 해결력",
  communication = "커뮤니케이션 능력",
  codeQuality = "코드 품질",
  growthPotential = "성장 가능성",
}

export function DefaultEvaluationRadar({
  evaluation,
}: Pick<DefaultEvaluationProps, "evaluation">) {
  const RADAR_ARRAY = [
    {
      name: EvaluationKeysKr.technicalExpertise,
      value: evaluation.technicalExpertise.score,
    },
    {
      name: EvaluationKeysKr.projectExperience,
      value: evaluation.projectExperience.score,
    },
    {
      name: EvaluationKeysKr.problemSolving,
      value: evaluation.problemSolving.score,
    },
    {
      name: EvaluationKeysKr.communication,
      value: evaluation.communication.score,
    },
    {
      name: EvaluationKeysKr.codeQuality,
      value: evaluation.codeQuality.score,
    },
    {
      name: EvaluationKeysKr.growthPotential,
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
      name: EvaluationKeysKr.technicalExpertise,
      image: "/icons/evaluation/technical-expertise.svg",
      value: evaluation.technicalExpertise.score,
      analysis: evaluation.technicalExpertise.analysis,
    },
    {
      name: EvaluationKeysKr.projectExperience,
      image: "/icons/evaluation/project-experience.svg",
      value: evaluation.projectExperience.score,
      analysis: evaluation.projectExperience.analysis,
    },
    {
      name: EvaluationKeysKr.problemSolving,
      image: "/icons/evaluation/problem-solving.svg",
      value: evaluation.problemSolving.score,
      analysis: evaluation.problemSolving.analysis,
    },
    {
      name: EvaluationKeysKr.communication,
      image: "/icons/evaluation/communication.svg",
      value: evaluation.communication.score,
      analysis: evaluation.communication.analysis,
    },
    {
      name: EvaluationKeysKr.codeQuality,
      image: "/icons/evaluation/code-quality.svg",
      value: evaluation.codeQuality.score,
      analysis: evaluation.codeQuality.analysis,
    },
    {
      name: EvaluationKeysKr.growthPotential,
      image: "/icons/evaluation/growth-potential.svg",
      value: evaluation.growthPotential.score,
      analysis: evaluation.growthPotential.analysis,
    },
  ];

  return (
    <div className="space-y-24">
      <For each={EVALUATION_ARRAY}>
        {({ name, value, image, analysis }) => (
          <div key={name} className="shadow-custom px-12 py-8 rounded-[12]">
            <h5
              className={neato("flex items-center heading-03 justify-between")}
            >
              <span className="flex gap-4 items-center">
                <Image
                  src={image}
                  alt={name}
                  width={20}
                  height={20}
                  draggable={false}
                />
                {name}
              </span>

              <EvaluationScore value={value} />
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

export function EvaluationScore({ value }: { value: number }) {
  return (
    <div
      className={neato(
        "rounded-[12] px-12 py-8 text-base/16 font-bold text-white w-fit",
        value >= 80 && "bg-green-500",
        value >= 50 && value < 80 && "bg-yellow-400",
        value < 50 && "bg-red-500"
      )}
    >
      {value}점
    </div>
  );
}
