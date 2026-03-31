// app/invite/[code]/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import {
  getSharedCalendarByInviteCode,
  joinSharedCalendarByInviteCode
} from '@/lib/shared/mock';
import type { SharedCalendarBundle } from '@/lib/shared/types';

export default function InvitePage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const [bundle, setBundle] = useState<SharedCalendarBundle | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    setBundle(getSharedCalendarByInviteCode(params.code));
  }, [params.code]);

  if (!bundle) {
    return (
      <div className="space-y-6">
        <PageHeader
          badge="Invite"
          title="邀请已失效"
          description="没有找到这个共享日历的邀请码。"
        />
        <div className="rounded-[28px] border border-dashed border-slate-200 bg-white/70 p-8 text-center text-slate-500">
          这个邀请链接可能已经失效，或者邀请码不存在。
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Invite"
        title={`加入共享日历 · ${bundle.calendar.title}`}
        description="加入之后，你就可以一起查看月历、添加待办、写共享记录。"
      />

      <div className="mx-auto max-w-3xl rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-5xl">{bundle.calendar.coverEmoji}</div>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900">
              {bundle.calendar.title}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {bundle.calendar.description || '一起安排、一起记录、一起打卡。'}
            </p>
          </div>

          <div className="rounded-2xl bg-rose-50 px-4 py-3 text-right text-sm text-rose-700">
            <p>邀请码</p>
            <p className="mt-1 text-lg font-semibold">{bundle.calendar.inviteCode}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 px-4 py-4">
            <p className="text-xs text-slate-400">成员数</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {bundle.members.length}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-4">
            <p className="text-xs text-slate-400">共享事件</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {bundle.events.length}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-4">
            <p className="text-xs text-slate-400">共享记录</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {bundle.entries.length}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] bg-gradient-to-br from-white via-rose-50 to-orange-50 p-6">
          <label className="block text-sm text-slate-600">你想以什么名字加入</label>
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="例如：小雨 / Sandra / 旅行搭子"
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-300"
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              onClick={() => {
                const result = joinSharedCalendarByInviteCode(params.code, displayName);
                if (!result) return;
                setJoined(true);
                setTimeout(() => {
                  router.push(`/shared/${result.calendar.id}`);
                }, 400);
              }}
            >
              {joined ? '正在进入...' : '加入共享日历'}
            </Button>

            <Button variant="outline" onClick={() => router.push('/shared')}>
              返回共享日历
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}