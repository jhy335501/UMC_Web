import { useInfiniteQuery } from '@tanstack/react-query';
import { getComments } from '../apis/lp';
import { QUERY_KEY } from '../utils/constants/queryKeys';
import type { CommentOrder } from '../types/lp';

export function useGetLpComments(lpId: number | undefined, order: CommentOrder) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.LP_COMMENTS, lpId, order],
    queryFn: ({ pageParam }) =>
      getComments(lpId!, { limit: 10, order, cursor: pageParam }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled: !!lpId,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  });
}
