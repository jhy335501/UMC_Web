import { useInfiniteQuery } from '@tanstack/react-query';
import { getLps } from '../apis/lp';
import { QUERY_KEY } from '../utils/constants/queryKeys';
import type { LpOrder } from '../types/lp';

const LIMIT = 12;

interface UseGetLpListInfiniteParams {
  order: LpOrder;
  search?: string;
  enabled?: boolean;
}

export function useGetLpListInfinite({ order, search = '', enabled = true }: UseGetLpListInfiniteParams) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.LP_LIST, 'infinite', order, search],
    queryFn: ({ pageParam }) =>
      getLps({
        order,
        limit: LIMIT,
        search: search || undefined,
        cursor: pageParam,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled,
  });
}
