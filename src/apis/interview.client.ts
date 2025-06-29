import { infiniteQueryOptions } from "@tanstack/react-query";
import { thisBind } from "./decorators/thisBind";
import { Fetcher } from "./Fetcher";

@thisBind
export class InterviewClient extends Fetcher {
  public InfiniteInterviewList = () =>
    infiniteQueryOptions({
      queryKey: ["interviewList"],
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
            .find((item) => !item.evaluation && item.isActive)
        ) {
          return 30000;
        }
        return false;
      },
    });
}
