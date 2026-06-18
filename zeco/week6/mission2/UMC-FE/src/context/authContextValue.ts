import { createContext } from 'react';
import type { RequestSignInDto, ResponseMyInfo } from '../types/auth';

export interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: ResponseMyInfo | null;
  login: (data: RequestSignInDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  user: null,
  login: async () => {},
  logout: async () => {},
});
