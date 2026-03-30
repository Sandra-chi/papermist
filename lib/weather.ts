// lib/weather.ts
export interface WeatherLocation {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface WeatherCurrent {
  time: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
}

export interface WeatherDay {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  uvIndexMax: number | null;
  sunrise?: string;
  sunset?: string;
}

export interface WeatherForecastResponse {
  location: WeatherLocation;
  current: WeatherCurrent;
  daily: WeatherDay[];
}

export interface CitySearchResult {
  id: string;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface WeatherCodeMeta {
  label: string;
  emoji: string;
  hint: string;
}

const WEATHER_CODE_MAP: Record<number, WeatherCodeMeta> = {
  0: { label: '晴朗', emoji: '☀️', hint: '适合外出与推进计划' },
  1: { label: '大致晴', emoji: '🌤️', hint: '天气稳定，适合轻量活动' },
  2: { label: '局部多云', emoji: '⛅', hint: '适合日常安排与散步' },
  3: { label: '阴天', emoji: '☁️', hint: '适合室内整理与专注' },
  45: { label: '雾', emoji: '🌫️', hint: '出行注意能见度' },
  48: { label: '冻雾', emoji: '🌫️', hint: '体感偏冷，注意保暖' },
  51: { label: '小毛雨', emoji: '🌦️', hint: '适合放慢节奏' },
  53: { label: '毛雨', emoji: '🌦️', hint: '记得带伞' },
  55: { label: '强毛雨', emoji: '🌧️', hint: '出行尽量简化' },
  56: { label: '冻毛雨', emoji: '🌨️', hint: '路面可能湿滑' },
  57: { label: '强冻毛雨', emoji: '🌨️', hint: '注意防寒防滑' },
  61: { label: '小雨', emoji: '🌧️', hint: '适合室内工作与记录' },
  63: { label: '中雨', emoji: '🌧️', hint: '建议减少外出' },
  65: { label: '大雨', emoji: '🌧️', hint: '安排留出缓冲时间' },
  66: { label: '冻雨', emoji: '🌨️', hint: '注意保暖和路况' },
  67: { label: '强冻雨', emoji: '🌨️', hint: '谨慎出行' },
  71: { label: '小雪', emoji: '🌨️', hint: '天气偏冷，适合慢一点' },
  73: { label: '中雪', emoji: '❄️', hint: '注意御寒' },
  75: { label: '大雪', emoji: '❄️', hint: '尽量减少不必要外出' },
  77: { label: '雪粒', emoji: '🌨️', hint: '注意天气变化' },
  80: { label: '阵雨', emoji: '🌦️', hint: '外出记得带伞' },
  81: { label: '较强阵雨', emoji: '🌧️', hint: '尽量压缩户外行程' },
  82: { label: '强阵雨', emoji: '⛈️', hint: '优先室内安排' },
  85: { label: '阵雪', emoji: '🌨️', hint: '保暖优先' },
  86: { label: '强阵雪', emoji: '❄️', hint: '注意天气与路况' },
  95: { label: '雷雨', emoji: '⛈️', hint: '避免长时间户外停留' },
  96: { label: '雷雨夹小冰雹', emoji: '⛈️', hint: '天气波动较大' },
  99: { label: '雷雨夹大冰雹', emoji: '⛈️', hint: '请优先确保出行安全' }
};

export function getWeatherCodeMeta(code: number): WeatherCodeMeta {
  return WEATHER_CODE_MAP[code] ?? {
    label: '天气未知',
    emoji: '🌤️',
    hint: '稍后再看一眼天气变化'
  };
}

export function formatTemperature(value: number) {
  return `${Math.round(value)}°`;
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatWind(value: number) {
  return `${Math.round(value)} km/h`;
}