'use client';

import Link from 'next/link';
import { BookHeart, ClipboardList } from 'lucide-react';

import { AppCard } from '@/components/shared/app-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getDayMeta } from '@/lib/date';

export function DateDetailPanel({ date }: { date: string }) {
  const meta = getDayMeta(date);

  return (
    <AppCard title="日期详情" description="这是一个为生活记录设计的日期详情卡，后续可继续扩展更多历法与提醒能力。">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[24px] bg-white/70 p-5">
          <p className="text-sm text-muted-foreground">公历日期</p>
          <p className="mt-2 text-2xl font-semibold">{meta.fullLabel}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>{meta.constellation}</Badge>
            <Badge tone="soft">{meta.lunar.zodiac}</Badge>
            <Badge tone="outline">{meta.lunar.solarTerm}</Badge>
          </div>
        </div>

        <div className="rounded-[24px] bg-white/70 p-5">
          <p className="text-sm text-muted-foreground">农历与黄历信息</p>
          <p className="mt-2 text-2xl font-semibold">{meta.lunar.label}</p>
          <div className="mt-4 space-y-3 text-sm">
            <div>
              <p className="mb-2 text-muted-foreground">宜</p>
              <div className="flex flex-wrap gap-2">
                {meta.lunar.suitable.map((item) => (
                  <Badge key={item} tone="soft">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-muted-foreground">忌</p>
              <div className="flex flex-wrap gap-2">
                {meta.lunar.avoid.map((item) => (
                  <Badge key={item} tone="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button asChild>
          <Link href={`/journal/${date}`}>
            <BookHeart className="mr-2 h-4 w-4" />
            打开当日手帐
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/todos?date=${date}`}>
            <ClipboardList className="mr-2 h-4 w-4" />
            查看当日待办
          </Link>
        </Button>
      </div>
    </AppCard>
  );
}
