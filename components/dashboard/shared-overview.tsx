// components/dashboard/shared-overview.tsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, Users2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/date';
import { getSharedCalendarBundle, getSharedCalendars } from '@/lib/shared/mock';

interface SharedOverviewItem {
  id: string;
  title: string;
  coverEmoji: string;
  inviteCode: string;
  memberCount: number;
  todayEvents: number;
  todayTodos: number;
  recentEntryTitle: string;
  recentEntryContent: string;
}

export function SharedOverview() {
  const [items, setItems] = useState<SharedOverviewItem[]>([]);

  useEffect(() => {
    const calendars = getSharedCalendars();
    const today = formatDate(new Date(), 'yyyy-MM-dd');

    const nextItems = calendars
      .map((calendar) => {
        const bundle = getSharedCalendarBundle(calendar.id);
        if (!bundle) return null;

        const todayEvents = bundle.events.filter((item) => item.eventDate === today).length;
        const todayTodos = bundle.todos.filter((item) => item.targetDate === today).length;

        const recentEntry = [...bundle.entries].sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt)
        )[0];

        return {
          id: calendar.id,
          title: calendar.title,
          coverEmoji: calendar.coverEmoji,
          inviteCode: calendar.inviteCode,
          memberCount: bundle.members.length,
          todayEvents,
          todayTodos,
          recentEntryTitle: recentEntry?.title || '最近还没有新的共享记录',
          recentEntryContent: recentEntry?.content || '可以和搭子一起写下今天的一句话。'
        };
      })
      .filter((item): item is SharedOverviewItem => Boolean(item));

    setItems(nextItems);
  }, []);

  const summary = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.calendars += 1;
        acc.todayEvents += item.todayEvents;
        acc.todayTodos += item.todayTodos;
        return acc;
      },
      {
        calendars: 0,
        todayEvents: 0,
        todayTodos: 0
      }
    );
  }, [items]);

  return (
    <section className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Shared Space</p>
          <h2 className="mt-1 text-2xl font-semibold">共享空间概览</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            把情侣、旅行、学习搭子或家庭共用日历集中在这里。你可以快速看到今天的共享事件、待办和最新记录。
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/shared">进入共享日历</Link>
          </Button>
          <Button asChild>
            <Link href="/shared/new">新建共享日历</Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] bg-rose-50/80 px-5 py-5">
          <p className="text-xs text-rose-500">共享日历</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{summary.calendars}</p>
          <p className="mt-2 text-sm text-muted-foreground">我当前参与的共享空间数量</p>
        </div>

        <div className="rounded-[24px] bg-sky-50/80 px-5 py-5">
          <p className="text-xs text-sky-600">今日共享事件</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{summary.todayEvents}</p>
          <p className="mt-2 text-sm text-muted-foreground">今天需要一起关注的安排</p>
        </div>

        <div className="rounded-[24px] bg-amber-50/80 px-5 py-5">
          <p className="text-xs text-amber-600">今日共享待办</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{summary.todayTodos}</p>
          <p className="mt-2 text-sm text-muted-foreground">今天共同推进的小事数量</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {items.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-muted-foreground xl:col-span-2">
            你还没有共享日历，先创建第一份吧。
          </div>
        ) : (
          items.slice(0, 4).map((item) => (
            <Link
              key={item.id}
              href={`/shared/${item.id}`}
              className="rounded-[24px] border border-white/70 bg-slate-50/80 p-5 transition hover:bg-white hover:shadow-soft"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-soft">
                    {item.coverEmoji}
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-foreground">{item.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Users2 className="h-3.5 w-3.5" />
                        {item.memberCount} 位成员
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        邀请码 {item.inviteCode}
                      </span>
                    </div>
                  </div>
                </div>

                <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white px-4 py-3">
                  <p className="text-[11px] text-muted-foreground">今日事件</p>
                  <p className="mt-1 text-lg font-semibold">{item.todayEvents}</p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3">
                  <p className="text-[11px] text-muted-foreground">今日待办</p>
                  <p className="mt-1 text-lg font-semibold">{item.todayTodos}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-white px-4 py-4">
                <p className="text-xs text-muted-foreground">{item.recentEntryTitle}</p>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground/80">
                  {item.recentEntryContent}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}