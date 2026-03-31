// app/shared/new/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { createSharedCalendar } from '@/lib/shared/mock';
import type { SharedCalendarType } from '@/lib/shared/types';

const TYPE_OPTIONS: Array<{ value: SharedCalendarType; label: string }> = [
  { value: 'couple', label: '情侣共享' },
  { value: 'travel', label: '旅行共享' },
  { value: 'study', label: '学习搭子' },
  { value: 'family', label: '家庭共用' },
  { value: 'custom', label: '自定义' }
];

const THEME_OPTIONS = ['rose', 'violet', 'sky', 'emerald', 'amber'];
const EMOJI_OPTIONS = ['📅', '🌷', '✈️', '📚', '🏠', '🌤️'];

export default function NewSharedCalendarPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<SharedCalendarType>('couple');
  const [theme, setTheme] = useState('rose');
  const [coverEmoji, setCoverEmoji] = useState('📅');

  const handleCreate = () => {
    if (!title.trim()) return;

    const calendar = createSharedCalendar({
      title: title.trim(),
      description: description.trim(),
      type,
      theme,
      coverEmoji
    });

    router.push(`/shared/${calendar.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Create Shared Calendar"
        title="新建共享日历"
        description="先创建一个可以一起安排、一起记录、一起打卡的时间空间。"
      />

      <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-slate-600">共享日历名称</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="例如：春日约会日历"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-300"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-600">类型</label>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as SharedCalendarType)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-300"
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-slate-600">简介</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              placeholder="写一句这个共享日历的用途。"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-300"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-600">主题色</label>
            <div className="flex flex-wrap gap-3">
              {THEME_OPTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTheme(item)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    theme === item
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-600">封面 Emoji</label>
            <div className="flex flex-wrap gap-3">
              {EMOJI_OPTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCoverEmoji(item)}
                  className={`rounded-2xl border px-4 py-2 text-2xl transition ${
                    coverEmoji === item
                      ? 'border-rose-300 bg-rose-50'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button onClick={handleCreate} disabled={!title.trim()}>
            创建共享日历
          </Button>
          <Button variant="outline" onClick={() => router.push('/shared')}>
            返回列表
          </Button>
        </div>
      </div>
    </div>
  );
}