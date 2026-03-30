'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { formatISO } from 'date-fns';

import { AppCard } from '@/components/shared/app-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { listTodos } from '@/lib/repositories/todo-repo';
import type { Todo } from '@/lib/types';

export function TodoSummary() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    listTodos().then(setTodos);
  }, []);

  const today = formatISO(new Date(), { representation: 'date' });
  const todayTodos = useMemo(() => todos.filter((todo) => todo.target_date === today), [todos, today]);

  return (
    <AppCard
      title="今日待办概览"
      description="先把今天要做的事排成小块，完成感会更轻盈。"
      action={<Badge tone="soft">{todayTodos.filter((item) => item.status === 'done').length}/{todayTodos.length} 已完成</Badge>}
    >
      <div className="space-y-3">
        {todayTodos.length > 0 ? (
          todayTodos.slice(0, 4).map((todo) => (
            <div key={todo.id} className="flex items-start justify-between rounded-2xl bg-white/70 px-4 py-3">
              <div>
                <p className="font-medium">{todo.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{todo.description || '今天的小目标。'}</p>
              </div>
              <Badge tone={todo.status === 'done' ? 'soft' : 'outline'}>
                {todo.status === 'done' ? '已完成' : '待完成'}
              </Badge>
            </div>
          ))
        ) : (
          <div className="rounded-2xl bg-white/70 px-4 py-5 text-sm text-muted-foreground">今天还没有安排待办，可以从一件最小的事开始。</div>
        )}
      </div>
      <Button asChild variant="outline" className="mt-5">
        <Link href="/todos">前往待办页</Link>
      </Button>
    </AppCard>
  );
}
