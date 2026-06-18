import { useCallback, useMemo, useState } from 'react';
import { useSearchMovies } from '../hooks/useSearchMovies';
import MovieCard from '../components/MovieCard';
import MovieDetailModal from '../components/MovieDetailModal';
import { ErrorState, LoadingState } from '../components/AsyncState';
import { getHttpErrorMessage } from '../utils/error';
import type { Movie, MovieLanguage } from '../types/movie';

const LANGUAGE_OPTIONS: { value: MovieLanguage; label: string }[] = [
  { value: 'ko-KR', label: '한국어' },
  { value: 'en-US', label: '영어' },
  { value: 'ja-JP', label: '일본어' },
];

interface SearchParams {
  query: string;
  includeAdult: boolean;
  language: MovieLanguage;
}

export default function MovieSearchPage() {
  // 폼 입력 상태
  const [title, setTitle] = useState('');
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState<MovieLanguage>('ko-KR');

  // 제출된 검색 조건 스냅샷 (form submit 시점에만 갱신 → 이 값으로 API 호출)
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  // 상세 모달
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data: movies, isLoading, isError, error, refetch } = useSearchMovies({
    query: searchParams?.query ?? '',
    includeAdult: searchParams?.includeAdult ?? false,
    language: searchParams?.language ?? 'ko-KR',
    enabled: searchParams !== null,
  });

  // 엔터/버튼 제출 시 현재 입력값을 스냅샷으로 고정해 검색 실행
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = title.trim();
      if (!trimmed) return;
      setSearchParams({ query: trimmed, includeAdult, language });
    },
    [title, includeAdult, language],
  );

  // MovieCard(memo)에 내려줄 핸들러 → 참조 고정으로 불필요한 리렌더링 방지
  const handleSelectMovie = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  // 결과 리스트에서 평균 평점 계산 (연산 결과 캐싱)
  // movies가 바뀔 때만 재계산 → 모달 열고 닫는 리렌더링에서는 다시 계산하지 않음
  const averageRating = useMemo(() => {
    const rated = movies?.filter((m) => m.vote_average > 0) ?? [];
    if (rated.length === 0) return null;
    const sum = rated.reduce((acc, m) => acc + m.vote_average, 0);
    return (sum / rated.length).toFixed(1);
  }, [movies]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-white mb-4">🎬 영화 검색</h1>

      {/* 검색 영역 */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="영화 제목을 입력하세요"
          className="w-full px-4 py-2.5 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-yellow-500 placeholder:text-gray-500"
        />

        <div className="flex flex-wrap items-center gap-4">
          {/* 성인 콘텐츠 포함 */}
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeAdult}
              onChange={(e) => setIncludeAdult(e.target.checked)}
              className="w-4 h-4 accent-yellow-500"
            />
            성인 콘텐츠 포함
          </label>

          {/* 언어 선택 */}
          <label className="flex items-center gap-2 text-sm text-gray-300">
            언어
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as MovieLanguage)}
              className="px-3 py-1.5 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-yellow-500"
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="ml-auto px-6 py-2 bg-yellow-500 text-black font-semibold rounded-lg text-sm hover:bg-yellow-600 transition-colors"
          >
            검색
          </button>
        </div>
      </form>

      {/* 결과 영역 */}
      {searchParams === null ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg">검색어를 입력해 영화를 찾아보세요.</p>
        </div>
      ) : isLoading ? (
        <LoadingState variant="skeletonGrid" />
      ) : isError ? (
        (() => {
          const { message } = getHttpErrorMessage(error);
          return (
            <ErrorState
              message={message}
              action={
                <button
                  onClick={() => refetch()}
                  className="px-5 py-2 bg-yellow-500 text-black font-semibold rounded-full text-sm hover:bg-yellow-600"
                >
                  다시 시도
                </button>
              }
            />
          );
        })()
      ) : movies && movies.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-3 text-sm text-gray-400">
            <span>"{searchParams.query}" 검색 결과 {movies.length}건</span>
            {averageRating && <span>평균 평점 ⭐ {averageRating}</span>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onSelect={handleSelectMovie} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500 text-lg">
            "{searchParams.query}" 검색 결과가 없습니다.
          </p>
        </div>
      )}

      {/* 상세 모달 */}
      {selectedMovie && (
        <MovieDetailModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
