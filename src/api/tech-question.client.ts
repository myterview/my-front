import { TechQuestionModalStep } from "@/ui/sections/TechQuestionModal";
import { QueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { thisBind } from "./decorators/thisBind";
import { Fetcher } from "./Fetcher";

@thisBind
export class TechQuestionClient extends Fetcher {
  public getTechAnswerList = ({ questionId }: { questionId: string }) => this.queryOptions({
    queryKey: ["tech-question", "answer", questionId],
    queryFn: () => this.fetcher.get("tech-question/{questionId}/answer", {
      path: { questionId } // 현재 사용자의 질문 ID를 사용
    }, {
      credentials: "include",
    })
  })

  public getTags = () => this.queryOptions({
    queryKey: ["tech-question", "tags"],
    queryFn: () => this.fetcher.get("tech-question/tags")
  })

  public getTechQuestionList = ({isBookmarked = false, isAnswered = false, tags }: {isBookmarked: boolean, isAnswered: boolean, tags: Array<string>}) => this.infiniteQueryOptions({
    queryKey: ["tech-question", "list", { isBookmarked, isAnswered, tags }],
    queryFn: ({
        pageParam,
      }: {
        pageParam: { take: number; skip: number };
      }) => this.fetcher.get("tech-question", {
        query: {
          ...pageParam,
          isBookmarked,
          isAnswered,
          tags
        },
      }, {
        credentials: "include",
      }),
    initialPageParam: { take: 12, skip: 0 },
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      const count = lastPage.count;
      const take = lastPageParam.take;
      const loaded = pages.reduce((acc, page) => acc + page.questions.length, 0);

      if (loaded < count) return { take, skip: loaded };
      else return undefined;
    }
  })

  public postTechQuestionBookmark = ({ queryClient }: {  queryClient: QueryClient, }) => this.mutationOptions({
    mutationFn: ({ isBookmarked, questionId }: { questionId: string, isBookmarked: boolean }) => this.fetcher.post("tech-question/{questionId}/bookmark", {
      path: { questionId },
      query: { isBookmarked }
    }, {
      credentials: "include",
    }),
    onError(error) {
      console.error(error);
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["tech-question", "list"],
        exact: false, 
        refetchType: "all"
      });
    }
  })

  public postTechAnswer = (({ questionId, queryClient, setStep }: { questionId: string, queryClient: QueryClient; setStep: Dispatch<SetStateAction<TechQuestionModalStep>> }) => this.mutationOptions({
    mutationFn: ({ userAnswer }: { userAnswer: string }) => this.fetcher.post("tech-question/{questionId}/answer", {
      path: { questionId },
      body: { userAnswer }
    }, {
      credentials: "include",
      timeout: 100000,
    }),
    onMutate() {
      setStep("submitting");
    },
    onError(error) {
      console.error(error);
      setStep("form");
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["tech-question"], refetchType: "all" });
      setStep("result");
    }
  }))
}
