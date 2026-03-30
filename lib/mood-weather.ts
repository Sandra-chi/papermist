// lib/mood-weather.ts
export type MoodWeatherKey =
  | 'sunny'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'foggy'
  | 'snowy'
  | 'sunset';

export interface MoodWeatherOption {
  key: MoodWeatherKey;
  label: string;
  emoji: string;
  description: string;
  gradientClass: string;
}

export interface MoodWeatherRecord {
  date: string;
  moodKey: MoodWeatherKey;
  note: string;
  updatedAt: string;
}

export const MOOD_WEATHER_OPTIONS: MoodWeatherOption[] = [
  {
    key: 'sunny',
    label: '晴朗',
    emoji: '☀️',
    description: '今天状态轻盈，适合推进重要的事。',
    gradientClass: 'from-amber-100 via-rose-50 to-white'
  },
  {
    key: 'cloudy',
    label: '多云',
    emoji: '☁️',
    description: '有些疲惫，但还能稳稳往前。',
    gradientClass: 'from-slate-100 via-white to-white'
  },
  {
    key: 'rainy',
    label: '小雨',
    emoji: '🌧️',
    description: '适合慢一点，先照顾自己。',
    gradientClass: 'from-sky-100 via-slate-50 to-white'
  },
  {
    key: 'stormy',
    label: '雷雨',
    emoji: '⛈️',
    description: '情绪翻涌，先不要逼迫自己。',
    gradientClass: 'from-indigo-100 via-slate-50 to-white'
  },
  {
    key: 'foggy',
    label: '雾',
    emoji: '🌫️',
    description: '有点迷茫，今天适合做减法。',
    gradientClass: 'from-zinc-100 via-white to-white'
  },
  {
    key: 'snowy',
    label: '初雪',
    emoji: '❄️',
    description: '心里很安静，适合写点什么。',
    gradientClass: 'from-cyan-50 via-white to-white'
  },
  {
    key: 'sunset',
    label: '晚霞',
    emoji: '🌇',
    description: '温柔收束，适合复盘与放松。',
    gradientClass: 'from-orange-100 via-rose-50 to-white'
  }
];

export function getMoodWeatherOption(key?: MoodWeatherKey | null) {
  return MOOD_WEATHER_OPTIONS.find((item) => item.key === key) ?? MOOD_WEATHER_OPTIONS[0];
}