'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { AppCard } from '@/components/shared/app-card';
import { Button } from '@/components/ui/button';
import { listNotes } from '@/lib/repositories/note-repo';
import type { Note } from '@/lib/types';

export function NoteSummary() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    listNotes().then((data) => setNotes(data.slice(0, 3)));
  }, []);

  return (
    <AppCard title="最近笔记" description="灵感、计划和零散想法，都可以先存在这里。">
      <div className="space-y-3">
        {notes.length > 0 ? (
          notes.map((note) => (
            <Link key={note.id} href={`/notes/${note.id}`} className="block rounded-2xl bg-white/70 px-4 py-4 transition hover:-translate-y-0.5">
              <p className="font-medium">{note.title}</p>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{note.content}</p>
            </Link>
          ))
        ) : (
          <div className="rounded-2xl bg-white/70 px-4 py-5 text-sm text-muted-foreground">还没有笔记，先记下一句今天的想法吧。</div>
        )}
      </div>
      <Button asChild variant="outline" className="mt-5">
        <Link href="/notes">查看全部笔记</Link>
      </Button>
    </AppCard>
  );
}
