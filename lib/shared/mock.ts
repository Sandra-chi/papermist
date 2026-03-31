// lib/shared/mock.ts
import type {
  CreateSharedCalendarInput,
  CreateSharedEntryInput,
  CreateSharedEventInput,
  CreateSharedTodoInput,
  SharedCalendar,
  SharedCalendarBundle,
  SharedCalendarEntry,
  SharedCalendarEvent,
  SharedCalendarMember,
  SharedCalendarTodo,
  SharedStore
} from '@/lib/shared/types';

const STORAGE_KEY = 'papermist.shared.v1';

function makeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function makeInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function createSeedStore(): SharedStore {
  const now = new Date().toISOString();
  const calendarId = makeId();

  const calendars: SharedCalendar[] = [
    {
      id: calendarId,
      title: '春日共享计划',
      description: '把约会、散步、整理和一些温柔的小事放在同一份月历里。',
      type: 'couple',
      theme: 'rose',
      coverEmoji: '🌷',
      inviteCode: makeInviteCode(),
      createdAt: now,
      updatedAt: now
    }
  ];

  const members: SharedCalendarMember[] = [
    {
      id: makeId(),
      calendarId,
      displayName: '我',
      role: 'owner',
      joinedAt: now
    },
    {
      id: makeId(),
      calendarId,
      displayName: '搭子',
      role: 'member',
      joinedAt: now
    }
  ];

  const today = new Date();
  const isoToday = today.toISOString().slice(0, 10);

  const events: SharedCalendarEvent[] = [
    {
      id: makeId(),
      calendarId,
      eventDate: isoToday,
      title: '一起散步 30 分钟',
      description: '晚饭后在附近公园散步。',
      location: '附近公园',
      startTime: '20:00',
      endTime: '20:30',
      createdAt: now,
      updatedAt: now
    }
  ];

  const todos: SharedCalendarTodo[] = [
    {
      id: makeId(),
      calendarId,
      targetDate: isoToday,
      title: '确认周末出行清单',
      description: '检查雨伞、充电宝和相机。',
      assigneeId: members[0].id,
      status: 'todo',
      createdAt: now,
      updatedAt: now
    }
  ];

  const entries: SharedCalendarEntry[] = [
    {
      id: makeId(),
      calendarId,
      entryDate: isoToday,
      title: '今天的一句话',
      content: '天气很轻，适合把拖了很久的小事做完。',
      moodWeather: 'sunny',
      createdAt: now,
      updatedAt: now
    }
  ];

  return {
    calendars,
    members,
    events,
    todos,
    entries
  };
}

function canUseStorage() {
  return typeof window !== 'undefined';
}

function readStore(): SharedStore {
  if (!canUseStorage()) {
    return createSeedStore();
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seed = createSeedStore();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }

  try {
    const parsed = JSON.parse(raw) as SharedStore;

    return {
      calendars: Array.isArray(parsed.calendars) ? parsed.calendars : [],
      members: Array.isArray(parsed.members) ? parsed.members : [],
      events: Array.isArray(parsed.events) ? parsed.events : [],
      todos: Array.isArray(parsed.todos)
        ? parsed.todos.map((todo) => ({
            ...todo,
            status: todo.status === 'done' ? 'done' : 'todo'
          }))
        : [],
      entries: Array.isArray(parsed.entries) ? parsed.entries : []
    };
  } catch {
    const seed = createSeedStore();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
}

function writeStore(store: SharedStore) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function touchCalendar(calendar: SharedCalendar): SharedCalendar {
  return {
    ...calendar,
    updatedAt: new Date().toISOString()
  };
}

export function getSharedCalendars(): SharedCalendar[] {
  return readStore().calendars.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getSharedCalendarBundle(calendarId: string): SharedCalendarBundle | null {
  const store = readStore();
  const calendar = store.calendars.find((item) => item.id === calendarId);

  if (!calendar) return null;

  const todos: SharedCalendarTodo[] = store.todos
    .filter((item) => item.calendarId === calendarId)
    .map((todo) => ({
      ...todo,
      status: todo.status === 'done' ? 'done' : 'todo'
    }));

  return {
    calendar,
    members: store.members.filter((item) => item.calendarId === calendarId),
    events: store.events.filter((item) => item.calendarId === calendarId),
    todos,
    entries: store.entries.filter((item) => item.calendarId === calendarId)
  };
}

export function createSharedCalendar(input: CreateSharedCalendarInput): SharedCalendar {
  const store = readStore();
  const now = new Date().toISOString();
  const calendarId = makeId();

  const calendar: SharedCalendar = {
    id: calendarId,
    title: input.title,
    description: input.description,
    type: input.type,
    theme: input.theme,
    coverEmoji: input.coverEmoji || '📅',
    inviteCode: makeInviteCode(),
    createdAt: now,
    updatedAt: now
  };

  const owner: SharedCalendarMember = {
    id: makeId(),
    calendarId,
    displayName: '我',
    role: 'owner',
    joinedAt: now
  };

  const nextStore: SharedStore = {
    ...store,
    calendars: [calendar, ...store.calendars],
    members: [owner, ...store.members]
  };

  writeStore(nextStore);
  return calendar;
}

export function addSharedEvent(
  calendarId: string,
  input: CreateSharedEventInput
): SharedCalendarEvent {
  const store = readStore();
  const now = new Date().toISOString();

  const event: SharedCalendarEvent = {
    id: makeId(),
    calendarId,
    eventDate: input.eventDate,
    title: input.title,
    description: input.description ?? '',
    location: input.location ?? '',
    startTime: input.startTime ?? '',
    endTime: input.endTime ?? '',
    createdAt: now,
    updatedAt: now
  };

  const nextCalendars = store.calendars.map((item) =>
    item.id === calendarId ? touchCalendar(item) : item
  );

  writeStore({
    ...store,
    calendars: nextCalendars,
    events: [event, ...store.events]
  });

  return event;
}

export function addSharedTodo(
  calendarId: string,
  input: CreateSharedTodoInput
): SharedCalendarTodo {
  const store = readStore();
  const now = new Date().toISOString();

  const todo: SharedCalendarTodo = {
    id: makeId(),
    calendarId,
    targetDate: input.targetDate,
    title: input.title,
    description: input.description ?? '',
    assigneeId: input.assigneeId ?? null,
    status: 'todo',
    createdAt: now,
    updatedAt: now
  };

  const nextCalendars = store.calendars.map((item) =>
    item.id === calendarId ? touchCalendar(item) : item
  );

  writeStore({
    ...store,
    calendars: nextCalendars,
    todos: [todo, ...store.todos]
  });

  return todo;
}

export function addSharedEntry(
  calendarId: string,
  input: CreateSharedEntryInput
): SharedCalendarEntry {
  const store = readStore();
  const now = new Date().toISOString();

  const entry: SharedCalendarEntry = {
    id: makeId(),
    calendarId,
    entryDate: input.entryDate,
    title: input.title ?? '',
    content: input.content,
    moodWeather: input.moodWeather,
    createdAt: now,
    updatedAt: now
  };

  const nextCalendars = store.calendars.map((item) =>
    item.id === calendarId ? touchCalendar(item) : item
  );

  writeStore({
    ...store,
    calendars: nextCalendars,
    entries: [entry, ...store.entries]
  });

  return entry;
}

export function toggleSharedTodo(calendarId: string, todoId: string): void {
  const store = readStore();

  const todos: SharedCalendarTodo[] = store.todos.map((todo) => {
    if (todo.id !== todoId || todo.calendarId !== calendarId) return todo;

    return {
      ...todo,
      status: todo.status === 'done' ? 'todo' : 'done',
      updatedAt: new Date().toISOString()
    };
  });

  const nextCalendars = store.calendars.map((item) =>
    item.id === calendarId ? touchCalendar(item) : item
  );

  writeStore({
    ...store,
    calendars: nextCalendars,
    todos
  });
}
// lib/shared/mock.ts
export function getSharedCalendarByInviteCode(inviteCode: string): SharedCalendarBundle | null {
  const store = readStore();
  const code = inviteCode.trim().toUpperCase();

  const calendar = store.calendars.find((item) => item.inviteCode === code);
  if (!calendar) return null;

  const todos: SharedCalendarTodo[] = store.todos
    .filter((item) => item.calendarId === calendar.id)
    .map((todo) => ({
      ...todo,
      status: todo.status === 'done' ? 'done' : 'todo'
    }));

  return {
    calendar,
    members: store.members.filter((item) => item.calendarId === calendar.id),
    events: store.events.filter((item) => item.calendarId === calendar.id),
    todos,
    entries: store.entries.filter((item) => item.calendarId === calendar.id)
  };
}

export function joinSharedCalendarByInviteCode(
  inviteCode: string,
  displayName: string
): SharedCalendarBundle | null {
  const store = readStore();
  const code = inviteCode.trim().toUpperCase();

  const calendar = store.calendars.find((item) => item.inviteCode === code);
  if (!calendar) return null;

  const safeName = displayName.trim() || '新成员';

  const existingMember = store.members.find(
    (item) => item.calendarId === calendar.id && item.displayName === safeName
  );

  if (!existingMember) {
    const member: SharedCalendarMember = {
      id: makeId(),
      calendarId: calendar.id,
      displayName: safeName,
      role: 'member',
      joinedAt: new Date().toISOString()
    };

    const nextCalendars = store.calendars.map((item) =>
      item.id === calendar.id ? touchCalendar(item) : item
    );

    writeStore({
      ...store,
      calendars: nextCalendars,
      members: [member, ...store.members]
    });
  }

  return getSharedCalendarBundle(calendar.id);
}