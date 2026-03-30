'use client';

import { useEffect, useState } from 'react';

import { EmptyState } from '@/components/shared/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatDate, getDayMeta } from '@/lib/date';
import { getJournalEntryByDate, listJournalEntries, upsertJournalEntry } from '@/lib/repositories/journal-repo';
import type { JournalEntry, Mood } from '@/lib/types';

const moodOptions: { label: string; value: Mood }[] = [
  { label: '平静 calm', value: 'calm' },
  { label: '开心 happy', value: 'happy' },
  { label: '疲惫 tired', value: 'tired' },
  { label: '被激发 inspired', value: 'inspired' },
  { label: '忙碌 busy', value: 'busy' }
];

export function JournalEditor({ selectedDate }: { selectedDate?: string }) {
  const date = selectedDate ?? formatDate(new Date());
  const meta = getDayMeta(date);

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood>('calm');
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const [allEntries, current] = await Promise.all([listJournalEntries(), getJournalEntryByDate(date)]);
    setEntries(allEntries);
    setTitle(current?.title ?? '');
    setContent(current?.content ?? '');
    setMood(current?.mood ?? 'calm');
  }

  useEffect(() => {
    refresh();
  }, [date]);

  async function handleSave() {
    setSaving(true);
    await upsertJournalEntry({ entry_date: date, title, content, mood });
    await refresh();
    setSaving(false);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>{meta.fullLabel}</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">记录当天标题、内容和心情。第一次打开时会自动读取该日期已有手帐。</p>
            </div>
            <Badge>{meta.constellation}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="journal-title">标题</Label>
            <Input id="journal-title" placeholder="给今天一个轻柔的标题" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="journal-mood">心情</Label>
            <Select id="journal-mood" value={mood} onChange={(e) => setMood(e.target.value as Mood)}>
              {moodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="journal-content">内容</Label>
            <Textarea
              id="journal-content"
              placeholder="今天发生了什么？或者你想把哪种心情留在这里？"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSave} disabled={saving || !title.trim() || !content.trim()}>
              {saving ? '保存中...' : '保存手帐'}
            </Button>
            <Badge tone="outline">宜 {meta.lunar.suitable.join(' / ')}</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>最近手帐</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {entries.length > 0 ? (
              entries.slice(0, 6).map((entry) => (
                <div key={entry.id} className="rounded-2xl bg-white/70 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{entry.title}</p>
                    <Badge tone="soft">{entry.mood}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{entry.entry_date}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{entry.content}</p>
                </div>
              ))
            ) : (
              <EmptyState title="还没有手帐" description="从今天开始写下第一条记录吧。" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
