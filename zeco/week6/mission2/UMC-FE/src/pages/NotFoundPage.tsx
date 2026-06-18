import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full text-white gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-gray-400">페이지를 찾을 수 없습니다.</p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2 bg-pink-500 rounded hover:bg-pink-600"
      >
        홈으로
      </button>
    </div>
  );
}

export default NotFoundPage;
