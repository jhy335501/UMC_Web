import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '../types/movie';
import { TMDB_IMAGE_BASE_URL, TMDB_BACKDROP_BASE_URL } from '../apis/tmdb';

interface MovieDetailModalProps {
  movie: Movie;
  onClose: () => void;
}

// "2023-04-14" → "2023년 4월 14일"
function formatReleaseDate(date: string): string {
  if (!date) return '개봉일 미정';
  const [year, month, day] = date.split('-');
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}

export default function MovieDetailModal({ movie, onClose }: MovieDetailModalProps) {
  const navigate = useNavigate();
  const imdbUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;
  const backdropUrl = movie.backdrop_path
    ? `${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path}`
    : movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
      : null;
  // TMDB popularity는 상한이 없어 100을 최대로 보고 막대 비율을 계산
  const popularityPct = Math.min(Math.round(movie.popularity), 100);

  // ESC로 닫기 + 모달 열린 동안 배경 스크롤 잠금
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 backdrop + 제목 오버레이 */}
        <div className="relative h-52 sm:h-60">
          {backdropUrl ? (
            <img
              src={backdropUrl}
              alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-800" />
          )}
          {/* 텍스트 가독성을 위한 어두운 그라데이션 (backdrop 전체를 디밍) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/50" />

          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            ✕
          </button>

          {/* 제목은 backdrop 중하단에 — 아래쪽엔 포스터가 겹칠 여백을 남긴다 */}
          <div className="absolute bottom-12 left-5 right-5">
            <h2 className="text-white text-2xl font-bold drop-shadow-lg">{movie.title}</h2>
            {movie.original_title !== movie.title && (
              <p className="text-gray-200 text-sm mt-1 drop-shadow">{movie.original_title}</p>
            )}
          </div>
        </div>

        {/* 본문 */}
        <div className="p-5">
          <div className="flex gap-4">
            {/* 포스터 (backdrop 위로 살짝 겹치게) - z-10으로 backdrop보다 위에 그림 */}
            <div className="shrink-0 -mt-10 relative z-10">
              {movie.poster_path ? (
                <img
                  src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  className="w-28 sm:w-32 rounded-lg border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-28 sm:w-32 aspect-[2/3] rounded-lg border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center text-3xl">
                  🎬
                </div>
              )}
            </div>

            {/* 평점 / 개봉일 / 인기도 */}
            <div className="flex-1 pt-2 text-center">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">({movie.vote_count} 평가)</span>
              </div>

              <div className="mt-3">
                <p className="text-sm font-semibold text-gray-800">개봉일</p>
                <p className="text-sm text-gray-600 mt-0.5">{formatReleaseDate(movie.release_date)}</p>
              </div>

              <div className="mt-3">
                <p className="text-sm font-semibold text-gray-800">인기도</p>
                <div className="mt-1.5 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${popularityPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 줄거리 */}
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-800 text-center">줄거리</p>
            <p className="mt-1.5 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {movie.overview || '줄거리 정보가 없습니다.'}
            </p>
          </div>

          {/* 버튼 */}
          <div className="mt-5 flex justify-center gap-2">
            <a
              href={imdbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
            >
              IMDb에서 검색
            </a>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-100 transition-colors"
            >
              닫기
            </button>
          </div>

          {/* /movies/:movieId 라우팅 확인용 링크 (미션2) */}
          <button
            type="button"
            onClick={() => navigate(`/movies/${movie.id}`)}
            className="mt-3 mx-auto block text-xs text-gray-400 underline hover:text-gray-600"
          >
            상세 페이지로 이동 (/movies/{movie.id})
          </button>
        </div>
      </div>
    </div>
  );
}
