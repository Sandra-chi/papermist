// lib/shared/types.ts
export type SharedCalendarType =
  | 'couple'
  | 'travel'
  | 'study'
  | 'family'
  | 'custom';

export interface SharedCalendar {
  id: string;
  title: string;
  description: string;
  type: SharedCalendarType;
  theme: string;
  coverEmoji: string;
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface SharedCalendarMember {
  id: string;
  calendarId: string;
  displayName: string;
  role: 'owner' | 'member';
  joinedAt: string;
}

export interface SharedCalendarEvent {
  id: string;
  calendarId: string;
  eventDate: string;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface SharedCalendarTodo {
  id: string;
  calendarId: string;
  targetDate: string;
  title: string;
  description: string;
  assigneeId?: string | null;
  status: 'todo' | 'done';
  createdAt: string;
  updatedAt: string;
}

export interface SharedCalendarEntry {
  id: string;
  calendarId: string;
  entryDate: string;
  title: string;
  content: string;
  moodWeather: string;
  createdAt: string;
  updatedAt: string;
}

export interface SharedCalendarBundle {
  calendar: SharedCalendar;
  members: SharedCalendarMember[];
  events: SharedCalendarEvent[];
  todos: SharedCalendarTodo[];
  entries: SharedCalendarEntry[];
}

export interface SharedStore {
  calendars: SharedCalendar[];
  members: SharedCalendarMember[];
  events: SharedCalendarEvent[];
  todos: SharedCalendarTodo[];
  entries: SharedCalendarEntry[];
}

export interface CreateSharedCalendarInput {
  title: string;
  description: string;
  type: SharedCalendarType;
  theme: string;
  coverEmoji: string;
}

export interface CreateSharedEventInput {
  eventDate: string;
  title: string;
  description?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
}

export interface CreateSharedTodoInput {
  targetDate: string;
  title: string;
  description?: string;
  assigneeId?: string | null;
}

export interface CreateSharedEntryInput {
  entryDate: string;
  title?: string;
  content: string;
  moodWeather: string;
}