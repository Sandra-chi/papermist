// components/calendar/date-weather-panel.tsx
'use client';

import { useMemo } from 'react';

import { MoodWeatherCard } from '@/components/weather/mood-weather-card';
import { useWeather } from '@/hooks/use-weather';
import {
  formatPercent,
  formatTemperature,
  formatWind,
  getWeatherCodeMeta
} from '@/lib/weather';

interface DateWeatherPanelProps {
  date: string;
}

export function DateWeatherPanel({ date }: DateWeatherPanelProps) {
  const { forecast, loading, error } = useWeather();

  const targetDay = useMemo(() => {
    if (!forecast) return null;
    return forecast.daily.find((item) => item.date === date) ?? null;
  }, [forecast, date]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
      <section className="rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
        <p className="text-sm text-slate-500">真实天气</p>
        <h3 className="mt-1 text-2xl font-semibold text-slate-900">日期天气</h3>
        <p className="mt-2 text-sm text-slate-500">
          真实天气预报更适合查看近期日期；超过预报范围时，这里会提示暂无数据。
        </p>

        {loading && (
          <div className="mt-5 rounded-3xl bg-slate-50 p-6 text-sm text-slate-500">
            正在获取天气...
          </div>
        )}

        {!loading && error && (
          <div className="mt-5 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!loading && !error && !targetDay && (
          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            这个日期暂时不在近期天气预报范围内。你仍然可以先记录“心情天气”。
          </div>
        )}

        {!loading && !error && targetDay && (
          <div className="mt-5 rounded-[28px] bg-gradient-to-br from-white via-sky-50 to-rose-50 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-5xl">{getWeatherCodeMeta(targetDay.weatherCode).emoji}</div>
                <h4 className="mt-4 text-2xl font-semibold text-slate-900">
                  {getWeatherCodeMeta(targetDay.weatherCode).label}
                </h4>
                <p className="mt-2 text-sm text-slate-500">
                  {forecast?.location.name} · {date}
                </p>
              </div>

              <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-600">
                <p>最高 {formatTemperature(targetDay.tempMax)}</p>
                <p className="mt-2">最低 {formatTemperature(targetDay.tempMin)}</p>
                <p className="mt-2">降水 {formatPercent(targetDay.precipitationProbability)}</p>
                <p className="mt-2">UV {targetDay.uvIndexMax ?? '--'}</p>
                {forecast && (
                  <p className="mt-2">当前风速 {formatWind(forecast.current.windSpeed)}</p>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {targetDay.sunrise && (
                <span className="rounded-full bg-white/90 px-3 py-1.5 text-sm text-slate-600">
                  日出 {targetDay.sunrise.slice(11, 16)}
                </span>
              )}
              {targetDay.sunset && (
                <span className="rounded-full bg-white/90 px-3 py-1.5 text-sm text-slate-600">
                  日落 {targetDay.sunset.slice(11, 16)}
                </span>
              )}
              <span className="rounded-full bg-white/90 px-3 py-1.5 text-sm text-slate-600">
                提示：{getWeatherCodeMeta(targetDay.weatherCode).hint}
              </span>
            </div>
          </div>
        )}
      </section>

      <MoodWeatherCard
        date={date}
        title="这一天的心情天气"
        description="你可以先为这一天设定一种内在天气。"
      />
    </div>
  );
}