// app/invite/[code]/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Copy, Users2 } from 'lucide-react';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import {
  getSharedCalendarByInviteCode,
  joinSharedCalendarByInviteCode
} from '@/lib/shared/mock';
import type { SharedCalendarBundle } from '@/lib/shared/types';

const NAME_STORAGE_KEY = 'papermist.shared.join.name.v1';

export default function InvitePage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const [bundle, setBundle] = useState<SharedCalendarBundle | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    setBundle(getSharedCalendarByInviteCode(params.code));

    if (typeof window !== 'undefined') {
      const cachedName = localStorage.getItem(NAME_STORAGE_KEY);
      if (cachedName) setDisplayName(cachedName);
    }
  }, [params.code]);

  const recentMembers = useMemo(() => {
    return [...(bundle?.members ?? [])].slice(0, 4);
  }, [bundle]);

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

      <div className="mx-auto max-w-4xl rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-soft">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <section>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-5xl">{bundle.calendar.coverEmoji}</div>
                <h2 className="mt-4 text-3xl font-semibold text-slate-900">
                  {bundle.calendar.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {bundle.calendar.description || '一起安排、一起记录、一起打卡。'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
              >
                <Copy className="h-4 w-4" />
                复制链接
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs text-muted-foreground">邀请码</p>
                <p className="mt-2 text-lg font-semibold">{bundle.calendar.inviteCode}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs text-muted-foreground">成员数</p>
                <p className="mt-2 text-lg font-semibold">{bundle.members.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs text-muted-foreground">共享记录</p>
                <p className="mt-2 text-lg font-semibold">{bundle.entries.length}</p>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] bg-gradient-to-br from-white via-rose-50 to-orange-50 px-5 py-5">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users2 className="h-4 w-4" />
                当前成员
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {recentMembers.map((member) => (
                  <div
                    key={member.id}
                    className="rounded-full bg-white px-4 py-2 text-sm text-slate-700 shadow-soft"
                  >
                    {member.displayName}
                    <span className="ml-2 text-xs text-slate-400">
                      {member.role === 'owner' ? '创建者' : '成员'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[28px] bg-slate-50/80 p-6">
            <p className="text-sm text-muted-foreground">加入设置</p>
            <h3 className="mt-2 text-2xl font-semibold">以你的名字加入</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              先设一个在共享日历中显示的名字。后面你就可以一起查看月历、打卡、记录和安排事件。
            </p>

            <div className="mt-6">
              <label className="mb-2 block text-sm text-slate-600">显示名称</label>
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="例如：Sandra / 小雨 / 旅行搭子"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-300"
              />
            </div>

            <div className="mt-6 rounded-2xl bg-white px-4 py-4 text-sm text-muted-foreground">
              加入后你可以：
              <ul className="mt-3 space-y-2">
                <li>· 查看共享月历和每日安排</li>
                <li>· 添加共享事件和共享待办</li>
                <li>· 写下当天的一句话记录</li>
                <li>· 和搭子一起维护这份时间空间</li>
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  const safeName = displayName.trim() || '新成员';
                  if (typeof window !== 'undefined') {
                    localStorage.setItem(NAME_STORAGE_KEY, safeName);
                  }
                  const result = joinSharedCalendarByInviteCode(params.code, safeName);
                  if (!result) return;
                  setJoined(true);
                  setTimeout(() => {
                    router.push(`/shared/${result.calendar.id}`);
                  }, 500);
                }}
              >
                {joined ? '正在进入...' : '加入共享日历'}
              </Button>

              <Button variant="outline" onClick={() => router.push('/shared')}>
                稍后再说
              </Button>
            </div>

            {joined ? (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                加入成功，正在进入共享空间
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}