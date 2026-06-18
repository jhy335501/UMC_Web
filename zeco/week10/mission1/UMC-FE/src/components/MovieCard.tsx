import { memo } from 'react';
import type { Movie } from '../types/movie';
import { TMDB_IMAGE_BASE_URL } from '../apis/tmdb';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

function MovieCard({ movie, onSelect }: MovieCardProps) {
  // 리렌더링 확인용 (Profiler/콘솔로 memo 효과 체크)
  console.log('MovieCard 렌더링:', movie.title);

  return (
    <button
      type="button"
      onClick={() => onSelect(movie)}
      className="group text-left rounded-xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-yellow-500 transition-colors"
    >
      <div className="aspect-[2/3] bg-gray-800 overflow-hidden">
        {movie.poster_path ? (
          <img
            src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl">
            🎬
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-white text-sm font-semibold truncate">{movie.title}</h3>
        <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
          <span>⭐ {movie.vote_average.toFixed(1)}</span>
          <span>{movie.release_date || '미정'}</span>
        </div>
      </div>
    </button>
  );
}

// 동일한 props(movie, onSelect)면 리렌더링을 건너뛴다.
// onSelect는 부모에서 useCallback으로 참조를 고정해야 memo가 동작한다.
export default memo(MovieCard);
