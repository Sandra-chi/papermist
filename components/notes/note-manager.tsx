'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createNote, deleteNote, listNotes } from '@/lib/repositories/note-repo';
import type { Note } from '@/lib/types';

export function NoteManager() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  async function refresh() {
    const data = await listNotes();
    setNotes(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate() {
    if (!title.trim() || !content.trim()) return;
    const created = await createNote({ title, content });
    setTitle('');
    setContent('');
    await refresh();
    router.push(`/notes/${created.id}`);
  }

  async function handleDelete(id: string) {
    await deleteNote(id);
    await refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <CardHeader>
          <CardTitle>新建笔记</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="note-title">标题</Label>
            <Input id="note-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：四月想做的事" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note-content">内容</Label>
            <Textarea id="note-content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="把想法先写下来，后面再整理。" />
          </div>
          <Button onClick={handleCreate}>保存并打开详情</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>全部笔记</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="rounded-[24px] bg-white/70 px-4 py-4">
                <Link href={`/notes/${note.id}`} className="block">
                  <p className="font-medium">{note.title}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{note.content}</p>
                </Link>
                <div className="mt-3 flex gap-3">
                  <Link href={`/notes/${note.id}`} className="text-sm text-primary">
                    查看详情
                  </Link>
                  <button className="text-sm text-muted-foreground" onClick={() => handleDelete(note.id)}>
                    删除
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="还没有笔记" description="写下第一条灵感，之后可以继续补充和编辑。" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
