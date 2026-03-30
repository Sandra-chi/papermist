'use client';

import { mockTodos } from '@/lib/mock-data';
import { readLocalCollection, writeLocalCollection } from '@/lib/storage/browser-store';
import { getSupabaseClient, isSupabaseEnabled } from '@/lib/supabase/client';
import type { Todo, TodoStatus } from '@/lib/types';

const STORAGE_KEY = 'papermist_todos';

export async function listTodos(): Promise<Todo[]> {
  if (isSupabaseEnabled) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('target_date', { ascending: true })
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as Todo[];
      }
    }
  }

  return readLocalCollection<Todo>(STORAGE_KEY, mockTodos);
}

export async function createTodo(payload: {
  title: string;
  description: string;
  target_date: string;
}): Promise<Todo> {
  const now = new Date().toISOString();
  const record: Todo = {
    id: crypto.randomUUID(),
    user_id: null,
    title: payload.title,
    description: payload.description || null,
    target_date: payload.target_date,
    status: 'todo',
    created_at: now,
    updated_at: now
  };

  if (isSupabaseEnabled) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from('todos').insert(record).select().single();
      if (!error && data) {
        return data as Todo;
      }
    }
  }

  const todos = readLocalCollection<Todo>(STORAGE_KEY, mockTodos);
  const next = [record, ...todos];
  writeLocalCollection(STORAGE_KEY, next);
  return record;
}

export async function updateTodo(id: string, updates: Partial<Pick<Todo, 'title' | 'description' | 'target_date' | 'status'>>): Promise<Todo | null> {
  const now = new Date().toISOString();

  if (isSupabaseEnabled) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('todos')
        .update({ ...updates, updated_at: now })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data as Todo;
      }
    }
  }

  const todos = readLocalCollection<Todo>(STORAGE_KEY, mockTodos);
  const index = todos.findIndex((todo) => todo.id === id);
  if (index < 0) {
    return null;
  }

  const updated = { ...todos[index], ...updates, updated_at: now };
  todos[index] = updated;
  writeLocalCollection(STORAGE_KEY, todos);
  return updated;
}

export async function toggleTodoStatus(id: string, nextStatus: TodoStatus): Promise<Todo | null> {
  return updateTodo(id, { status: nextStatus });
}

export async function deleteTodo(id: string): Promise<void> {
  if (isSupabaseEnabled) {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('todos').delete().eq('id', id);
      return;
    }
  }

  const todos = readLocalCollection<Todo>(STORAGE_KEY, mockTodos);
  const next = todos.filter((todo) => todo.id !== id);
  writeLocalCollection(STORAGE_KEY, next);
}
