// hooks/use-mood-weather.ts
'use client';

import { useEffect, useMemo, useState } from 'react';

import type { MoodWeatherKey, MoodWeatherRecord } from '@/lib/mood-weather';

const STORAGE_KEY = 'papermist.mood.weather.v1';

type MoodWeatherStore = Record<string, MoodWeatherRecord>;

function readStore(): MoodWeatherStore {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as MoodWeatherStore;
  } catch {
    return {};
  }
}

function writeStore(store: MoodWeatherStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function useMoodWeather(date: string) {
  const [store, setStore] = useState<MoodWeatherStore>({});

  useEffect(() => {
    setStore(readStore());
  }, []);

  const record = useMemo(() => store[date] ?? null, [store, date]);

  const updateMood = (moodKey: MoodWeatherKey) => {
    const next: MoodWeatherRecord = {
      date,
      moodKey,
      note: store[date]?.note ?? '',
      updatedAt: new Date().toISOString()
    };

    const newStore = {
      ...store,
      [date]: next
    };

    setStore(newStore);
    writeStore(newStore);
  };

  const updateNote = (note: string) => {
    const next: MoodWeatherRecord = {
      date,
      moodKey: store[date]?.moodKey ?? 'sunny',
      note,
      updatedAt: new Date().toISOString()
    };

    const newStore = {
      ...store,
      [date]: next
    };

    setStore(newStore);
    writeStore(newStore);
  };

  return {
    record,
    updateMood,
    updateNote
  };
}