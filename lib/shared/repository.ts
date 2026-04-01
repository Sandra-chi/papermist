// lib/shared/repository.ts
import type {
  CreateSharedCalendarInput,
  CreateSharedEntryInput,
  CreateSharedEventInput,
  CreateSharedTodoInput,
  SharedCalendar,
  SharedCalendarBundle,
  SharedCalendarEntry,
  SharedCalendarEvent,
  SharedCalendarTodo
} from '@/lib/shared/types';

export interface SharedRepository {
  getSharedCalendars(): Promise<SharedCalendar[]>;
  getSharedCalendarBundle(calendarId: string): Promise<SharedCalendarBundle | null>;
  createSharedCalendar(input: CreateSharedCalendarInput): Promise<SharedCalendar>;

  addSharedEvent(
    calendarId: string,
    input: CreateSharedEventInput
  ): Promise<SharedCalendarEvent>;

  addSharedTodo(
    calendarId: string,
    input: CreateSharedTodoInput
  ): Promise<SharedCalendarTodo>;

  addSharedEntry(
    calendarId: string,
    input: CreateSharedEntryInput
  ): Promise<SharedCalendarEntry>;

  toggleSharedTodo(calendarId: string, todoId: string): Promise<void>;

  getSharedCalendarByInviteCode(inviteCode: string): Promise<SharedCalendarBundle | null>;

  joinSharedCalendarByInviteCode(
    inviteCode: string,
    displayName: string
  ): Promise<SharedCalendarBundle | null>;
}