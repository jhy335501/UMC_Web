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

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await axiosInstance.post<{ status: number; message: string; data: { imageUrl: string } }>(
    '/v1/uploads',
    formData,
  );
  return data.data.imageUrl;
}

export type LpPayload = {
  title: string;
  content: string;
  thumbnail?: string;
  tags: string[];
  published: boolean;
};

export async function postLp(payload: LpPayload) {
  const { data } = await axiosInstance.post('/v1/lps', payload);
  return data;
}

export async function patchLp(lpId: number, payload: Partial<LpPayload>) {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, payload);
  return data;
}

export async function deleteLp(lpId: number) {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
}

export async function postComment(lpId: number, content: string) {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, { content });
  return data;
}

export async function patchComment(lpId: number, commentId: number, content: string) {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, { content });
  return data;
}

export async function deleteComment(lpId: number, commentId: number) {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
  return data;
}
