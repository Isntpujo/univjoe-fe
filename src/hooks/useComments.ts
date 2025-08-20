// hooks/useCommentsPage.ts
'use client';
import { useEffect, useState } from 'react';
import { fetchCommentsPage } from '@/lib/comments.api';
import type { CommentModel } from '@/types/comment.types';

function isAbortError(e: unknown) {
  if (typeof DOMException !== 'undefined' && e instanceof DOMException) {
    return e.name === 'AbortError';
  }
  return e instanceof Error && e.name === 'AbortError';
}
function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  try { return JSON.stringify(e); } catch { return String(e); }
}

export function useCommentsPage(initialLimit = 10) {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(initialLimit);
  const [items, setItems] = useState<CommentModel[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const { items, total } = await fetchCommentsPage(page, limit, controller.signal);
        setItems(items);
        setTotal(total);
      } catch (e) {
        if (isAbortError(e)) return;
        setError(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [page, limit]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const goTo = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));
  const next = () => goTo(page + 1);
  const prev = () => goTo(page - 1);

  return {
    items, loading, error,
    page, limit, total, totalPages,
    setLimit, setPage: goTo, next, prev,
  };
}
