// app/shared/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, CheckCheck, Sparkles, Users2 } from 'lucide-react';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/date';
import { getSharedCalendarBundle, getSharedCalendars } from '@/lib/shared/mock';
import type { SharedCalendar } from '@/lib/shared/types';

const TYPE_LABEL_MAP: Record<string, string> = {
  couple: '情侣',
  travel: '旅行',
  study: '学习',
  family: '家庭',
  custom: '自定义'
};

interface SharedListItem extends SharedCalendar {
  memberCount: number;
  todayEvents: number;
  doneTodos: number;
  totalTodos: number;
  recentEntryContent: string;
}

export default function SharedCalendarsPage() {
  const [calendars, setCalendars] = useState<SharedListItem[]>([]);

  useEffect(() => {
    const today = formatDate(new Date(), 'yyyy-MM-dd');
    const base = getSharedCalendars();

    const next = base.map((calendar) => {
      const bundle = getSharedCalendarBundle(calendar.id);

      return {
        ...calendar,
        memberCount: bundle?.members.length ?? 0,
        todayEvents: bundle?.events.filter((item) => item.eventDate === today).length ?? 0,
        doneTodos: bundle?.todos.filter((item) => item.status === 'done').length ?? 0,
        totalTodos: bundle?.todos.length ?? 0,
        recentEntryContent:
          [...(bundle?.entries ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
            ?.content || '还没有新的共享记录，今天可以一起写下一句话。'
      };
    });

    setCalendars(next);
  }, []);

  const summary = useMemo(() => {
    return calendars.reduce(
      (acc, item) => {
        acc.count += 1;
        acc.memberCount += item.memberCount;
        acc.todayEvents += item.todayEvents;
        acc.totalTodos += item.totalTodos;
        acc.doneTodos += item.doneTodos;
        return acc;
      },
      {
        count: 0,
        memberCount: 0,
        todayEvents: 0,
        totalTodos: 0,
        doneTodos: 0
      }
    );
  }, [calendars]);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Shared Calendar"
        title="共享日历"
        description="把情侣、旅行、学习搭子或家庭共用的计划与记录，放进同一份柔和月历里。"
        actions={
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/">返回首页</Link>
            </Button>
            <Button asChild>
              <Link href="/shared/new">新建共享日历</Link>
            </Button>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[24px] border border-white/70 bg-white/85 px-5 py-5 shadow-soft">
          <p className="text-xs text-muted-foreground">共享空间</p>
          <p className="mt-2 text-3xl font-semibold">{summary.count}</p>
          <p className="mt-2 text-sm text-muted-foreground">当前参与的共享日历数量</p>
        </div>

        <div className="rounded-[24px] border border-white/70 bg-white/85 px-5 py-5 shadow-soft">
          <p className="text-xs text-muted-foreground">成员总数</p>
          <p className="mt-2 text-3xl font-semibold">{summary.memberCount}</p>
          <p className="mt-2 text-sm text-muted-foreground">正在一起使用这些日历的人</p>
        </div>

        <div className="rounded-[24px] border border-white/70 bg-white/85 px-5 py-5 shadow-soft">
          <p className="text-xs text-muted-foreground">今日共享事件</p>
          <p className="mt-2 text-3xl font-semibold">{summary.todayEvents}</p>
          <p className="mt-2 text-sm text-muted-foreground">今天一起要关注的安排</p>
        </div>

        <div className="rounded-[24px] border border-white/70 bg-white/85 px-5 py-5 shadow-soft">
          <p className="text-xs text-muted-foreground">待办完成</p>
          <p className="mt-2 text-3xl font-semibold">
            {summary.totalTodos ? `${summary.doneTodos}/${summary.totalTodos}` : '0'}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">共享事项的推进进度</p>
        </div>
      </section>

      {calendars.length === 0 ? (
        <section className="rounded-[32px] border border-dashed border-slate-200 bg-white/75 p-10 text-center shadow-soft">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <Users2 className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold">还没有共享日历</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            你可以先创建一份情侣、旅行、学习搭子或家庭共享日历，把安排、打卡和今天的一句话放进去。
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild>
              <Link href="/shared/new">创建第一份共享日历</Link>
            </Button>
          </div>
        </section>
      ) : (
        <section className="grid gap-6 xl:grid-cols-2">
          {calendars.map((calendar) => (
            <Link
              key={calendar.id}
              href={`/shared/${calendar.id}`}
              className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-mist"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-slate-50 text-3xl shadow-soft">
                    {calendar.coverEmoji}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold">{calendar.title}</h3>
                      <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] text-rose-600">
                        {TYPE_LABEL_MAP[calendar.type] ?? '共享'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {calendar.description || '一起安排、一起记录、一起打卡。'}
                    </p>
                  </div>
                </div>

                <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground" />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Users2 className="h-3.5 w-3.5" />
                    成员
                  </p>
                  <p className="mt-2 text-xl font-semibold">{calendar.memberCount}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    今日事件
                  </p>
                  <p className="mt-2 text-xl font-semibold">{calendar.todayEvents}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <CheckCheck className="h-3.5 w-3.5" />
                    待办进度
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    {calendar.totalTodos ? `${calendar.doneTodos}/${calendar.totalTodos}` : '0'}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-[24px] bg-gradient-to-br from-white via-rose-50/50 to-orange-50/60 px-5 py-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  最近共享记录
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground/80">
                  {calendar.recentEntryContent}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                <span>邀请码：{calendar.inviteCode}</span>
                <span>更新于 {calendar.updatedAt.slice(0, 10)}</span>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}