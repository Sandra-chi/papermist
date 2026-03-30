import { NextRequest, NextResponse } from 'next/server';

import type { CitySearchResult } from '@/lib/weather';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim();

  if (!query) {
    return NextResponse.json({ results: [] satisfies CitySearchResult[] });
  }

  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', query);
  url.searchParams.set('count', '5');
  url.searchParams.set('language', 'zh');
  url.searchParams.set('format', 'json');

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 * 60 }
  });

  if (!response.ok) {
    return NextResponse.json({ results: [] satisfies CitySearchResult[] }, { status: 200 });
  }

  const data = (await response.json()) as {
    results?: Array<{
      id?: number;
      name: string;
      country?: string;
      admin1?: string;
      latitude: number;
      longitude: number;
      timezone: string;
    }>;
  };

  const results: CitySearchResult[] = (data.results ?? []).map((item) => ({
    id: String(item.id ?? `${item.latitude}-${item.longitude}-${item.name}`),
    name: item.name,
    country: item.country,
    admin1: item.admin1,
    latitude: item.latitude,
    longitude: item.longitude,
    timezone: item.timezone
  }));

  return NextResponse.json({ results });
}