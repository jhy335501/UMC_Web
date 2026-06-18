import { createContext } from 'react';
import type { RequestSignInDto, ResponseMyInfo } from '../types/auth';

export interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: ResponseMyInfo | null;
  login: (data: RequestSignInDto) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (partial: Partial<ResponseMyInfo>) => void;
}

// 기본값을 undefined로 두어, Provider 밖에서 useAuth를 쓰면
// useAuth의 검사에서 바로 에러가 나도록 한다. (실수를 조용히 넘기지 않음)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
