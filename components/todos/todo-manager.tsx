'use client';

import { useEffect, useMemo, useState } from 'react';

import { EmptyState } from '@/components/shared/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createTodo, deleteTodo, listTodos, toggleTodoStatus, updateTodo } from '@/lib/repositories/todo-repo';
import type { Todo } from '@/lib/types';

export function TodoManager({ initialDate }: { initialDate?: string }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(initialDate ?? new Date().toISOString().slice(0, 10));
  const [editingId, setEditingId] = useState<string | null>(null);

  async function refresh() {
    const data = await listTodos();
    setTodos(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  const filteredTodos = useMemo(() => todos.filter((todo) => !date || todo.target_date === date), [todos, date]);

  async function handleSubmit() {
    if (!title.trim()) return;

    if (editingId) {
      await updateTodo(editingId, { title, description, target_date: date });
      setEditingId(null);
    } else {
      await createTodo({ title, description, target_date: date });
    }

    setTitle('');
    setDescription('');
    await refresh();
  }

  function handleEdit(todo: Todo) {
    setEditingId(todo.id);
    setTitle(todo.title);
    setDescription(todo.description ?? '');
    setDate(todo.target_date);
  }

  async function handleToggle(todo: Todo) {
    await toggleTodoStatus(todo.id, todo.status === 'done' ? 'todo' : 'done');
    await refresh();
  }

  async function handleDelete(id: string) {
    await deleteTodo(id);
    await refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? '编辑待办' : '新增待办'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="todo-title">标题</Label>
            <Input id="todo-title" placeholder="例如：整理下周安排" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="todo-date">日期</Label>
            <Input id="todo-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="todo-description">备注</Label>
            <Textarea id="todo-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="可以写一点轻提醒" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSubmit}>{editingId ? '保存修改' : '新增待办'}</Button>
            {editingId ? (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setTitle('');
                  setDescription('');
                }}
              >
                取消编辑
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>待办列表</CardTitle>
            <div className="w-full md:w-56">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <div key={todo.id} className="rounded-[24px] bg-white/70 px-4 py-4">
                <div className="flex items-start gap-3">
                  <Checkbox checked={todo.status === 'done'} onChange={() => handleToggle(todo)} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <p className={todo.status === 'done' ? 'font-medium line-through text-muted-foreground' : 'font-medium'}>
                        {todo.title}
                      </p>
                      <Badge tone={todo.status === 'done' ? 'soft' : 'outline'}>{todo.status === 'done' ? '已完成' : '待完成'}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{todo.description || '暂无备注'}</p>
                    <p className="mt-2 text-xs text-muted-foreground">日期：{todo.target_date}</p>
                    <div className="mt-3 flex gap-3">
                      <button className="text-sm text-primary" onClick={() => handleEdit(todo)}>
                        编辑
                      </button>
                      <button className="text-sm text-muted-foreground" onClick={() => handleDelete(todo.id)}>
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="没有匹配的待办" description="换个日期看看，或者先新增一项任务。" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
