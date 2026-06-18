import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/useAuth';
import { deleteAccount } from '../apis/auth';
import { useSidebar } from '../hooks/useSidebar';
import LpFormModal from '../components/LpFormModal';
import ConfirmModal from '../components/ConfirmModal';

function RootLayout() {
  const navigate = useNavigate();
  const { accessToken, user, logout } = useAuth();
  const { isOpen: sidebarOpen, close: closeSidebar, toggle: toggleSidebar } = useSidebar();
  const [isCreateLpModalOpen, setIsCreateLpModalOpen] = useState(false);
  const [isDeleteAccountConfirmOpen, setIsDeleteAccountConfirmOpen] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => navigate('/'),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      await logout();
      navigate('/login');
    },
    onError: () => {
      setDeleteAccountError('탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    },
  });

  function handleCreateLpClick() {
    if (!accessToken) {
      navigate('/login');
      return;
    }
    setIsCreateLpModalOpen(true);
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-3 bg-black border-b border-gray-800 shrink-0 z-10">
        {/* 햄버거 버튼 (모바일) */}
        <button
          className="mr-3 text-white"
          onClick={toggleSidebar}
          aria-label="메뉴 열기"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              d="M7.95 11.95h32m-32 12h32m-32 12h32"
            />
          </svg>
        </button>

        {/* 로고 */}
        <span
          className="text-yellow-500 font-bold text-xl cursor-pointer"
          onClick={() => navigate('/')}
        >
          zeco's UMC
        </span>

        {/* 사용자 영역 */}
        <div className="flex items-center gap-3">
          {accessToken && user ? (
            <>
              <span className="text-gray-300 text-sm hidden sm:block">
                {user.name}님 반갑습니다.
              </span>
              <button
                onClick={() => navigate('/my')}
                className="px-3 py-1.5 border border-gray-600 text-white rounded text-sm hover:bg-gray-800"
              >
                마이페이지
              </button>
              <button
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="px-3 py-1.5 border border-gray-600 text-white rounded text-sm hover:bg-gray-800 disabled:opacity-50"
              >
                {logoutMutation.isPending ? '처리 중...' : '로그아웃'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-1.5 border border-gray-600 text-white rounded text-sm hover:bg-gray-800"
              >
                로그인
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-3 py-1.5 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </header>

      {/* 바디: 사이드바 + 메인 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 모바일 오버레이 */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20"
            onClick={closeSidebar}
          />
        )}

        {/* 사이드바 */}
        <aside
          className={`
            fixed top-0 left-0 h-full w-56 bg-gray-900 border-r border-gray-800
            flex flex-col pt-4 z-30 transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <nav className="flex flex-col gap-1 px-3 flex-1">
            <NavLink
              to="/"
              end
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                ${isActive ? 'bg-yellow-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              🎵 LP 목록
            </NavLink>
            <NavLink
              to="/movies"
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                ${isActive ? 'bg-yellow-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              🎬 영화 검색
            </NavLink>
            {accessToken && (
              <NavLink
                to="/my"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                  ${isActive ? 'bg-yellow-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`
                }
              >
                👤 마이페이지
              </NavLink>
            )}
          </nav>

          {/* 탈퇴하기 */}
          {accessToken && (
            <div className="px-3 pb-4 border-t border-gray-800 pt-3">
              <button
                onClick={() => {
                  closeSidebar();
                  setIsDeleteAccountConfirmOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-gray-800 w-full transition-colors"
              >
                탈퇴하기
              </button>
            </div>
          )}
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 overflow-auto relative">
          <Outlet />

          {/* 플로팅 (+) 버튼 */}
          <button
            onClick={handleCreateLpClick}
            className="fixed bottom-8 right-8 w-14 h-14 bg-yellow-500 text-white text-3xl rounded-full shadow-lg hover:bg-yellow-600 transition-colors flex items-center justify-center z-10"
            aria-label="새 LP 만들기"
          >
            +
          </button>
        </main>
      </div>

      {/* LP 생성 모달 */}
      {isCreateLpModalOpen && (
        <LpFormModal onClose={() => setIsCreateLpModalOpen(false)} />
      )}

      {/* 탈퇴 확인 모달 */}
      {isDeleteAccountConfirmOpen && (
        <ConfirmModal
          message="정말 탈퇴하시겠습니까?"
          description="탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다."
          confirmText="예"
          cancelText="아니요"
          onConfirm={() => deleteAccountMutation.mutate()}
          onCancel={() => {
            setIsDeleteAccountConfirmOpen(false);
            setDeleteAccountError(null);
          }}
          isLoading={deleteAccountMutation.isPending}
          error={deleteAccountError}
          danger
        />
      )}
    </div>
  );
}

export default RootLayout;
