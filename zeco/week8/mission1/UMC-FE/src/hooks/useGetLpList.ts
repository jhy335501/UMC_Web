import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getLps } from '../apis/lp';
import { QUERY_KEY } from '../utils/constants/queryKeys';
import type { LpOrder } from '../types/lp';

interface UseGetLpListParams {
  order: LpOrder;
  search?: string;
  limit?: number;
  refetchInterval?: number | false;
}

export function useGetLpList({
  order,
  search = '',
  limit = 20,
  refetchInterval = false,
}: UseGetLpListParams) {
  return useQuery({
    queryKey: [QUERY_KEY.LP_LIST, order, search],
    queryFn: () => getLps({ order, limit, search: search || undefined }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData,
    refetchInterval,
    select: (data) => data.data,
  });
}
