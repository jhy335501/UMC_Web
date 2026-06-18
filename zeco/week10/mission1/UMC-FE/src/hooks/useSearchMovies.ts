import { useQuery } from '@tanstack/react-query';
import { searchMovies } from '../apis/tmdb';
import { QUERY_KEY } from '../utils/constants/queryKeys';
import type { MovieLanguage } from '../types/movie';

interface UseSearchMoviesParams {
  query: string;
  includeAdult: boolean;
  language: MovieLanguage;
  enabled?: boolean;
}

export function useSearchMovies({
  query,
  includeAdult,
  language,
  enabled = true,
}: UseSearchMoviesParams) {
  return useQuery({
    // 검색어/성인포함/언어가 바뀌면 캐시가 분리되도록 queryKey에 모두 포함
    queryKey: [QUERY_KEY.MOVIE_SEARCH, query, includeAdult, language],
    queryFn: () => searchMovies({ query, includeAdult, language }),
    enabled: enabled && query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    select: (data) => data.results,
  });
}
