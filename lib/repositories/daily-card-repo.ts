'use client';

import { formatISO } from 'date-fns';

import { mockDailyCards } from '@/lib/mock-data';
import { getSupabaseClient, isSupabaseEnabled } from '@/lib/supabase/client';
import type { DailyCard } from '@/lib/types';

export async function getDailyCard(date = formatISO(new Date(), { representation: 'date' })): Promise<DailyCard | null> {
  if (isSupabaseEnabled) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('daily_cards')
        .select('*')
        .eq('card_date', date)
        .maybeSingle();

      if (!error && data) {
        return data as DailyCard;
      }
    }
  }

  return mockDailyCards.find((card) => card.card_date === date) ?? mockDailyCards[0] ?? null;
}
