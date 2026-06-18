import { useQuery } from '@tanstack/react-query';
import { getLpDetail } from '../apis/lp';
import { QUERY_KEY } from '../utils/constants/queryKeys';

export function useGetLpDetail(lpId: number | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY.LP_DETAIL, lpId],
    queryFn: () => getLpDetail(lpId!),
    enabled: !!lpId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    select: (data) => data,
  });
}
