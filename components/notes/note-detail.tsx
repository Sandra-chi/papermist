'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { deleteNote, getNoteById, updateNote } from '@/lib/repositories/note-repo';
import type { Note } from '@/lib/types';

export function NoteDetail({ noteId }: { noteId: string }) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getNoteById(noteId).then((data) => {
      setNote(data);
      setTitle(data?.title ?? '');
      setContent(data?.content ?? '');
    });
  }, [noteId]);

  async function handleSave() {
    setSaving(true);
    const updated = await updateNote(noteId, { title, content });
    if (updated) {
      setNote(updated);
    }
    setSaving(false);
  }

  async function handleDelete() {
    await deleteNote(noteId);
    router.push('/notes');
  }

  if (!note) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">未找到这篇笔记，请返回列表重新选择。</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>编辑笔记</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="detail-title">标题</Label>
          <Input id="detail-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="detail-content">内容</Label>
          <Textarea id="detail-content" value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[240px]" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleSave} disabled={saving}>{saving ? '保存中...' : '保存修改'}</Button>
          <Button variant="outline" onClick={handleDelete}>删除笔记</Button>
        </div>
        <p className="text-xs text-muted-foreground">创建于 {note.created_at.slice(0, 10)}，最近更新于 {note.updated_at.slice(0, 10)}。</p>
      </CardContent>
    </Card>
  );
}
