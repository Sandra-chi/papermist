// app/shared/[id]/[date]/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CalendarPlus2, CheckCheck, NotebookPen } from 'lucide-react';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { getDayMeta } from '@/lib/date';
import {
  addSharedEntry,
  addSharedEvent,
  addSharedTodo,
  getSharedCalendarBundle,
  toggleSharedTodo
} from '@/lib/shared/mock';
import type { SharedCalendarBundle } from '@/lib/shared/types';

const MOOD_OPTIONS = [
  { value: 'sunny', label: '晴朗' },
  { value: 'cloudy', label: '多云' },
  { value: 'rainy', label: '小雨' },
  { value: 'stormy', label: '雷雨' },
  { value: 'foggy', label: '雾' },
  { value: 'snowy', label: '初雪' },
  { value: 'sunset', label: '晚霞' }
];

export default function SharedCalendarDatePage({
  params
}: {
  params: { id: string; date: string };
}) {
  const [bundle, setBundle] = useState<SharedCalendarBundle | null>(null);

  const [eventTitle, setEventTitle] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  const [todoTitle, setTodoTitle] = useState('');

  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [entryMood, setEntryMood] = useState('sunny');

  const meta = useMemo(() => getDayMeta(params.date), [params.date]);

  const refreshBundle = () => {
    setBundle(getSharedCalendarBundle(params.id));
  };

  useEffect(() => {
    refreshBundle();
  }, [params.id]);

  if (!bundle) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-200 bg-white/70 p-8 text-center text-slate-500">
        没找到这份共享日历。
      </div>
    );
  }

  const dayEvents = bundle.events.filter((item) => item.eventDate === params.date);
  const dayTodos = bundle.todos.filter((item) => item.targetDate === params.date);
  const dayEntries = bundle.entries.filter((item) => item.entryDate === params.date);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Shared Day"
        title={`${bundle.calendar.title} · ${params.date}`}
        description="在这一天里一起安排事件、待办、记录和心情天气。"
        actions={
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href={`/shared/${params.id}`}>返回共享月历</Link>
            </Button>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[24px] border border-white/70 bg-white/85 px-5 py-5 shadow-soft">
          <p className="text-xs text-muted-foreground">共享事件</p>
          <p className="mt-2 text-3xl font-semibold">{dayEvents.length}</p>
          <p className="mt-2 text-sm text-muted-foreground">今天一起安排的事项</p>
        </div>

        <div className="rounded-[24px] border border-white/70 bg-white/85 px-5 py-5 shadow-soft">
          <p className="text-xs text-muted-foreground">共享待办</p>
          <p className="mt-2 text-3xl font-semibold">{dayTodos.length}</p>
          <p className="mt-2 text-sm text-muted-foreground">今天一起推进的小事</p>
        </div>

        <div className="rounded-[24px] border border-white/70 bg-white/85 px-5 py-5 shadow-soft">
          <p className="text-xs text-muted-foreground">共享记录</p>
          <p className="mt-2 text-3xl font-semibold">{dayEntries.length}</p>
          <p className="mt-2 text-sm text-muted-foreground">今天留下的共同痕迹</p>
        </div>

        <div className="rounded-[24px] border border-white/70 bg-white/85 px-5 py-5 shadow-soft">
          <p className="text-xs text-muted-foreground">今日主题</p>
          <p className="mt-2 text-lg font-semibold">{meta.lunar.solarTerm || meta.constellation}</p>
          <p className="mt-2 text-sm text-muted-foreground">适合安排与记录的一天</p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-soft">
            <p className="text-sm text-muted-foreground">日期详情</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">{meta.fullLabel}</h2>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full bg-rose-50 px-3 py-1.5 text-sm text-rose-600">
                {meta.constellation}
              </span>
              <span className="rounded-full bg-sky-50 px-3 py-1.5 text-sm text-sky-700">
                {meta.lunar.zodiac}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                {meta.lunar.label}
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-sm text-amber-700">
                {meta.lunar.solarTerm || '平日'}
              </span>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">宜</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {meta.lunar.suitable.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-sky-100 px-3 py-1.5 text-sm text-sky-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">忌</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {meta.lunar.avoid.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-rose-50 px-3 py-1.5 text-sm text-rose-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-soft">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarPlus2 className="h-4 w-4" />
              今日共享事件
            </div>

            <div className="mt-4 space-y-3">
              {dayEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">今天还没有共享事件。</p>
              ) : (
                dayEvents.map((event) => (
                  <div key={event.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-slate-800">{event.title}</span>
                      <span className="text-xs text-slate-400">
                        {event.startTime || '--'} {event.endTime ? `- ${event.endTime}` : ''}
                      </span>
                    </div>
                    {event.location ? (
                      <p className="mt-2 text-sm text-slate-500">{event.location}</p>
                    ) : null}
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 space-y-3">
              <input
                value={eventTitle}
                onChange={(event) => setEventTitle(event.target.value)}
                placeholder="新增事件标题"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-300"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={eventStartTime}
                  onChange={(event) => setEventStartTime(event.target.value)}
                  placeholder="开始时间 19:00"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-300"
                />
                <input
                  value={eventEndTime}
                  onChange={(event) => setEventEndTime(event.target.value)}
                  placeholder="结束时间 20:00"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-300"
                />
              </div>
              <input
                value={eventLocation}
                onChange={(event) => setEventLocation(event.target.value)}
                placeholder="地点（可选）"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-300"
              />
              <Button
                onClick={() => {
                  if (!eventTitle.trim()) return;
                  addSharedEvent(params.id, {
                    eventDate: params.date,
                    title: eventTitle.trim(),
                    startTime: eventStartTime.trim(),
                    endTime: eventEndTime.trim(),
                    location: eventLocation.trim()
                  });
                  setEventTitle('');
                  setEventStartTime('');
                  setEventEndTime('');
                  setEventLocation('');
                  refreshBundle();
                }}
              >
                添加共享事件
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-soft">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCheck className="h-4 w-4" />
              今日共享待办
            </div>

            <div className="mt-4 space-y-3">
              {dayTodos.length === 0 ? (
                <p className="text-sm text-muted-foreground">今天还没有共享待办。</p>
              ) : (
                dayTodos.map((todo) => (
                  <button
                    key={todo.id}
                    type="button"
                    onClick={() => {
                      toggleSharedTodo(params.id, todo.id);
                      refreshBundle();
                    }}
                    className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-left transition hover:bg-slate-100"
                  >
                    <span className="text-sm text-slate-800">{todo.title}</span>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] ${
                        todo.status === 'done'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {todo.status === 'done' ? '已完成' : '待完成'}
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="mt-5 flex gap-3">
              <input
                value={todoTitle}
                onChange={(event) => setTodoTitle(event.target.value)}
                placeholder="新增共享待办"
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-300"
              />
              <Button
                onClick={() => {
                  if (!todoTitle.trim()) return;
                  addSharedTodo(params.id, {
                    targetDate: params.date,
                    title: todoTitle.trim()
                  });
                  setTodoTitle('');
                  refreshBundle();
                }}
              >
                添加
              </Button>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-soft">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <NotebookPen className="h-4 w-4" />
              今日共享记录
            </div>

            <div className="mt-4 space-y-3">
              {dayEntries.length === 0 ? (
                <p className="text-sm text-muted-foreground">还没有共享记录。</p>
              ) : (
                dayEntries.map((entry) => (
                  <div key={entry.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-800">
                        {entry.title || '今日记录'}
                      </span>
                      <span className="text-xs text-slate-400">{entry.moodWeather}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{entry.content}</p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 space-y-3">
              <input
                value={entryTitle}
                onChange={(event) => setEntryTitle(event.target.value)}
                placeholder="记录标题（可选）"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-300"
              />
              <textarea
                value={entryContent}
                onChange={(event) => setEntryContent(event.target.value)}
                rows={4}
                placeholder="写下一句今天的共享记录。"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-300"
              />
              <select
                value={entryMood}
                onChange={(event) => setEntryMood(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-300"
              >
                {MOOD_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <Button
                onClick={() => {
                  if (!entryContent.trim()) return;
                  addSharedEntry(params.id, {
                    entryDate: params.date,
                    title: entryTitle.trim(),
                    content: entryContent.trim(),
                    moodWeather: entryMood
                  });
                  setEntryTitle('');
                  setEntryContent('');
                  setEntryMood('sunny');
                  refreshBundle();
                }}
              >
                添加共享记录
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}