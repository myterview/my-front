import { components } from "@/shared/types";
import { QueryClient } from "@tanstack/react-query";
import { thisBind } from "./decorators/thisBind";
import { Fetcher } from "./Fetcher";

@thisBind
export class TechQuestionClient extends Fetcher {
  public getTechAnswerList = ({ questionId }: { questionId: string }) => this.queryOptions({
    queryKey: ["tech-question", "answer", questionId],
    queryFn: () => this.fetcher.get("tech-question/{questionId}/answer", {
      path: { questionId } // 현재 사용자의 질문 ID를 사용
    })
  })


  public getTags = () => this.queryOptions({
    queryKey: ["tech-question", "tags"],
    queryFn: () => this.fetcher.get("tech-question/tags")
  })

  public getTechQuestionList = ({isBookmarked, isAnswered, tags}: {isBookmarked: boolean, isAnswered: boolean, tags: Array<string>}) => this.infiniteQueryOptions({
    queryKey: ["tech-question", "list"],
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

  public postTechQuestionBookmark = ({ questionId, queryClient }: { questionId: string, queryClient: QueryClient; }) => this.mutationOptions({
    mutationFn: ({ isBookmarked }: { isBookmarked: boolean }) => this.fetcher.post("tech-question/{questionId}/bookmark", {
      path: { questionId },
      query: { isBookmarked }
    }),
    onMutate: async ({ isBookmarked }) => {
      await queryClient.cancelQueries({ queryKey: ["tech-question", "list"] });
      const previousData = queryClient.getQueryData(["tech-question", "list"]);
      queryClient.setQueryData(["tech-question", "list"], (old: {
        count: number;
        questions: components["schemas"]["TechQuestionDTO"][];
      }[]) => {
        return old.map(({count, questions}) => ({count, questions: questions.map((question) => ({...question, isUserBookmarked: question.id === questionId ? isBookmarked : question.isUserBookmarked}))}))
      });
      return { previousData };
    },
    onError(error) {
      console.error(error);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["tech-question", "list"], refetchType: "all" });
    }
  })

  public postTechAnswer = (({ questionId, queryClient }: { questionId: string, queryClient: QueryClient; }) => this.mutationOptions({
    mutationFn: ({ userAnswer }: { userAnswer: string }) => this.fetcher.post("tech-question/{questionId}/answer", {
      path: { questionId },
      body: { userAnswer }
    }),
    onError(error) {
      console.error(error);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["tech-question"], refetchType: "all" });
    }
  }))
}
