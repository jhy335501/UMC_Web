export type CommonResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export type RequestUser = {
  email: string;
  password: string;
  name: string;
};

export type ResponseSignUp = {
  id: number;
  email: string;
  name: string;
};

export type RequestSignInDto = {
  email: string;
  password: string;
};

export type ResponseSignInDto = {
  accessToken: string;
  refreshToken: string;
};

export type ResponseMyInfo = {
  id: number;
  email: string;
  name: string;
};
