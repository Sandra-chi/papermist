// app/shared/[id]/page.tsx
'use client';

import Link from 'next/link';
import { addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { buildMonthGrid, formatDate, getDayMeta } from '@/lib/date';
import { getSharedCalendarBundle } from '@/lib/shared/mock';
import type { SharedCalendarBundle } from '@/lib/shared/types';

const TYPE_LABEL_MAP: Record<string, string> = {
  couple: '情侣共享',
  travel: '旅行共享',
  study: '学习搭子',
  family: '家庭共用',
  custom: '自定义'
};

export default function SharedCalendarDetailPage({ params }: { params: { id: string } }) {
  const [bundle, setBundle] = useState<SharedCalendarBundle | null>(null);
  const [monthDate, setMonthDate] = useState(new Date());

  useEffect(() => {
    setBundle(getSharedCalendarBundle(params.id));
  }, [params.id]);

  const days = useMemo(() => buildMonthGrid(monthDate), [monthDate]);

  if (!bundle) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-200 bg-white/70 p-8 text-center text-slate-500">
        没找到这份共享日历。
      </div>
    );
  }

  const weekdayLabels = ['一', '二', '三', '四', '五', '六', '日'];

  const todayIso = formatDate(new Date(), 'yyyy-MM-dd');
  const todayEvents = bundle.events.filter((item) => item.eventDate === todayIso);
  const todayTodos = bundle.todos.filter((item) => item.targetDate === todayIso);
  const recentEntries = [...bundle.entries].sort((a, b) => b.entryDate.localeCompare(a.entryDate));

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Shared Calendar"
        title={`${bundle.calendar.coverEmoji} ${bundle.calendar.title}`}
        description={bundle.calendar.description || '一起安排、一起记录、一起打卡。'}
        actions={
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/invite/${bundle.calendar.inviteCode}`
                );
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              复制邀请链接
            </Button>
            <Button asChild variant="outline">
              <Link href={`/shared/${bundle.calendar.id}/${todayIso}`}>打开今天</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/shared">返回列表</Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">共享月历</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                {formatDate(monthDate, 'yyyy年M月')}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {TYPE_LABEL_MAP[bundle.calendar.type] ?? '共享日历'} · 邀请码 {bundle.calendar.inviteCode}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMonthDate((prev) => addMonths(prev, -1))}
                className="rounded-full border border-slate-200 bg-white p-3 text-slate-700 transition hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setMonthDate((prev) => addMonths(prev, 1))}
                className="rounded-full border border-slate-200 bg-white p-3 text-slate-700 transition hover:bg-slate-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-7 gap-3 text-center text-sm text-slate-400">
            {weekdayLabels.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {days.map((day) => {
              const meta = getDayMeta(day.date);

              const dayEvents = bundle.events.filter((item) => item.eventDate === day.isoDate);
              const dayTodos = bundle.todos.filter((item) => item.targetDate === day.isoDate);
              const dayEntries = bundle.entries.filter((item) => item.entryDate === day.isoDate);
              const hasContent = dayEvents.length || dayTodos.length || dayEntries.length;

              return (
                <Link
                  key={day.isoDate}
                  href={`/shared/${bundle.calendar.id}/${day.isoDate}`}
                  className={`min-h-[132px] rounded-[24px] border p-3 transition ${
                    day.isCurrentMonth
                      ? 'border-white/70 bg-white/80 hover:-translate-y-0.5 hover:shadow-sm'
                      : 'border-white/30 bg-white/40 text-slate-300'
                  } ${day.isToday ? 'ring-2 ring-rose-200' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold">{meta.dayLabel}</span>
                    {hasContent ? (
                      <span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] text-rose-600">
                        {dayEvents.length + dayTodos.length + dayEntries.length}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-slate-500">
                    <p>{meta.lunar.label}</p>
                    <p className="line-clamp-1 font-medium text-slate-700">
                      {meta.lunar.solarTerm || '共享日历'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-sm">
            <p className="text-sm text-slate-500">成员</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {bundle.members.map((member) => (
                <div
                  key={member.id}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700"
                >
                  {member.displayName}
                  <span className="ml-2 text-xs text-slate-400">
                    {member.role === 'owner' ? '创建者' : '成员'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-sm">
            <p className="text-sm text-slate-500">今天</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs text-slate-400">共享事件</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{todayEvents.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs text-slate-400">共享待办</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{todayTodos.length}</p>
              </div>
            </div>

            <div className="mt-4">
              <Button asChild className="w-full">
                <Link href={`/shared/${bundle.calendar.id}/${todayIso}`}>打开今天的共享页</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-sm">
            <p className="text-sm text-slate-500">最近共享记录</p>
            <div className="mt-4 space-y-3">
              {recentEntries.slice(0, 4).map((entry) => (
                <div key={entry.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-800">
                      {entry.title || '今日记录'}
                    </span>
                    <span className="text-xs text-slate-400">{entry.entryDate}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{entry.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-sm">
            <p className="text-sm text-slate-500">最近共享待办</p>
            <div className="mt-4 space-y-3">
              {bundle.todos.slice(0, 4).map((todo) => (
                <div key={todo.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-800">{todo.title}</span>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] ${
                        todo.status === 'done'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {todo.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{todo.targetDate}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}