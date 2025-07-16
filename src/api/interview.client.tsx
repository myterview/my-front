import { BackendResponse } from "@/shared/types/response";
import { FeedbackModal } from "@/ui/components/Modal/FeedbackModal";
import { ModalWrapper } from "@/ui/components/Modal/ModalWrapper";
import { grunfeld } from "@ilokesto/grunfeld";
import {
    QueryClient
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
        return this.fetcher.get("interview", {
          query: {
            take: String(pageParam.take),
            skip: String(pageParam.skip),
          },
        },
        {
          credentials: "include", // 쿠키를 포함하여 요청
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

  public getInterviewById = (sessionId: string, withMessages: boolean = true) =>
    queryOptions({
      queryKey: ["interview", sessionId],
      queryFn: () =>
        this.fetcher.get(
          "interview/{sessionId}",
          {
            query: {
              withMessages
            },
            path: {
              sessionId,
            },
          }, {
            credentials: "include", // 쿠키를 포함하여 요청
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
        this.fetcher.post(
          "interview/{sessionId}/message",
          {
            body: { message },
            path: { sessionId: interviewId },
          }, {credentials: "include",}
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
            session: BackendResponse["interview"];
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


@thisBind
export class InterviewQuery extends Fetcher {
  constructor() {
    super();
  }
  
  static get queryKeyFactory() {
    const base = ['interview'] as const;
    return {
      all: () => base,
      getInterviewById: (id: string | number) => [...base, id] as const,
    };
  }

  public getInterviewById(sessionId: string, withMessages: boolean = false) {
    return this.queryOptions({
      queryKey: InterviewQuery.queryKeyFactory.getInterviewById(sessionId),
      queryFn: () => this.fetcher.get("interview/{sessionId}", {
          query: { withMessages },
          path: { sessionId },
        })
    });
  }
}

