'use client';
import { useLocalStorage } from './useLocalStorage';
import type { Note } from '@/types/note.type';

export function useNotes(storageKey = 'notes.simple') {
  const [notes, setNotes] = useLocalStorage<Note[]>(storageKey, []);

  const createNote = (title: string, content: string) => {
    const id = crypto.randomUUID();
    const now = Date.now();
    const newNote: Note = { id, title, content, updatedAt: now };
    setNotes((prev) => [newNote, ...prev]);
  };

  const updateNote = (id: string, title: string, content: string) => {
    const now = Date.now();
    setNotes((prev) =>
      prev
        .map((n) =>
          n.id === id ? { ...n, title, content, updatedAt: now } : n,
        )
        .sort((a, b) => b.updatedAt - a.updatedAt),
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return { notes, createNote, updateNote, deleteNote };
}
