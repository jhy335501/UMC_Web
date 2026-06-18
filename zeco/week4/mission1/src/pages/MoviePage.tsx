import { useEffect, useState } from 'react';
import type { MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';
import { useCustomFetch } from '../hooks/useCustomFetch';

const API_HEADERS = {
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
  accept: 'application/json',
};

export default function MoviePage() {
  const [page, setPage] = useState(1);
  const params = useParams<{ category: string }>();

  const url = `https://api.themoviedb.org/3/movie/${params.category}?language=ko-KR&page=${page}`;
  const { data, isPending, isError } = useCustomFetch<MovieResponse>(url, API_HEADERS);

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

  return (
    <>
      <div className="flex justify-center items-center gap-6 mt-5">
        <button
          className="bg-purple-500 text-white font-bold py-2 px-4 rounded-lg shadow-md
          hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer disabled:bg-gray-400
          disabled:cursor-not-allowed"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          {'<'}
        </button>
        <span>{page}페이지</span>
        <button
          className="bg-purple-500 text-white font-bold py-2 px-4 rounded-lg shadow-md
          hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer"
          onClick={() => setPage((prev) => prev + 1)}
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
          {data?.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
