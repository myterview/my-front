import {
  DefaultError,
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { useIntersectionObserver } from "usehooks-ts";

export function useIntersectionQuery<
  TQueryFnData,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  queryOptions: UseInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >
) {
  const { isIntersecting, ref } = useIntersectionObserver();
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery(queryOptions);

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return { ref, data };
}
