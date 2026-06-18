import axios from 'axios';
import type { MovieSearchResponse, MovieLanguage } from '../types/movie';

// TMDB v4 Access Token(Bearer) 방식. LP 백엔드용 axiosInstance와는 별개의 클라이언트.
const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
    accept: 'application/json',
  },
});

// 포스터 이미지 베이스 URL (w500 사이즈)
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// 상세 모달 상단 배경(backdrop)용 와이드 이미지 베이스 URL
export const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w780';

interface SearchMoviesParams {
  query: string;
  includeAdult: boolean;
  language: MovieLanguage;
  page?: number;
}

export const searchMovies = async ({
  query,
  includeAdult,
  language,
  page = 1,
}: SearchMoviesParams): Promise<MovieSearchResponse> => {
  const { data } = await tmdbClient.get<MovieSearchResponse>('/search/movie', {
    params: {
      query,
      include_adult: includeAdult,
      language,
      page,
    },
  });
  return data;
};
