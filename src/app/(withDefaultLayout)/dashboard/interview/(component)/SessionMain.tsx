"use client";

import { InterviewClient } from "@/apis/interview.client";
import { ChatBox } from "@/components/ChatBox/ChatBox";
import { SizeWrapper } from "@/components/SizeWrapper/SizeWrapper";
import { useInterviewLoading } from "@/hooks/caro-kann/useInterviewLoading";
import { components } from "@/types";
import { For, Show } from "@ilokesto/utilinent";
import {
  InfiniteData,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

export function SessionMain({ interviewId }: { interviewId: string }) {
  const isLoading = useInterviewLoading.readOnly();
  const { data } = useSuspenseQuery(
    new InterviewClient().getInterviewById(interviewId)
  );

  const messageList = data.session.messages!.reduce(
    (acc, message) => {
      const newMessage = message.content.split("\n\n");

      for (const word of newMessage) {
        const newWord = word.trim();

        if (newWord === "") continue; // 빈 문자열은 제외

        acc.push({
          ...message,
          content: newWord,
        });
      }

      return acc;
    },
    [] as Array<components["schemas"]["InterviewMessage"]>
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const queryClient = useQueryClient();

  type InterviewListData = InfiniteData<{
    hasNext: boolean;
    items: Array<components["schemas"]["InterviewSessionWithoutMessages"]>;
  }>;

  // 스크롤이 항상 맨 아래로 이동하도록 설정
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visibleCount]);

  // 인터뷰가 존재하지 않을 때만 인터뷰 목록을 새로고침
  useEffect(() => {
    const interview = queryClient.getQueryData<InterviewListData>([
      "interview",
      "list",
    ]);

    const foundInterview = interview?.pages
      .flatMap((page) => page.items)
      .find((item) => item.id === interviewId);

    if (foundInterview) {
      queryClient.invalidateQueries({
        queryKey: ["interview", "list"],
        refetchType: "all",
      });
    }
  }, [queryClient, interviewId]);

  useEffect(() => {
    // 메시지 목록이 바뀌었을 때(길이가 늘어났을 때)
    if (messageList.length > prevLengthRef.current) {
      // 기존 메시지는 바로 보여주고, 새로 추가된 메시지는 0개부터 시작
      setVisibleCount(prevLengthRef.current);
      let i = prevLengthRef.current;
      const showNext = () => {
        if (i < messageList.length) {
          setVisibleCount(i + 1);
          i++;
          setTimeout(showNext, 300); // 300ms 간격
        } else {
          prevLengthRef.current = messageList.length;
        }
      };
      showNext();
    } else if (messageList.length < prevLengthRef.current) {
      // 메시지가 줄어들면(예: 리셋) 바로 반영
      setVisibleCount(messageList.length);
      prevLengthRef.current = messageList.length;
    }
  }, [messageList.length]);

  return (
    <SizeWrapper
      asChild="div"
      className="@container/main flex flex-1 flex-col gap-8 overflow-y-scroll px-20 py-40"
      ref={scrollRef}
    >
      <For each={messageList.slice(0, visibleCount)}>
        {(message, index) => (
          <ChatBox
            key={message.content + index}
            content={message.content}
            type={message.type}
            isConnected={
              messageList[index - 1] === undefined
                ? false
                : message.type === messageList.at(index - 1)?.type
                  ? true
                  : false
            }
          />
        )}
      </For>

      <Show when={isLoading}>
        <ChatBox
          content={
            <div className="flex items-center gap-2 rounded-xl">
              <span className="bg-primary-600 animate-wave block h-8 w-8 rounded-full [animation-delay:0s]" />
              <span className="bg-primary-600 animate-wave block h-8 w-8 rounded-full [animation-delay:0.15s]" />
              <span className="bg-primary-600 animate-wave block h-8 w-8 rounded-full [animation-delay:0.3s]" />
            </div>
          }
          type={"ai"}
          isConnected={false}
        />
      </Show>
    </SizeWrapper>
  );
}
