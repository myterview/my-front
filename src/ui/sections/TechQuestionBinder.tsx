"use client";

import Bookmark from "../components/Bookmark/Bookmark";
import { Card } from "../components/CardComponent/Card";
import { Tags } from "../components/Chips/Tags";
import { TechQuestionClient } from "@/api/tech-question.client";
import { TechQuestion } from "@/shared/domains/TechQuestion";
import { useIntersectionQuery } from "@/shared/utils/useIntersectionQuery";
import { useQueryParams } from "@/shared/utils/useQueryParams";
import { For } from "@ilokesto/utilinent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { neato } from "neato";

export function TechQuestionBinder() {
  const { selectedQueryParams: tags } = useQueryParams("tag");
  const { selectedQueryParams: tqOptions } = useQueryParams("tq-option");
  const queryClient = useQueryClient();
  const techQuestion = new TechQuestionClient();
  const { ref, data } = useIntersectionQuery(
    techQuestion.getTechQuestionList({
      isBookmarked: tqOptions.includes("북마크"),
      isAnswered: tqOptions.includes("답변한 질문"),
      tags,
    })
  );
  const { mutate } = useMutation(
    techQuestion.postTechQuestionBookmark({ queryClient })
  );

  return (
    <div className="grid grid-cols-1 gap-24 @xl/main:grid-cols-2 @4xl/main:grid-cols-3">
      <For
        each={data?.pages
          ?.flatMap((page) => page.questions)
          .map((item) => new TechQuestion(item))}
      >
        {(techQuestion) => {
          return (
            <Card
              key={techQuestion.id}
              className={neato(
                "border-l-8 pl-24 space-y-32 relative",
                techQuestion.isUserAnswered
                  ? "border-secondary bg-white"
                  : "border-primary-100 bg-white"
              )}
            >
              <Bookmark
                active={techQuestion.isUserBookmarked}
                mutate={techQuestion.toggleBookmark(mutate)}
                className="absolute -top-4 right-8"
              />

              <Card.Title className="text-base/24 font-bold line-clamp-2 h-48">
                {techQuestion.question}
              </Card.Title>

              <Tags each={techQuestion.tags} />
            </Card>
          );
        }}
      </For>

      <div ref={ref} />
    </div>
  );
}
