import { DateTime } from "@/shared/utils/DateTime";
import { gradeScore } from "@/shared/utils/gradeScore";
import { components, InterviewExperienceKr, InterviewPositionKr, ProgressStatus } from "@/types";
import { FeedbackModal } from "@/ui/components/Modal/FeedbackModal";
import { ModalWrapper } from "@/ui/components/Modal/ModalWrapper";
import { filter, map, pipe, reduce } from "@fxts/core";
import { grunfeld } from "@ilokesto/grunfeld";
import {
  QueryClient,
  useQuery
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


// type TInterview = {
//   id: string;
//   userId: string;
//   title: string;    
//   position: InterviewPositionKr;
//   experience: InterviewExperienceKr;
//   isActive: boolean;
//   createdAt: DateTime;
//   messages?: components["schemas"]["InterviewMessage"][];
// } 

type DefaultInterviewEvaluation = {
  evaluationType: "default";
  evaluation: components["schemas"]["EvaluationDto"];
}

type UndefinedInterviewEvaluation = {
  evaluationType?: undefined;
  evaluation?: undefined;
}

type TInterviewEvaluation = 
  | DefaultInterviewEvaluation
  | UndefinedInterviewEvaluation;

class Interview<T extends TInterviewEvaluation> {
  public readonly id: string;
  public readonly userId: string;
  public readonly title: string;
  public readonly position: InterviewPositionKr;
  public readonly experience: InterviewExperienceKr;
  public readonly isActive: boolean;
  public readonly createdAt: DateTime;
  public readonly messages?: components["schemas"]["InterviewMessage"][];
  public readonly evaluation: InterviewEvaluation<T>

  constructor(data: {
    success: boolean;
    session: components["schemas"]["InterviewSession"];
}) {
    this.id = data.session.id;
    this.userId = data.session.userId;
    this.title = data.session.title;
    this.position = data.session.position as InterviewPositionKr;
    this.experience = data.session.experience as InterviewExperienceKr;
    this.isActive = data.session.isActive;
    this.createdAt = new DateTime(data.session.createdAt);
    this.messages = data.session.messages;
    this.evaluation = new InterviewEvaluation({
      evaluation: data.session.evaluation,
      evaluationType: data.session.evaluationType,
    } as T);
  }

  public get progressStatus(): ProgressStatus {
    if (this.isActive) return ProgressStatus.IN_PROGRESS;
    if (!this.evaluation.evaluationType) return ProgressStatus.ANALYZING;
    return ProgressStatus.COMPLETED;
  }

  public isCompleted(): boolean {
    return this.progressStatus === ProgressStatus.COMPLETED;
  }

  public isAnalyzing(): boolean {
    return this.progressStatus === ProgressStatus.ANALYZING;
  }

  public isInProgress(): boolean {
    return this.progressStatus === ProgressStatus.IN_PROGRESS;
  }
}

export class InterviewEvaluation<T extends TInterviewEvaluation> {
  public evaluation: T["evaluation"];
  public evaluationType: T["evaluationType"];

  constructor({ evaluation, evaluationType }: T) {
    this.evaluation = evaluation;
    this.evaluationType = evaluationType;
  }

  public getProsAndCons() {
    if (this.evaluationType === "default") this.extract(this.evaluation!)
  }

  private extract(evaluation: { [x: string]: { score: number } }) {
    return pipe(
      evaluation,
      Object.entries,
      filter(([key]) => key !== "overallAssessment"),
      map(([key, value]) => ({ keyName: key, score: value.score })),
      (arr) => ({
        pros: this.getPros(arr),
        cons: this.getCons(arr),
      })
    );
  }

  private getPros(
    arr: IterableIterator<{
      keyName: string;
      score: number;
    }>
  ) {
    return pipe(
      arr,
      filter((item) => item.score >= 80),
      (arr) =>
        reduce(
          (acc, item) => (!acc || item.score > acc.score ? item : acc),
          undefined as { keyName: string; score: number } | undefined,
          arr
        ),
      (item) => ({
        ...item,
        grade: gradeScore({ score: item?.score, type: "pros" }),
      })
    );
  }

  private getCons(
    arr: IterableIterator<{
      keyName: string;
      score: number;
    }>
  ) {
    return pipe(
      arr,
      filter((item) => item.score < 80),
      (arr) =>
        reduce(
          (acc, item) => (!acc || item.score < acc.score ? item : acc),
          undefined as { keyName: string; score: number } | undefined,
          arr
        ),
      (item) => ({
        ...item,
        grade: gradeScore({ score: item?.score, type: "cons" }),
      })
    );
  }
}


const interviewQuery = new InterviewQuery()

export function useGetInterviewById(sessionId: string, withMessages: boolean = false) {
  const queryResult = useQuery(interviewQuery.getInterviewById(sessionId, withMessages))
  return { ...queryResult, data: queryResult.data && new Interview(queryResult.data) }
}