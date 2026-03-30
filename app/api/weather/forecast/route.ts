import { NextRequest, NextResponse } from 'next/server';

import type { WeatherForecastResponse } from '@/lib/weather';

async function resolveCity(city: string) {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', city);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'zh');
  url.searchParams.set('format', 'json');

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 * 60 }
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    results?: Array<{
      name: string;
      country?: string;
      latitude: number;
      longitude: number;
      timezone: string;
    }>;
  };

  return data.results?.[0] ?? null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const city = searchParams.get('city')?.trim();
  const latitudeParam = searchParams.get('latitude');
  const longitudeParam = searchParams.get('longitude');
  const nameParam = searchParams.get('name')?.trim() || '当前位置';

  let latitude = latitudeParam ? Number(latitudeParam) : null;
  let longitude = longitudeParam ? Number(longitudeParam) : null;
  let timezone = searchParams.get('timezone') || 'auto';
  let locationName = nameParam;
  let country: string | undefined;

  if ((latitude === null || Number.isNaN(latitude) || longitude === null || Number.isNaN(longitude)) && city) {
    const resolved = await resolveCity(city);

    if (!resolved) {
      return NextResponse.json({ message: '未找到该城市' }, { status: 404 });
    }

    latitude = resolved.latitude;
    longitude = resolved.longitude;
    timezone = resolved.timezone || 'auto';
    locationName = resolved.name;
    country = resolved.country;
  }

  if (latitude === null || Number.isNaN(latitude) || longitude === null || Number.isNaN(longitude)) {
    return NextResponse.json({ message: '缺少有效经纬度或城市名' }, { status: 400 });
  }

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set(
    'current',
    'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m'
  );
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset'
  );
  url.searchParams.set('forecast_days', '7');
  url.searchParams.set('timezone', timezone);

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 * 30 }
  });

  if (!response.ok) {
    return NextResponse.json({ message: '天气接口请求失败' }, { status: 502 });
  }

  const data = (await response.json()) as {
    timezone: string;
    current: {
      time: string;
      temperature_2m: number;
      apparent_temperature: number;
      relative_humidity_2m: number;
      weather_code: number;
      wind_speed_10m: number;
    };
    daily: {
      time: string[];
      weather_code: number[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      precipitation_probability_max: number[];
      uv_index_max: Array<number | null>;
      sunrise?: string[];
      sunset?: string[];
    };
  };

  const payload: WeatherForecastResponse = {
    location: {
      name: locationName,
      country,
      latitude,
      longitude,
      timezone: data.timezone
    },
    current: {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code
    },
    daily: data.daily.time.map((date, index) => ({
      date,
      weatherCode: data.daily.weather_code[index],
      tempMax: data.daily.temperature_2m_max[index],
      tempMin: data.daily.temperature_2m_min[index],
      precipitationProbability: data.daily.precipitation_probability_max[index],
      uvIndexMax: data.daily.uv_index_max[index] ?? null,
      sunrise: data.daily.sunrise?.[index],
      sunset: data.daily.sunset?.[index]
    }))
  };

  return NextResponse.json(payload);
}