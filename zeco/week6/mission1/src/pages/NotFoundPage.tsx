import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-dvh bg-black text-white gap-4">
      <p className="text-8xl font-bold text-gray-600">404</p>
      <p className="text-2xl font-bold">페이지를 찾을 수 없습니다.</p>
      <p className="text-gray-400 text-sm">주소가 잘못되었거나 삭제된 페이지입니다.</p>
      <button
        onClick={() => navigate('/')}
        className="mt-4 px-6 py-2 bg-white text-black text-sm rounded-full hover:bg-gray-200 transition"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}
