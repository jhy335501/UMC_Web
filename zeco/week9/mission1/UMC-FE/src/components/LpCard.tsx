import { useNavigate } from 'react-router-dom';
import type { Lp } from '../types/lp';
import { getRelativeTime } from '../utils/time';

interface LpCardProps {
  lp: Lp;
}

export default function LpCard({ lp }: LpCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="group relative cursor-pointer rounded-xl overflow-hidden aspect-square bg-gray-800 transition-transform duration-200 hover:scale-105"
      onClick={() => navigate(`/lp/${lp.id}`)}
    >
      {lp.thumbnail ? (
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-700">
          <span className="text-5xl">🎵</span>
        </div>
      )}

      {/* 호버 오버레이 */}
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
        <h3 className="text-white font-bold text-sm truncate">{lp.title}</h3>
        <p className="text-gray-300 text-xs mt-1">{getRelativeTime(lp.createdAt)}</p>
        <p className="text-gray-300 text-xs">♥ {lp.likes.length}</p>
      </div>
    </div>
  );
}
