'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buildMonthGrid, getDayMeta } from '@/lib/date';
import { cn } from '@/lib/utils';

const weekdays = ['一', '二', '三', '四', '五', '六', '日'];

export function CalendarGrid({
  month,
  onMonthChange
}: {
  month: Date;
  onMonthChange: (direction: 'prev' | 'next') => void;
}) {
  const days = buildMonthGrid(month);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>{format(month, 'yyyy年 M月', { locale: zhCN })}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">点击任意日期，查看当天的详细信息与记录入口。</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => onMonthChange('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onMonthChange('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-7 gap-2 text-center text-sm text-muted-foreground">
          {weekdays.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const meta = getDayMeta(day.date);
            return (
              <Link
                key={day.isoDate}
                href={`/calendar/${day.isoDate}`}
                className={cn(
                  'min-h-[110px] rounded-[22px] border px-3 py-3 transition hover:-translate-y-0.5 hover:shadow-soft',
                  day.isCurrentMonth ? 'border-white/70 bg-white/80' : 'border-white/40 bg-white/40 text-muted-foreground',
                  day.isToday && 'ring-2 ring-primary/35'
                )}
              >
                <div className="flex items-start justify-between">
                  <span className="text-base font-medium">{meta.dayLabel}</span>
                  {day.isToday ? <Badge className="px-2 py-0.5 text-[10px]">今天</Badge> : null}
                </div>
                <div className="mt-6 space-y-1">
                  <p className="text-xs text-muted-foreground">{meta.lunar.label}</p>
                  <p className="line-clamp-1 text-xs">{meta.lunar.solarTerm}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
