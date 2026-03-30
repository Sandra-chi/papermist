// components/weather/mood-weather-card.tsx
'use client';

import clsx from 'clsx';

import { useMoodWeather } from '@/hooks/use-mood-weather';
import { getMoodWeatherOption, MOOD_WEATHER_OPTIONS } from '@/lib/mood-weather';

interface MoodWeatherCardProps {
  date: string;
  title?: string;
  description?: string;
}

export function MoodWeatherCard({
  date,
  title = '今日心情天气',
  description = '把今天的内在天气也记录下来。'
}: MoodWeatherCardProps) {
  const { record, updateMood, updateNote } = useMoodWeather(date);
  const active = getMoodWeatherOption(record?.moodKey ?? 'sunny');

  return (
    <section
      className={clsx(
        'rounded-[28px] border border-white/60 bg-gradient-to-br p-6 shadow-sm backdrop-blur',
        active.gradientClass
      )}
    >
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-1 text-2xl font-semibold text-slate-900">{active.emoji} {active.label}</h3>
      <p className="mt-2 text-sm text-slate-600">{record?.note || active.description}</p>
      <p className="mt-1 text-xs text-slate-400">日期：{date}</p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {MOOD_WEATHER_OPTIONS.map((item) => {
          const selected = record?.moodKey === item.key || (!record && item.key === 'sunny');

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => updateMood(item.key)}
              className={clsx(
                'rounded-2xl border px-4 py-3 text-left transition',
                selected
                  ? 'border-rose-300 bg-white/80 shadow-sm'
                  : 'border-white/50 bg-white/50 hover:bg-white/70'
              )}
            >
              <div className="text-2xl">{item.emoji}</div>
              <div className="mt-2 text-sm font-medium text-slate-800">{item.label}</div>
              <div className="mt-1 text-xs text-slate-500">{item.description}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <label htmlFor={`mood-note-${date}`} className="mb-2 block text-sm text-slate-600">
          一句状态备注
        </label>
        <textarea
          id={`mood-note-${date}`}
          value={record?.note ?? ''}
          onChange={(event) => updateNote(event.target.value)}
          placeholder={description}
          rows={4}
          className="w-full rounded-2xl border border-white/60 bg-white/80 p-4 text-sm text-slate-700 outline-none transition focus:border-rose-300"
        />
      </div>
    </section>
  );
}