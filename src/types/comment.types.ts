// types/comment.types.ts
export type ApiComment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

export const SEGMENTS = ['biz', 'tv', 'net', 'org', 'info', 'com', 'other'] as const;
export type Segment = typeof SEGMENTS[number];

export type CommentModel = {
  id: string;
  postId: number;
  name: string;
  email: string;
  body: string;
  segment: Segment;
};
