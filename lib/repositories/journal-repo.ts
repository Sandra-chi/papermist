'use client';

import { mockJournalEntries } from '@/lib/mock-data';
import { readLocalCollection, writeLocalCollection } from '@/lib/storage/browser-store';
import { getSupabaseClient, isSupabaseEnabled } from '@/lib/supabase/client';
import type { JournalEntry, Mood } from '@/lib/types';

const STORAGE_KEY = 'papermist_journal_entries';

export async function listJournalEntries(): Promise<JournalEntry[]> {
  if (isSupabaseEnabled) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('entry_date', { ascending: false })
        .order('updated_at', { ascending: false });

      if (!error && data) {
        return data as JournalEntry[];
      }
    }
  }

  return readLocalCollection<JournalEntry>(STORAGE_KEY, mockJournalEntries);
}

export async function getJournalEntryByDate(date: string): Promise<JournalEntry | null> {
  const entries = await listJournalEntries();
  return entries.find((entry) => entry.entry_date === date) ?? null;
}

export async function upsertJournalEntry(payload: {
  entry_date: string;
  title: string;
  content: string;
  mood: Mood;
}): Promise<JournalEntry> {
  const now = new Date().toISOString();

  if (isSupabaseEnabled) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const existing = await getJournalEntryByDate(payload.entry_date);

      if (existing) {
        const { data, error } = await supabase
          .from('journal_entries')
          .update({ ...payload, updated_at: now })
          .eq('id', existing.id)
          .select()
          .single();

        if (!error && data) {
          return data as JournalEntry;
        }
      } else {
        const record = {
          id: crypto.randomUUID(),
          user_id: null,
          created_at: now,
          updated_at: now,
          ...payload
        };

        const { data, error } = await supabase.from('journal_entries').insert(record).select().single();
        if (!error && data) {
          return data as JournalEntry;
        }
      }
    }
  }

  const entries = readLocalCollection<JournalEntry>(STORAGE_KEY, mockJournalEntries);
  const existingIndex = entries.findIndex((entry) => entry.entry_date === payload.entry_date);

  if (existingIndex >= 0) {
    const updated = { ...entries[existingIndex], ...payload, updated_at: now };
    entries[existingIndex] = updated;
    writeLocalCollection(STORAGE_KEY, entries);
    return updated;
  }

  const created: JournalEntry = {
    id: crypto.randomUUID(),
    user_id: null,
    created_at: now,
    updated_at: now,
    ...payload
  };

  const next = [created, ...entries];
  writeLocalCollection(STORAGE_KEY, next);
  return created;
}
