'use client';
import type { Note } from '@/types/note.type';

type Props = {
  notes: Note[];
  onSelect: (note: Note) => void;
  onDelete: (id: string) => void;
};

export default function NoteList({ notes, onSelect, onDelete }: Props) {
  return (
    <aside className='md:col-span-1 border rounded-xl p-3'>
      <h2 className='font-semibold'>Notes</h2>

      {notes.length === 0 ? (
        <p className='text-sm text-gray-500 mt-4'>Belum ada catatan.</p>
      ) : (
        <ul className='mt-3 space-y-1'>
          {notes.map((n) => (
            <li key={n.id} className='flex items-center justify-between'>
              <button
                onClick={() => onSelect(n)}
                className='flex-1 text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50'
              >
                <div className='font-medium truncate'>
                  {n.title || '(Untitled)'}
                </div>
                <div className='text-[11px] text-gray-500'>
                  {new Date(n.updatedAt).toLocaleString()}
                </div>
              </button>
              <button
                className='text-red-600 text-sm px-2 py-1'
                onClick={() => onDelete(n.id)}
                title='Delete'
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
