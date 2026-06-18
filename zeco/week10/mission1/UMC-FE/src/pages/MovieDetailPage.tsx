import { useParams, useNavigate } from 'react-router-dom';

// 미션 요구: /movies/:movieId 라우팅 동작 확인용 (디자인은 불필요)
export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <h1 className="text-xl font-bold text-white">영화 상세 페이지</h1>
      <p className="text-gray-300">
        movieId: <span className="text-yellow-400 font-semibold">{movieId}</span>
      </p>
      <p className="text-gray-500 text-sm">/movies/:movieId 라우팅이 정상 동작합니다.</p>
      <button
        onClick={() => navigate('/movies')}
        className="px-4 py-2 bg-yellow-500 text-black rounded-lg text-sm font-semibold hover:bg-yellow-600"
      >
        ← 검색으로 돌아가기
      </button>
    </div>
  );
}
