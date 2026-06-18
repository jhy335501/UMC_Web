import { useState, useEffect, type ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { postSignIn, postSignOut, getMyInfo } from '../apis/auth';
import type { RequestSignInDto, ResponseMyInfo } from '../types/auth';
import { AuthContext } from './authContextValue';

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
  const [user, setUser] = useState<ResponseMyInfo | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setUser(null);
      return;
    }
    getMyInfo()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, [accessToken]);

  const login = async (signInData: RequestSignInDto) => {
    const res = await postSignIn(signInData);
    setAccessToken(res.data.accessToken);
    setRefreshToken(res.data.refreshToken);
    setAccessTokenState(res.data.accessToken);
    setRefreshTokenState(res.data.refreshToken);
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
      setUser(null);
    }
  };

  const refreshUser = async () => {
    if (!accessToken) return;
    try {
      const res = await getMyInfo();
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  const updateUser = (partial: Partial<ResponseMyInfo>) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, user, login, logout, refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
