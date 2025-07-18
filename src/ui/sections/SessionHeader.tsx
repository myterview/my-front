"use client";

import { DateTime, DateTimeDomain } from "@/shared/domains/DateTime";
import { EvaluationHeader } from "@/ui/components/Evaluation/EvaluationHeader";
import { SizeWrapper } from "@/ui/components/SizeWrapper/SizeWrapper";
import { useRouter } from "next/navigation";

export function SessionHeader({
  title,
  createdAt,
  tags,
}: {
  title: string;
  createdAt: DateTimeDomain | string;
  tags: string[];
}) {
  const router = useRouter();

  return (
    <div className="shadow-custom">
      <SizeWrapper asChild="header">
        <EvaluationHeader
          className="pb-48 space-y-8 pt-52"
          onClose={router.back}
          title={title}
          createdAt={
            createdAt instanceof DateTime
              ? createdAt.format()
              : new DateTime(createdAt as string).format()
          }
          tags={tags}
        />
      </SizeWrapper>
    </div>
  );
}
