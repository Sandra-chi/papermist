// hooks/use-weather.ts
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { CitySearchResult, WeatherForecastResponse } from '@/lib/weather';

const STORAGE_KEY = 'papermist.weather.location.v1';

interface StoredLocation {
  type: 'city' | 'coords';
  city?: string;
  latitude?: number;
  longitude?: number;
  name?: string;
}

async function fetchForecastByCity(city: string) {
  const response = await fetch(`/api/weather/forecast?city=${encodeURIComponent(city)}`);
  if (!response.ok) {
    throw new Error('天气获取失败');
  }
  return (await response.json()) as WeatherForecastResponse;
}

async function fetchForecastByCoords(latitude: number, longitude: number, name = '当前位置') {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    name
  });

  const response = await fetch(`/api/weather/forecast?${params.toString()}`);
  if (!response.ok) {
    throw new Error('天气获取失败');
  }
  return (await response.json()) as WeatherForecastResponse;
}

async function searchCity(query: string) {
  const response = await fetch(`/api/weather/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) return [] as CitySearchResult[];
  const data = (await response.json()) as { results: CitySearchResult[] };
  return data.results;
}

export function useWeather() {
  const [forecast, setForecast] = useState<WeatherForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshWithCity = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchForecastByCity(city);
      setForecast(data);

      const payload: StoredLocation = {
        type: 'city',
        city,
        name: data.location.name
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      setError(err instanceof Error ? err.message : '天气获取失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshWithCoords = useCallback(async (latitude: number, longitude: number, name = '当前位置') => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchForecastByCoords(latitude, longitude, name);
      setForecast(data);

      const payload: StoredLocation = {
        type: 'coords',
        latitude,
        longitude,
        name
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      setError(err instanceof Error ? err.message : '天气获取失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchAndSelectCity = useCallback(async (query: string) => {
    setSearching(true);
    setError(null);

    try {
      const results = await searchCity(query);
      if (!results.length) {
        throw new Error('没有找到这个城市');
      }

      const target = results[0];
      await refreshWithCoords(target.latitude, target.longitude, `${target.name}${target.admin1 ? ` · ${target.admin1}` : ''}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '城市搜索失败');
    } finally {
      setSearching(false);
    }
  }, [refreshWithCoords]);

  const locateMe = useCallback(() => {
    if (!navigator.geolocation) {
      setError('当前浏览器不支持定位');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await refreshWithCoords(
          position.coords.latitude,
          position.coords.longitude,
          '当前位置'
        );
      },
      () => {
        setLoading(false);
        setError('定位失败，请改用城市搜索');
      },
      {
        enableHighAccuracy: true,
        timeout: 8000
      }
    );
  }, [refreshWithCoords]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      refreshWithCity('Tokyo');
      return;
    }

    try {
      const parsed = JSON.parse(raw) as StoredLocation;
      if (parsed.type === 'coords' && typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
        refreshWithCoords(parsed.latitude, parsed.longitude, parsed.name || '当前位置');
        return;
      }

      if (parsed.type === 'city' && parsed.city) {
        refreshWithCity(parsed.city);
        return;
      }

      refreshWithCity('Tokyo');
    } catch {
      refreshWithCity('Tokyo');
    }
  }, [refreshWithCity, refreshWithCoords]);

  const today = useMemo(() => {
    if (!forecast) return null;
    return forecast.daily[0] ?? null;
  }, [forecast]);

  return {
    forecast,
    today,
    loading,
    searching,
    error,
    refreshWithCity,
    refreshWithCoords,
    searchAndSelectCity,
    locateMe
  };
}