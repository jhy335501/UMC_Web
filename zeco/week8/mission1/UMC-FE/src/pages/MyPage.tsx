import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/useAuth';
import { getMyInfo } from '../apis/auth';
import { QUERY_KEY } from '../utils/constants/queryKeys';
import EditProfileModal from '../components/EditProfileModal';

function MyPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: myInfoData, isPending } = useQuery({
    queryKey: [QUERY_KEY.MY_INFO],
    queryFn: getMyInfo,
  });
  const myInfo = myInfoData?.data;

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
      <h1 className="text-3xl font-bold text-white">마이페이지</h1>

      {isPending ? (
        <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      ) : myInfo ? (
        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
          {/* 프로필 사진 */}
          <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center text-white text-3xl font-bold">
            {myInfo.avatar ? (
              <img src={myInfo.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              myInfo.name[0]?.toUpperCase() ?? '?'
            )}
          </div>

          {/* 정보 */}
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-white text-lg font-semibold">{myInfo.name}</p>
            <p className="text-gray-400 text-sm">{myInfo.email}</p>
            {myInfo.bio && (
              <p className="text-gray-400 text-sm mt-1">{myInfo.bio}</p>
            )}
          </div>

          {/* 프로필 수정 버튼 */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-600 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
          >
            ⚙ 설정
          </button>

          {/* 로그아웃 */}
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
          >
            로그아웃
          </button>
        </div>
      ) : null}

      {isEditModalOpen && myInfo && (
        <EditProfileModal
          currentProfile={myInfo}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}

export default MyPage;
