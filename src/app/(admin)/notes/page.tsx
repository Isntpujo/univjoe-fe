'use client';
import { useState } from 'react';
import NoteList from '@/components/notes/Notes';
import Editor from '@/components/notes/Editor';
import { useNotes } from '@/hooks/useNotes';
import type { Note } from '@/types/note.type';

type Draft = { id?: string; title: string; content: string };

export default function NotesPage() {
  const { notes, createNote, updateNote, deleteNote } = useNotes();
  const [draft, setDraft] = useState<Draft>({ title: '', content: '' });

  const handleSelect = (n: Note) => {
    setDraft({ id: n.id, title: n.title, content: n.content });
  };

  const handleChangeDraft = (
    patch: Partial<Pick<Note, 'title' | 'content'>>,
  ) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    if (!draft.title && !draft.content) return;
    if (draft.id) {
      updateNote(draft.id, draft.title, draft.content);
    } else {
      createNote(draft.title, draft.content);
    }
    setDraft({ title: '', content: '' });
  };

  const handleReset = () => {
    setDraft({ title: '', content: '' });
  };

  return (
    <div className='p-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
      <NoteList notes={notes} onSelect={handleSelect} onDelete={deleteNote} />

      <section className='md:col-span-2 border rounded-xl p-3'>
        <Editor
          draft={draft}
          onChange={handleChangeDraft}
          onSave={handleSave}
          onReset={handleReset}
        />
      </section>
    </div>
  );
}
