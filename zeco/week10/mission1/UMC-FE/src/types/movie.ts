// TMDB 검색 결과 한 건 (https://developer.themoviedb.org/reference/search-movie)
export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  adult: boolean;
  popularity: number;
}

export interface MovieSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// 미션 요구: 한국어 / 영어 / 일본어
export type MovieLanguage = 'ko-KR' | 'en-US' | 'ja-JP';
