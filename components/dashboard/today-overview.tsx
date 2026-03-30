'use client';

import Link from 'next/link';
import { formatISO } from 'date-fns';
import { BookOpenCheck, CalendarArrowUp, NotebookPen, Sparkles } from 'lucide-react';

import { AppCard } from '@/components/shared/app-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getDayMeta } from '@/lib/date';

export function TodayOverview() {
  const today = formatISO(new Date(), { representation: 'date' });
  const meta = getDayMeta(today);

  return (
    <AppCard
      title="今日信息"
      description="纸雾会把今天的重要信息浓缩成一页，适合打开即看。"
      action={<Badge>{meta.constellation}</Badge>}
    >
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-[24px] bg-[linear-gradient(180deg,rgba(252,249,247,0.95),rgba(244,239,236,0.85))] p-5">
          <p className="text-sm text-muted-foreground">{meta.weekdayLabel}</p>
          <div className="mt-2 flex items-end gap-3">
            <span className="text-6xl font-semibold leading-none">{meta.dayLabel}</span>
            <div className="pb-1">
              <p className="text-lg font-medium">{meta.monthLabel}</p>
              <p className="text-sm text-muted-foreground">{meta.lunar.label}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge tone="soft">{meta.lunar.solarTerm}</Badge>
            <Badge tone="outline">{meta.lunar.zodiac}</Badge>
            {meta.lunar.suitable.slice(0, 2).map((item) => (
              <Badge tone="outline" key={item}>
                宜 {item}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <Link href="/calendar" className="rounded-[24px] bg-white/70 p-4 shadow-soft transition hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <CalendarArrowUp className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">打开月历</p>
                <p className="text-sm text-muted-foreground">查看日期详情与安排</p>
              </div>
            </div>
          </Link>
          <Link href={`/journal/${today}`} className="rounded-[24px] bg-white/70 p-4 shadow-soft transition hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <NotebookPen className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">写今日手帐</p>
                <p className="text-sm text-muted-foreground">记录心情、标题与内容</p>
              </div>
            </div>
          </Link>
          <Link href="/todos" className="rounded-[24px] bg-white/70 p-4 shadow-soft transition hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <BookOpenCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">管理待办</p>
                <p className="text-sm text-muted-foreground">今天也可以很轻柔地完成任务</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href={`/journal/${today}`}>
            <Sparkles className="mr-2 h-4 w-4" />
            写一条今日记录
          </Link>
        </Button>
      </div>
    </AppCard>
  );
}
