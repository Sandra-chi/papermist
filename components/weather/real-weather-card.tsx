// components/weather/real-weather-card.tsx
'use client';

import { useMemo, useState } from 'react';
import { Loader2, LocateFixed, Search } from 'lucide-react';

import { useWeather } from '@/hooks/use-weather';
import {
  formatPercent,
  formatTemperature,
  formatWind,
  getWeatherCodeMeta
} from '@/lib/weather';

export function RealWeatherCard() {
  const [query, setQuery] = useState('');
  const { forecast, today, loading, searching, error, searchAndSelectCity, locateMe } = useWeather();

  const currentMeta = useMemo(() => {
    if (!forecast) return null;
    return getWeatherCodeMeta(forecast.current.weatherCode);
  }, [forecast]);

  return (
    <section className="rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">真实天气</p>
          <h3 className="mt-1 text-2xl font-semibold text-slate-900">今天天气</h3>
          <p className="mt-1 text-sm text-slate-500">
            {forecast ? `${forecast.location.name}${forecast.location.country ? ` · ${forecast.location.country}` : ''}` : '正在获取位置天气'}
          </p>
        </div>

        <button
          type="button"
          onClick={locateMe}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
        >
          <LocateFixed className="h-4 w-4" />
          使用当前位置
        </button>
      </div>

      <div className="mb-5 flex gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && query.trim()) {
                void searchAndSelectCity(query.trim());
              }
            }}
            placeholder="搜索城市，例如 Tokyo / 上海 / 北京"
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-rose-300"
          />
        </div>

        <button
          type="button"
          disabled={!query.trim() || searching}
          onClick={() => void searchAndSelectCity(query.trim())}
          className="rounded-2xl bg-rose-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {searching ? '搜索中...' : '查天气'}
        </button>
      </div>

      {loading && (
        <div className="flex min-h-[180px] items-center justify-center rounded-3xl bg-slate-50 text-slate-500">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          正在获取天气...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {!loading && !error && forecast && today && currentMeta && (
        <>
          <div className="mb-5 rounded-[28px] bg-gradient-to-br from-white via-rose-50 to-orange-50 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-5xl">{currentMeta.emoji}</p>
                <h4 className="mt-4 text-4xl font-semibold text-slate-900">
                  {formatTemperature(forecast.current.temperature)}
                </h4>
                <p className="mt-2 text-base text-slate-700">{currentMeta.label}</p>
                <p className="mt-1 text-sm text-slate-500">{currentMeta.hint}</p>
              </div>

              <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-600">
                <p>体感 {formatTemperature(forecast.current.apparentTemperature)}</p>
                <p className="mt-2">湿度 {formatPercent(forecast.current.humidity)}</p>
                <p className="mt-2">风速 {formatWind(forecast.current.windSpeed)}</p>
                <p className="mt-2">降水概率 {formatPercent(today.precipitationProbability)}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="rounded-full bg-white/80 px-3 py-1.5">
                今日最高 {formatTemperature(today.tempMax)}
              </span>
              <span className="rounded-full bg-white/80 px-3 py-1.5">
                今日最低 {formatTemperature(today.tempMin)}
              </span>
              <span className="rounded-full bg-white/80 px-3 py-1.5">
                UV {today.uvIndexMax ?? '--'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
            {forecast.daily.map((day) => {
              const meta = getWeatherCodeMeta(day.weatherCode);
              const weekday = new Date(day.date).toLocaleDateString('zh-CN', { weekday: 'short' });

              return (
                <div
                  key={day.date}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-center"
                >
                  <p className="text-xs text-slate-500">{weekday}</p>
                  <p className="mt-1 text-xs text-slate-400">{day.date.slice(5)}</p>
                  <p className="mt-2 text-2xl">{meta.emoji}</p>
                  <p className="mt-2 text-xs text-slate-700">{meta.label}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {Math.round(day.tempMin)}° / {Math.round(day.tempMax)}°
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}