import { addDays, formatISO } from 'date-fns';

import type { DailyCard, Note, JournalEntry, Todo } from '@/lib/types';

const today = new Date();

export const mockDailyCards: DailyCard[] = [
  {
    id: 'card-today',
    card_date: formatISO(today, { representation: 'date' }),
    title: '雾里拾光，纸上安放心事',
    subtitle: '把今天放慢一点，用柔和的节奏安排生活、记录灵感与心情。',
    image_url:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    theme: 'Paper Calm',
    created_at: today.toISOString()
  },
  {
    id: 'card-tomorrow',
    card_date: formatISO(addDays(today, 1), { representation: 'date' }),
    title: '春日云影，适合整理愿望',
    subtitle: '把想做的事拆成小步骤，明天也会比今天更轻盈。',
    image_url:
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
    theme: 'Soft Bloom',
    created_at: today.toISOString()
  }
];

export const mockNotes: Note[] = [
  {
    id: 'note-1',
    user_id: null,
    title: '纸雾灵感清单',
    content: '想做一个像纸本手帐一样柔和的首页：今日信息、画报、待办与手帐同屏可见。',
    created_at: today.toISOString(),
    updated_at: today.toISOString()
  },
  {
    id: 'note-2',
    user_id: null,
    title: '本周想完成的三件事',
    content: '1. 整理四月计划\n2. 给自己留一个无打扰夜晚\n3. 试着每天写两句记录',
    created_at: addDays(today, -1).toISOString(),
    updated_at: addDays(today, -1).toISOString()
  }
];

export const mockTodos: Todo[] = [
  {
    id: 'todo-1',
    user_id: null,
    title: '整理三月手帐封面',
    description: '挑选一张浅色系画报作为封面灵感',
    target_date: formatISO(today, { representation: 'date' }),
    status: 'todo',
    created_at: today.toISOString(),
    updated_at: today.toISOString()
  },
  {
    id: 'todo-2',
    user_id: null,
    title: '晚间散步 20 分钟',
    description: '散步后记录心情',
    target_date: formatISO(today, { representation: 'date' }),
    status: 'done',
    created_at: today.toISOString(),
    updated_at: today.toISOString()
  }
];

export const mockJournalEntries: JournalEntry[] = [
  {
    id: 'journal-1',
    user_id: null,
    entry_date: formatISO(today, { representation: 'date' }),
    title: '今天有一点想慢下来',
    content: '把任务排得没那么满后，反而更能专心。希望纸雾能像一本温柔的生活册。',
    mood: 'calm',
    created_at: today.toISOString(),
    updated_at: today.toISOString()
  }
];
