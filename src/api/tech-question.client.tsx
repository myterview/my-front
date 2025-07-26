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

  public getTechQuestionList = ({isBookmarked, isAnswered, tags}: {isBookmarked: boolean, isAnswered: boolean, tags: Array<string>}) => this.infiniteQueryOptions({
    queryKey: ["tech-question"],
    queryFn: ({
        pageParam: { take, skip },
      }: {
        pageParam: { take: number; skip: number };
      }) => this.fetcher.get("tech-question", {
        query: {
          take,
          skip,
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

  public postTechQuestionBookmark = () => this.mutationOptions({
    mutationFn: ({ questionId, isBookmarked }: { questionId: string, isBookmarked: boolean }) => this.fetcher.post("tech-question/{questionId}/bookmark", {
      path: { questionId },
      query: { isBookmarked }
    })
  })

  public postTechAnswer = () => this.mutationOptions({
    mutationFn: ({ questionId, userAnswer }: {questionId: string, userAnswer: string}) => this.fetcher.post("tech-question/{questionId}/answer", {
      path: { questionId },
      body: { userAnswer }
    })
  })
}
