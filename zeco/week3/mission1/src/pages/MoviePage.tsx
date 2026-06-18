import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Movie, MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  //1. 로딩 상태
  const [isPending, setIsPending] = useState(false);
  //2. 에러 상태
  const [isError, setIsError] = useState(false);
  //3. 페이지
  const [page, setPage] = useState(1);

  const params = useParams<{
    category: string;
  }>();

  useEffect((): void => {
    const fetchMovies = async (): Promise<void> => {
      setIsPending(true);
      try {
        const { data } = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${params.category}?language=ko-KR&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              accept: 'application/json',
            },
          },
        );

        setMovies(data.results);
        setIsError(false);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovies();
  }, [page, params.category]);

  useEffect(() => {
    setPage(1);
  }, [params.category]);

  if (isError) {
    return (
      <div>
        <span className="text-red-500 text-2xl">에러가 발생했습니다</span>
      </div>
    );
  }

  console.log(movies[0]?.adult);

  return (
    <>
      <div className="flex justify-center items-center gap-6 mt-5">
        <button
          className="bg-purple-500 text-white font-bold py-2 px-4 rounded-lg shadow-md 
          hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer disabled:bg-gray-400 
          disabled:cursor-not-allowed"
          disabled={page === 1}
          onClick={(): void => setPage((prev): number => prev - 1)}
        >
          {'<'}
        </button>
        <span>{page}페이지</span>
        <button
          className="bg-purple-500 text-white font-bold py-2 px-4 rounded-lg shadow-md 
          hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer"
          onClick={(): void => setPage((prev): number => prev + 1)}
        >
          {'>'}
        </button>
      </div>

      {isPending && (
        <div className="flex justify-center items-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {!isPending && (
        <div
          className="p-10 grid grid-cols-2 sm:grid-cols-3 
        md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
