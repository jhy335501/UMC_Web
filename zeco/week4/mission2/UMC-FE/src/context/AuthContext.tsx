import { createContext, useContext, useState, type ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { postSignIn, postSignOut } from '../apis/auth';
import type { RequestSignInDto } from '../types/auth';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (data: RequestSignInDto) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    getItem: getAccessToken,
    setItem: setAccessToken,
    removeItem: removeAccessToken,
  } = useLocalStorage('accessToken');

  const {
    getItem: getRefreshToken,
    setItem: setRefreshToken,
    removeItem: removeRefreshToken,
  } = useLocalStorage('refreshToken');

  const [accessToken, setAccessTokenState] = useState<string | null>(
    () => getAccessToken<string>()
  );
  const [refreshToken, setRefreshTokenState] = useState<string | null>(
    () => getRefreshToken<string>()
  );

  const login = async (signInData: RequestSignInDto) => {
    try {
      const { data } = await postSignIn(signInData);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setAccessTokenState(data.accessToken);
      setRefreshTokenState(data.refreshToken);
      alert('로그인 성공');
    } catch (error) {
      console.error(error);
      alert('로그인 실패');
    }
  };

  const logout = async () => {
    try {
      await postSignOut();
    } catch (error) {
      console.error('로그아웃 API 오류:', error);
    } finally {
      removeAccessToken();
      removeRefreshToken();
      setAccessTokenState(null);
      setRefreshTokenState(null);
      alert('로그아웃 성공');
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthContext를 찾을 수 없습니다.');
  return context;
};
