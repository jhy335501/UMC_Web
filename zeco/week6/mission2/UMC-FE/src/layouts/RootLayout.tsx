import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function RootLayout() {
  const navigate = useNavigate();
  const { accessToken, user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-3 bg-black border-b border-gray-800 shrink-0 z-10">
        {/* 햄버거 버튼 (모바일) */}
        <button
          className="lg:hidden mr-3 text-white"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="메뉴 열기"
        >
          <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32" />
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
                onClick={handleLogout}
                className="px-3 py-1.5 border border-gray-600 text-white rounded text-sm hover:bg-gray-800"
              >
                로그아웃
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
            className="fixed inset-0 bg-black/50 lg:hidden z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 사이드바 */}
        <aside
          className={`
            fixed lg:static top-0 left-0 h-full w-56 bg-gray-900 border-r border-gray-800
            flex flex-col pt-4 z-30 transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          `}
        >
          <nav className="flex flex-col gap-1 px-3">
            <NavLink
              to="/"
              end
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                ${isActive ? 'bg-yellow-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`
              }
            >
              🎵 LP 목록
            </NavLink>
            {accessToken && (
              <NavLink
                to="/my"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                  ${isActive ? 'bg-yellow-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`
                }
              >
                👤 마이페이지
              </NavLink>
            )}
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 overflow-auto relative">
          <Outlet />

          {/* 플로팅 (+) 버튼 */}
          <button
            onClick={() => navigate('/lp/new')}
            className="fixed bottom-8 right-8 w-14 h-14 bg-yellow-500 text-white text-3xl rounded-full shadow-lg hover:bg-yellow-600 transition-colors flex items-center justify-center z-10"
            aria-label="새 LP 만들기"
          >
            +
          </button>
        </main>
      </div>
    </div>
  );
}

export default RootLayout;
