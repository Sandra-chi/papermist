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

import type { DayMeta, LunarInfo } from '@/lib/types';

const solarTerms = [
  '小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
  '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
];

const suitableMap = [
  ['记录', '整理', '出行'],
  ['阅读', '聚会', '手帐'],
  ['专注', '复盘', '收纳'],
  ['散步', '拍照', '种植'],
  ['计划', '写作', '学习'],
  ['社交', '清洁', '断舍离'],
  ['休息', '观影', '烹饪']
];

const avoidMap = [
  ['熬夜', '拖延'],
  ['冲动消费', '久坐'],
  ['分心', '过度安排'],
  ['急躁', '抱怨'],
  ['情绪内耗', '反复纠结'],
  ['囤积', '过劳'],
  ['临时爽约', '信息过载']
];

const moods = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', '三十一'];
const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
const zodiacs = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊'];

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
  const day = date.getDate();
  const month = date.getMonth();
  const weekday = date.getDay();

  return {
    label: `${lunarMonths[month % lunarMonths.length]}${moods[(day - 1) % moods.length]}`,
    zodiac: `${zodiacs[date.getFullYear() % 12]}年`,
    solarTerm: solarTerms[(month * 2 + (day > 15 ? 1 : 0)) % solarTerms.length],
    suitable: suitableMap[weekday],
    avoid: avoidMap[weekday]
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
