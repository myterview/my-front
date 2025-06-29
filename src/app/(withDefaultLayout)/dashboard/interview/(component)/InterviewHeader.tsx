import { Card } from "@/components/Binder/Card";
import {
  InterviewPositionKr,
  InterviewExperienceKr,
} from "@/hooks/sicilian/interviewForm";
import { components } from "@/types/api";
import { getEnumValueByKey } from "@/utils/enumUtils";
import { toKST } from "@/utils/toKST";

export function InterviewHeader({
  interview,
}: {
  interview: components["schemas"]["InterviewSession"];
}) {
  return (
    <div className="shadow-custom">
      <header className="mx-auto w-full max-w-1160 px-40 pt-64 pb-48">
        <div className="w-fit min-w-400 space-y-8">
          <Card.Title>{interview.title}</Card.Title>
          <div className="flex items-center justify-between">
            <Card.subTitle>{toKST(interview.createdAt)}</Card.subTitle>
            <Card.Tags
              each={[
                getEnumValueByKey(InterviewPositionKr, interview.position),
                getEnumValueByKey(InterviewExperienceKr, interview.experience),
              ]}
            />
          </div>
        </div>
      </header>
    </div>
  );
}
