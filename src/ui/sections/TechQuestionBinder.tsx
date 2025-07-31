"use client";

import { Card } from "../components/CardComponent/Card";
import { Tags } from "../components/Chips/Tags";
import { TechQuestionClient } from "@/api/tech-question.client";
import { useQueryParams } from "@/shared/utils/useQueryParams";
import { For } from "@ilokesto/utilinent";
import { useInfiniteQuery } from "@tanstack/react-query";
import { neato } from "neato";

export function TechQuestionBinder() {
  const { selectedQueryParams: tags } = useQueryParams("tag");
  const { selectedQueryParams: tqOptions } = useQueryParams("tq-option");

  const { data, fetchNextPage } = useInfiniteQuery(
    new TechQuestionClient().getTechQuestionList({
      isBookmarked: tqOptions.includes("북마크"),
      isAnswered: tqOptions.includes("답변한 질문"),
      tags,
    })
  );

  const page = data?.pages.flatMap((page) => page.questions);

  return (
    <For each={page}>
      {({ id, question, tags }) => (
        <Card key={id} className={neato("border-l-8 pl-24 space-y-32", {})}>
          <Card.Title className="text-base/24 font-bold">{question}</Card.Title>
          <Tags each={tags} />
        </Card>
      )}
    </For>
  );
}
