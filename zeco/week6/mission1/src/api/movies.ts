import axios from 'axios';
import type { MovieResponse, MovieDetail, Credits } from '../types/movie';

const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
    accept: 'application/json',
  },
});

export const fetchMovies = async (category: string, page: number): Promise<MovieResponse> => {
  const { data } = await tmdbClient.get<MovieResponse>(`/movie/${category}`, {
    params: { language: 'ko-KR', page },
  });
  return data;
};

export const fetchMovieDetail = async (movieId: string): Promise<MovieDetail> => {
  const { data } = await tmdbClient.get<MovieDetail>(`/movie/${movieId}`, {
    params: { language: 'ko-KR' },
  });
  return data;
};

export const fetchMovieCredits = async (movieId: string): Promise<Credits> => {
  const { data } = await tmdbClient.get<Credits>(`/movie/${movieId}/credits`, {
    params: { language: 'ko-KR' },
  });
  return data;
};
