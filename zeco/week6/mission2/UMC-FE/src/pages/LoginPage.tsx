import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/useAuth';
import type { RequestSignInDto } from '../types/auth';
import { getHttpErrorMessage } from '../utils/error';

const loginSchema = z.object({
  email: z.string().email('유효하지 않은 이메일 형식입니다.'),
  password: z
    .string()
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다.')
    .max(20, '비밀번호는 최대 20자 이하여야 합니다.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, accessToken } = useAuth();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) navigate(redirectTo, { replace: true });
  }, [accessToken, navigate, redirectTo]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  async function onSubmit(data: RequestSignInDto) {
    setLoginError(null);
    try {
      await login(data);
      // 성공 시 navigate는 useEffect(accessToken 변경)가 처리
    } catch (err) {
      const { message } = getHttpErrorMessage(err);
      setLoginError(message);
    }
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-[320px] flex flex-col gap-4">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-xl hover:text-gray-300"
          >
            &lt;
          </button>
          <h2 className="text-white text-lg font-semibold">로그인</h2>
        </div>

        {/* 구글 로그인 */}
        <button
          onClick={() => {
            window.location.href = `${import.meta.env.VITE_SERVER_API_URL}/v1/auth/google/login`;
          }}
          className="flex items-center justify-center gap-3 w-full py-3 border border-gray-600 rounded text-white hover:bg-gray-800 bg-[#1a1a1a]"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          구글 로그인
        </button>

        {/* OR 구분선 */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-600" />
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-600" />
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="이메일을 입력해주세요!"
              className={`w-full px-4 py-3 rounded border text-white text-sm outline-none bg-[#1a1a1a] placeholder-gray-500
                ${errors.email ? 'border-red-500 bg-red-950' : 'border-gray-600 focus:border-yellow-500'}`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              {...register('password')}
              type="password"
              placeholder="비밀번호를 입력해주세요!"
              className={`w-full px-4 py-3 rounded border text-white text-sm outline-none bg-[#1a1a1a] placeholder-gray-500
                ${errors.password ? 'border-red-500 bg-red-950' : 'border-gray-600 focus:border-yellow-500'}`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {loginError && (
            <p className="text-red-500 text-sm text-center">{loginError}</p>
          )}

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full py-3 rounded text-white text-sm font-medium
              bg-gray-700 hover:bg-gray-600
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
