'use client';

import { mockNotes } from '@/lib/mock-data';
import { readLocalCollection, writeLocalCollection } from '@/lib/storage/browser-store';
import { getSupabaseClient, isSupabaseEnabled } from '@/lib/supabase/client';
import type { Note } from '@/lib/types';

const STORAGE_KEY = 'papermist_notes';

export async function listNotes(): Promise<Note[]> {
  if (isSupabaseEnabled) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (!error && data) {
        return data as Note[];
      }
    }
  }

  return readLocalCollection<Note>(STORAGE_KEY, mockNotes);
}

export async function getNoteById(id: string): Promise<Note | null> {
  const notes = await listNotes();
  return notes.find((note) => note.id === id) ?? null;
}

export async function createNote(payload: { title: string; content: string }): Promise<Note> {
  const now = new Date().toISOString();
  const note: Note = {
    id: crypto.randomUUID(),
    user_id: null,
    title: payload.title,
    content: payload.content,
    created_at: now,
    updated_at: now
  };

  if (isSupabaseEnabled) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from('notes').insert(note).select().single();
      if (!error && data) {
        return data as Note;
      }
    }
  }

  const notes = readLocalCollection<Note>(STORAGE_KEY, mockNotes);
  const next = [note, ...notes];
  writeLocalCollection(STORAGE_KEY, next);
  return note;
}

export async function updateNote(id: string, payload: { title: string; content: string }): Promise<Note | null> {
  const now = new Date().toISOString();

  if (isSupabaseEnabled) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('notes')
        .update({ ...payload, updated_at: now })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data as Note;
      }
    }
  }

  const notes = readLocalCollection<Note>(STORAGE_KEY, mockNotes);
  const index = notes.findIndex((note) => note.id === id);
  if (index < 0) {
    return null;
  }

  const updated = { ...notes[index], ...payload, updated_at: now };
  notes[index] = updated;
  writeLocalCollection(STORAGE_KEY, notes);
  return updated;
}

export async function deleteNote(id: string): Promise<void> {
  if (isSupabaseEnabled) {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('notes').delete().eq('id', id);
      return;
    }
  }

  const notes = readLocalCollection<Note>(STORAGE_KEY, mockNotes);
  const next = notes.filter((note) => note.id !== id);
  writeLocalCollection(STORAGE_KEY, next);
}
