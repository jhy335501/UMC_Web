import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { postSignUp } from '../apis/auth';

const signUpSchema = z
  .object({
    email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
    password: z
      .string()
      .min(6, '비밀번호는 6자 이상이어야 합니다.')
      .max(20, '비밀번호는 최대 20자 이하여야 합니다.'),
    passwordCheck: z.string(),
    name: z.string().min(1, '닉네임을 입력해주세요.'),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordCheck'],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

function SignUpPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '', passwordCheck: '', name: '' },
  });

  const emailValue = useWatch({ control, name: 'email', defaultValue: '' });
  const passwordValue = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });
  const passwordCheckValue = useWatch({
    control,
    name: 'passwordCheck',
    defaultValue: '',
  });
  const nameValue = useWatch({ control, name: 'name', defaultValue: '' });

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleNext();
  }

  async function handleNext() {
    if (step === 1) {
      const valid = await trigger('email');
      if (valid) setStep(2);
    } else if (step === 2) {
      const valid = await trigger(['password', 'passwordCheck']);
      if (valid) setStep(3);
    }
  }

  function handleBack() {
    if (step === 1) navigate(-1);
    else setStep((prev) => (prev - 1) as 1 | 2 | 3);
  }

  async function onSubmit(data: SignUpFormData) {
    const requestData = { email: data.email, password: data.password, name: data.name };
    try {
      const response = await postSignUp(requestData);
      console.log('회원가입 성공:', response);
      navigate('/');
    } catch (error) {
      console.error('회원가입 실패:', error);
    }
  }

  const isStep1Valid = emailValue && !errors.email;
  const isStep2Valid =
    passwordValue &&
    passwordCheckValue &&
    !errors.password &&
    !errors.passwordCheck;
  const isStep3Valid = nameValue.length > 0;

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-[320px] flex flex-col gap-4">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={handleBack}
            className="text-white text-xl hover:text-gray-300"
          >
            &lt;
          </button>
          <h2 className="text-white text-lg font-semibold">회원가입</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {/* Step 1: 이메일 */}
          {step === 1 && (
            <>
              {/* 구글 로그인 */}
              <button
                type="button"
                className="w-full py-3 rounded border border-gray-600 text-white text-sm font-medium bg-[#1a1a1a] hover:bg-gray-800 flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                구글 로그인
              </button>

              {/* OR 구분선 */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-600" />
                <span className="text-gray-400 text-sm">OR</span>
                <div className="flex-1 h-px bg-gray-600" />
              </div>

              <div>
                <input
                  {...register('email')}
                  type="email"
                  onKeyDown={handleKeyDown}
                  placeholder="이메일을 입력해주세요!"
                  className={`w-full px-4 py-3 rounded border text-white text-sm outline-none bg-[#1a1a1a] placeholder-gray-500
                    ${errors.email ? 'border-red-500 bg-red-950' : 'border-gray-600 focus:border-yellow-500'}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStep1Valid}
                className="w-full py-3 rounded text-white text-sm font-medium
                  bg-yellow-500 hover:bg-yellow-600
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </>
          )}

          {/* Step 2: 비밀번호 */}
          {step === 2 && (
            <>
              {/* 이메일 표시 */}
              <div className="flex items-center gap-2 text-white text-sm">
                <span>✉</span>
                <span>{emailValue}</span>
              </div>

              {/* 비밀번호 */}
              <div>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    onKeyDown={handleKeyDown}
                    placeholder="비밀번호를 입력해주세요!"
                    className={`w-full px-4 py-3 pr-10 rounded border text-white text-sm outline-none bg-[#1a1a1a] placeholder-gray-500
                      ${errors.password ? 'border-red-500 bg-red-950' : 'border-gray-600 focus:border-yellow-500'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? '👁' : '🙈'}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <div className="relative">
                  <input
                    {...register('passwordCheck')}
                    type={showPasswordCheck ? 'text' : 'password'}
                    onKeyDown={handleKeyDown}
                    placeholder="비밀번호를 다시 한 번 입력해주세요!"
                    className={`w-full px-4 py-3 pr-10 rounded border text-white text-sm outline-none bg-[#1a1a1a] placeholder-gray-500
                      ${errors.passwordCheck ? 'border-red-500 bg-red-950' : 'border-gray-600 focus:border-yellow-500'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordCheck((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswordCheck ? '👁' : '🙈'}
                  </button>
                </div>
                {errors.passwordCheck && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.passwordCheck.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!isStep2Valid}
                className="w-full py-3 rounded text-white text-sm font-medium
                  bg-yellow-500 hover:bg-yellow-600
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </>
          )}

          {/* Step 3: 닉네임 */}
          {step === 3 && (
            <>
              {/* 이메일 표시 */}
              <div className="flex items-center gap-2 text-white text-sm">
                <span>✉</span>
                <span>{emailValue}</span>
              </div>

              {/* 프로필 이미지 UI */}
              <div className="flex justify-center my-2">
                <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
              </div>

              {/* 닉네임 */}
              <div>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="닉네임을 입력해주세요!"
                  className={`w-full px-4 py-3 rounded border text-white text-sm outline-none bg-[#1a1a1a] placeholder-gray-500
                    ${errors.name ? 'border-red-500 bg-red-950' : 'border-gray-600 focus:border-yellow-500'}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isStep3Valid || isSubmitting}
                className="w-full py-3 rounded text-white text-sm font-medium
                  bg-yellow-500 hover:bg-yellow-600
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                회원가입 완료
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
