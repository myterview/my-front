import { components } from "@/types";
import { FeedbackModal } from "@/ui/components/Modal/FeedbackModal";
import { ModalWrapper } from "@/ui/components/Modal/ModalWrapper";
import { grunfeld } from "@ilokesto/grunfeld";
import {
  QueryClient,
} from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { thisBind } from "./decorators/thisBind";
import {
  Fetcher,
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
} from "./Fetcher";

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
        return this.onClient.get("interview", {
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

  public getInterviewById = (interviewId: string, withMessages: boolean = true) =>
    queryOptions({
      queryKey: ["interview", interviewId],
      queryFn: () =>
        this.onClient.get(
          `interview/${interviewId}` as "interview/{sessionId}",
          {
            credentials: "include",
            searchParams: {
              withMessages
            }
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
        this.onClient.post(
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
                  ...(oldData.session.messages ?? []),
                  {
                    id: crypto.randomUUID(),
                    content: message,
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
          queryKey: ["interview", "list"],
          refetchType: "all",
        });
        queryClient.invalidateQueries({
          queryKey: ["interview", interviewId],
          refetchType: "all",
        });
        setIsLoading(false);
        if (data?.isFinished) {
          grunfeld.add(() =>
            <ModalWrapper>
              <ModalWrapper.Title title="피드백" />
              <FeedbackModal />
            </ModalWrapper>
          );
        }
      },
    });
}
