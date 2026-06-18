import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyInfo } from '../apis/auth';
import type { ResponseMyInfo } from '../types/auth';

function MyPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [myInfo, setMyInfo] = useState<ResponseMyInfo | null>(null);

  useEffect(() => {
    getMyInfo()
      .then((res) => setMyInfo(res.data))
      .catch(console.error);
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <h1 className="text-4xl font-bold text-white">마이페이지</h1>
      {myInfo && (
        <div className="flex flex-col items-center gap-2 text-gray-300">
          <p>이름: {myInfo.name}</p>
          <p>이메일: {myInfo.email}</p>
        </div>
      )}
      <button
        onClick={handleLogout}
        className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
      >
        로그아웃
      </button>
    </div>
  );
}

export default MyPage;
