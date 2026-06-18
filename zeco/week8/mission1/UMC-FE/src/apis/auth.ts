import axiosInstance from './axios';
import type {
  CommonResponse,
  RequestUser,
  ResponseSignUp,
  RequestSignInDto,
  ResponseSignInDto,
  ResponseMyInfo,
  RequestUpdateProfile,
} from '../types/auth';

export async function postSignUp(data: RequestUser) {
  const response = await axiosInstance.post<CommonResponse<ResponseSignUp>>(
    '/v1/auth/signup',
    data,
  );
  return response.data;
}

export async function postSignIn(data: RequestSignInDto) {
  const response = await axiosInstance.post<CommonResponse<ResponseSignInDto>>(
    '/v1/auth/signin',
    data,
  );
  return response.data;
}

export async function postSignOut() {
  const response =
    await axiosInstance.post<CommonResponse<null>>('/v1/auth/signout');
  return response.data;
}

export async function getMyInfo() {
  const response =
    await axiosInstance.get<CommonResponse<ResponseMyInfo>>('/v1/users/me');
  return response.data;
}

export async function patchMyInfo(data: RequestUpdateProfile) {
  const response = await axiosInstance.patch<CommonResponse<ResponseMyInfo>>(
    '/v1/users',
    data,
  );
  return response.data;
}

export async function deleteAccount() {
  const response = await axiosInstance.delete<CommonResponse<null>>('/v1/users');
  return response.data;
}
