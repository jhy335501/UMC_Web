import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';

function GoogleLoginResultPage() {
  const navigate = useNavigate();
  const { setItem: setAccessToken } = useLocalStorage('accessToken');
  const { setItem: setRefreshToken } = useLocalStorage('refreshToken');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      navigate('/my', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate, setAccessToken, setRefreshToken]);

  return (
    <div className="flex items-center justify-center h-dvh bg-black text-white">
      <p>구글 로그인 처리 중...</p>
    </div>
  );
}

export default GoogleLoginResultPage;
