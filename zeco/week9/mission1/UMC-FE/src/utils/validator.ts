export type UserSignInInformation = {
  email: string;
  password: string;
};

function validateUser(values: UserSignInInformation): Record<string, string> {
  const errors: Record<string, string> = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(values.email)) {
    errors.email = '유효하지 않은 이메일 형식입니다.';
  }

  if (values.password.length < 6) {
    errors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
  }

  return errors;
}

export function validateSignIn(values: UserSignInInformation) {
  return validateUser(values);
}
