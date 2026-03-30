import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Solar } from 'lunar-typescript';

import type { DayMeta, LunarInfo } from '@/lib/types';

function toSolar(date: Date) {
  return Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

function ensureArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

export function formatDate(date: Date | string, pattern = 'yyyy-MM-dd') {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return format(parsed, pattern, { locale: zhCN });
}

export function getConstellation(date: Date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '水瓶座';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return '双鱼座';
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '白羊座';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '金牛座';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '双子座';
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '巨蟹座';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '狮子座';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '处女座';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return '天秤座';
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return '天蝎座';
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return '射手座';
  return '摩羯座';
}

export function getPlaceholderLunarInfo(date: Date): LunarInfo {
  const solar = toSolar(date);
  const lunar = solar.getLunar();

  const lunarMonth = lunar.getMonthInChinese();
  const lunarDay = lunar.getDayInChinese();

  const lunarFestivals = ensureArray(lunar.getFestivals?.());
  const lunarOtherFestivals = ensureArray(lunar.getOtherFestivals?.());
  const solarFestivals = ensureArray(solar.getFestivals?.());

  const jieQi = lunar.getJieQi?.() || '';
  const yueXiang = lunar.getYueXiang?.() || '';

  const suitable = ensureArray(lunar.getDayYi?.()).slice(0, 3);
  const avoid = ensureArray(lunar.getDayJi?.()).slice(0, 3);

  return {
    label: `${lunarMonth}月${lunarDay}`,
    zodiac: `${lunar.getYearShengXiao()}年`,
    solarTerm:
      jieQi ||
      lunarFestivals[0] ||
      lunarOtherFestivals[0] ||
      solarFestivals[0] ||
      yueXiang ||
      '',
    suitable: suitable.length ? suitable : ['记录', '整理', '休息'],
    avoid: avoid.length ? avoid : ['过劳', '拖延']
  };
}

export function getDayMeta(input: Date | string): DayMeta {
  const date = typeof input === 'string' ? parseISO(input) : input;
  const lunar = getPlaceholderLunarInfo(date);

  return {
    isoDate: format(date, 'yyyy-MM-dd'),
    dayLabel: format(date, 'd'),
    monthLabel: format(date, 'M月'),
    weekdayLabel: format(date, 'EEEE', { locale: zhCN }),
    fullLabel: format(date, 'yyyy年M月d日 EEEE', { locale: zhCN }),
    lunar,
    constellation: getConstellation(date)
  };
}

export interface CalendarDay {
  date: Date;
  isoDate: string;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function buildMonthGrid(monthDate: Date): CalendarDay[] {
  const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 });
  const days: CalendarDay[] = [];

  let cursor = start;
  while (cursor <= end) {
    days.push({
      date: cursor,
      isoDate: format(cursor, 'yyyy-MM-dd'),
      isCurrentMonth: isSameMonth(cursor, monthDate),
      isToday: isSameDay(cursor, new Date())
    });
    cursor = addDays(cursor, 1);
  }

  return days;
}