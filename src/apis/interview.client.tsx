import {
  infiniteQueryOptions,
  QueryClient,
  queryOptions,
} from "@tanstack/react-query";
import { thisBind } from "./decorators/thisBind";
import { Fetcher } from "./Fetcher";
import { mutationOptions } from "@/utils/m";
import { components } from "@/types/api";
import { Dispatch, SetStateAction } from "react";
import { grunfeld } from "grunfeld";
import { ModalWrapper } from "@/components/Modal/ModalWrapper";

@thisBind
export class InterviewClient extends Fetcher {
  public InfiniteInterviewList = () =>
    infiniteQueryOptions({
      queryKey: ["interview", "list"],
      queryFn: ({
        pageParam,
      }: {
        pageParam: { take: number; skip: number };
      }) => {
        return this.clientFetcher.get("interview", {
          credentials: "include", // 쿠키를 포함하여 요청
          searchParams: {
            take: pageParam.take,
            skip: pageParam.skip,
          },
        });
      },
      initialPageParam: { take: 12, skip: 0 },
      getNextPageParam: (lastPage, _, lastPageParam) => {
        if (!lastPage.hasNext) return undefined;
        return {
          take: 12,
          skip: lastPageParam.skip + 12,
        };
      },
      refetchInterval: (query) => {
        if (
          query.state.data?.pages
            .flatMap((page) => page.items)
            .find((item) => !item.evaluation && !item.isActive)
        ) {
          return 10000;
        }
        return false;
      },
    });

  public getInterviewById = (interviewId: string) =>
    queryOptions({
      queryKey: ["interview", interviewId],
      queryFn: () =>
        this.clientFetcher.get(
          `interview/${interviewId}` as "interview/{sessionId}",
          {
            credentials: "include",
          }
        ),
    });

  public postInterviewMessage = ({
    interviewId,
    queryClient,
    setIsLoading,
  }: {
    interviewId: string;
    queryClient: QueryClient; // Optional query client for refetching
    setIsLoading: Dispatch<SetStateAction<boolean>>;
  }) =>
    mutationOptions({
      mutationFn: ({ message }: { message: string }) =>
        this.clientFetcher.post(
          `interview/${interviewId}/message` as "interview/{sessionId}/message",
          {
            json: { message },
            credentials: "include",
          }
        ),
      onMutate: async ({ message }) => {
        setIsLoading(true);
        await queryClient.cancelQueries({
          queryKey: ["interview", interviewId],
        });

        const prevState = queryClient.getQueryData(["interview", interviewId]);

        queryClient.setQueryData(
          ["interview", interviewId],
          (oldData: {
            success: true;
            session: components["schemas"]["InterviewSession"];
          }) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              session: {
                ...oldData.session,
                messages: [
                  ...oldData.session.messages,
                  {
                    id: crypto.randomUUID(),
                    content: message,
                    createdAt: new Date().toISOString(),
                    type: "human",
                  },
                ],
              },
            };
          }
        );

        return { prevState };
      },
      onError(error) {
        console.error(error);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ["interview", "List"],
          refetchType: "all",
        });
        queryClient.invalidateQueries({
          queryKey: ["interview", interviewId],
          refetchType: "all",
        });
        setIsLoading(false);
        if (data?.isFinished) {
          grunfeld.add({
            element: <ModalWrapper>면접이 종료되었습니다.</ModalWrapper>,
          });
        }
      },
    });
}
