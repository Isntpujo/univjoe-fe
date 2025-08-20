// lib/comments.api.ts
import type { ApiComment, CommentModel, Segment } from '@/types/comment.types';

export async function fetchJSON<T>(url: string, init?: RequestInit & { signal?: AbortSignal }) {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

// derive segment dari TLD email (optional kategori demo)
export function deriveSegmentFromEmail(email: string): Segment {
  const at = email.split('@')[1] ?? '';
  const tld = at.split('.').pop()?.toLowerCase() ?? 'other';
  const known = ['biz','tv','net','org','info','com'] as const;
  return (known as readonly string[]).includes(tld) ? (tld as Segment) : 'other';
}

export function mapCommentsToModel(api: ApiComment[]): CommentModel[] {
  return api.map((c) => ({
    id: String(c.id),
    postId: c.postId,
    name: c.name,
    email: c.email,
    body: c.body,
    segment: deriveSegmentFromEmail(c.email),
  }));
}

/**
 * Fetch 1 halaman comments
 * JSONPlaceholder (json-server) support _page & _limit dan expose X-Total-Count
 * contoh: /comments?_page=2&_limit=10
 */
export async function fetchCommentsPage(
  page: number,
  limit: number,
  signal?: AbortSignal
) {
  const url = new URL('https://jsonplaceholder.typicode.com/comments');
  url.searchParams.set('_page', String(page));
  url.searchParams.set('_limit', String(limit));

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = (await res.json()) as ApiComment[];
  const items = mapCommentsToModel(data);

  // x-total-count dipakai untuk hitung total halaman
  const total = Number(res.headers.get('X-Total-Count') ?? '0');

  return { items, total };
}
