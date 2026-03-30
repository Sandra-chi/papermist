export type Mood = 'calm' | 'happy' | 'tired' | 'inspired' | 'busy';
export type TodoStatus = 'todo' | 'done';

export interface JournalEntry {
  id: string;
  user_id: string | null;
  entry_date: string;
  title: string;
  content: string;
  mood: Mood;
  created_at: string;
  updated_at: string;
}

export interface Todo {
  id: string;
  user_id: string | null;
  title: string;
  description: string | null;
  target_date: string;
  status: TodoStatus;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  user_id: string | null;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface DailyCard {
  id: string;
  card_date: string;
  title: string;
  subtitle: string;
  image_url: string;
  theme: string;
  created_at: string;
}

export interface LunarInfo {
  label: string;
  zodiac: string;
  solarTerm: string;
  suitable: string[];
  avoid: string[];
}

export interface DayMeta {
  isoDate: string;
  dayLabel: string;
  monthLabel: string;
  weekdayLabel: string;
  fullLabel: string;
  lunar: LunarInfo;
  constellation: string;
}
