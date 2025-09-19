'use client';
import { useEffect, useState } from 'react';
import type { Note } from '@/types/note.type';

type Props = {
  draft: { id?: string; title: string; content: string };
  onChange: (patch: Partial<Pick<Note, 'title' | 'content'>>) => void;
  onSave: () => void;
  onReset: () => void;
};

export default function Editor({ draft, onChange, onSave, onReset }: Props) {
  const [title, setTitle] = useState(draft.title);
  const [content, setContent] = useState(draft.content);

  useEffect(() => {
    setTitle(draft.title);
    setContent(draft.content);
  }, [draft.title, draft.content]);

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h2 className='font-semibold'>{draft.id ? 'Edit Note' : 'New Note'}</h2>
        <button className='text-sm text-gray-500' onClick={onReset}>
          New
        </button>
      </div>

      <input
        className='w-full border rounded px-3 py-2 text-lg font-medium'
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          onChange({ title: e.target.value });
        }}
        placeholder='Title…'
      />
      <textarea
        className='w-full min-h-[40vh] border rounded px-3 py-2'
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          onChange({ content: e.target.value });
        }}
        placeholder='Write your note…'
      />

      <div className='flex gap-2'>
        <button className='border rounded px-3 py-2' onClick={onSave}>
          Save
        </button>
        <button
          className='border rounded px-3 py-2'
          onClick={onReset}
          type='button'
        >
          Reset
        </button>
      </div>
    </div>
  );
}
