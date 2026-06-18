import axiosInstance from './axios';
import type { LpListParams, LpListResponse, LpDetailResponse, CommentListResponse, CommentOrder } from '../types/lp';

export async function getLps(params?: LpListParams) {
  const { data } = await axiosInstance.get<LpListResponse>('/v1/lps', { params });
  return data.data;
}

export async function getLpDetail(lpId: number) {
  const { data } = await axiosInstance.get<LpDetailResponse>(`/v1/lps/${lpId}`);
  return data.data;
}

export async function postLike(lpId: number) {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
}

export async function deleteLike(lpId: number) {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
}

export async function getComments(
  lpId: number,
  params?: { cursor?: number; limit?: number; order?: CommentOrder }
) {
  const { data } = await axiosInstance.get<CommentListResponse>(
    `/v1/lps/${lpId}/comments`,
    { params }
  );
  return data.data;
}

export async function postComment(lpId: number, content: string) {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, { content });
  return data;
}
