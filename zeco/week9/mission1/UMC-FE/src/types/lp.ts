import type { CommonResponse } from './auth';

export type LpTag = {
  id: number;
  name: string;
};

export type LpLike = {
  id: number;
  userId: number;
  lpId: number;
};

export type Lp = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags: LpTag[];
  likes: LpLike[];
};

export type LpAuthor = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LpDetail = Lp & {
  author: LpAuthor;
};

export type LpListData = {
  data: Lp[];
  nextCursor: number | null;
  hasNext: boolean;
};

export type LpOrder = 'asc' | 'desc';

export type LpListParams = {
  cursor?: number;
  limit?: number;
  search?: string;
  order?: LpOrder;
};

export type LpListResponse = CommonResponse<LpListData>;
export type LpDetailResponse = CommonResponse<LpDetail>;

export type CommentOrder = 'asc' | 'desc';

export type Comment = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: LpAuthor;
};

export type CommentListData = {
  data: Comment[];
  nextCursor: number | null;
  hasNext: boolean;
};

export type CommentListResponse = CommonResponse<CommentListData>;
