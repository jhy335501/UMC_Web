import { useParams } from 'react-router-dom';
import type { MovieDetail, Credits, CrewMember } from '../types/movie';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useCustomFetch } from '../hooks/useCustomFetch';

const IMAGE_BASE = 'https://image.tmdb.org/t/p';
const API_HEADERS = {
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
  accept: 'application/json',
};

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  const { data: movie, isPending: moviePending, isError: movieError } = useCustomFetch<MovieDetail>(
    `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
    API_HEADERS,
  );
  const { data: credits, isPending: creditsPending, isError: creditsError } = useCustomFetch<Credits>(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
    API_HEADERS,
  );

  const isPending = moviePending || creditsPending;
  const isError = movieError || creditsError;

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-dvh">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="flex flex-col justify-center items-center h-dvh gap-3">
        <p className="text-red-400 text-2xl font-bold">영화 정보를 불러오지 못했습니다.</p>
        <p className="text-gray-400 text-sm">네트워크 상태를 확인하거나 잠시 후 다시 시도해 주세요.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-5 py-2 bg-white text-black text-sm rounded-full hover:bg-gray-200 transition"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const director = credits?.crew.find((c: CrewMember) => c.job === 'Director');
  const topCast = credits?.cast.slice(0, 20) ?? [];

  const allCredits = [
    ...(director
      ? [{ id: director.id, name: director.name, sub: '감독', profile_path: director.profile_path }]
      : []),
    ...topCast.map((a) => ({ id: a.id, name: a.name, sub: a.character, profile_path: a.profile_path })),
  ];

  const runtimeText = movie.runtime > 0 ? `${movie.runtime}분` : '정보 없음';

  return (
    <div className="text-white min-h-screen bg-black">
      {/* 히어로: 백드롭을 배경으로, 좌측에 어두운 그라디언트 */}
      <div className="relative min-h-[420px] overflow-hidden">
        {/* 배경 이미지 */}
        {movie.backdrop_path ? (
          <img
            src={`${IMAGE_BASE}/w1280${movie.backdrop_path}`}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-800" />
        )}

        {/* 좌→우 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/60 via-30% to-transparent to-50%" />

        {/* 텍스트 콘텐츠 */}
        <div className="relative z-10 w-[30%] px-12 py-12 flex flex-col justify-center min-h-[420px]">
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
          <p className="text-gray-300 mb-1">평균 {movie.vote_average.toFixed(1)}</p>
          <p className="text-gray-300 mb-1">{movie.release_date.slice(0, 4)}</p>
          <p className="text-gray-300 mb-5">{runtimeText}</p>
          {movie.tagline && (
            <p className="text-white italic text-xl mb-5 whitespace-nowrap">{movie.tagline}</p>
          )}
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map((g) => (
              <span
                key={g.id}
                className="border border-white text-white text-xs px-3 py-1 rounded-full"
              >
                {g.name}
              </span>
            ))}
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            {movie.overview || '줄거리 정보가 없습니다.'}
          </p>
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-700 mx-12" />

      {/* 감독/출연 */}
      {allCredits.length > 0 && (
        <section className="px-12 py-10">
          <h2 className="text-2xl font-bold mb-8">감독/출연</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-8">
            {allCredits.map((person) => (
              <div
                key={`${person.id}-${person.sub}`}
                className="flex flex-col items-center text-center w-24"
              >
                {person.profile_path ? (
                  <img
                    src={`${IMAGE_BASE}/w185${person.profile_path}`}
                    alt={person.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-white mb-2"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-black border-2 border-white mb-2" />
                )}
                <p className="text-sm font-semibold leading-tight">{person.name}</p>
                <p className="text-xs text-gray-400 leading-tight mt-1">{person.sub}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
