// app/CommentList.tsx
"use client";
import { useCommentsPage } from "@/hooks/useComments";

export default function CommentList() {
  const {
    items,
    loading,
    error,
    page,
    limit,
    totalPages,
    setLimit,
    setPage,
    next,
    prev,
  } = useCommentsPage(10);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {/* Controls */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={prev} disabled={page <= 1}>
          Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button onClick={next} disabled={page >= totalPages}>
          Next
        </button>

        <label style={{ marginLeft: "auto" }}>
          Per page:{" "}
          <select
            value={limit}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const newLimit = Number(e.target.value);
              setLimit(newLimit);
              setPage(1); // reset ke page 1 tiap ganti limit
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* State */}
      {loading && <p>Loading comments…</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* List */}
      {!loading && !error && (
        <ul>
          {items.map((c) => (
            <li key={c.id} style={{ marginBottom: 12 }}>
              <strong>{c.name}</strong> — {c.email} [{c.segment}]
              <div style={{ whiteSpace: "pre-wrap" }}>{c.body}</div>
              <small>postId: {c.postId}</small>
            </li>
          ))}
        </ul>
      )}

      {/* Pager (bottom) */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={prev} disabled={page <= 1}>
          Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button onClick={next} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
