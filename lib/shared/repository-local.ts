// lib/shared/repository-local.ts
import type { SharedRepository } from '@/lib/shared/repository';
import type {
  CreateSharedCalendarInput,
  CreateSharedEntryInput,
  CreateSharedEventInput,
  CreateSharedTodoInput
} from '@/lib/shared/types';
import {
  addSharedEntry,
  addSharedEvent,
  addSharedTodo,
  createSharedCalendar,
  getSharedCalendarBundle,
  getSharedCalendarByInviteCode,
  getSharedCalendars,
  joinSharedCalendarByInviteCode,
  toggleSharedTodo
} from '@/lib/shared/mock';

export const localSharedRepository: SharedRepository = {
  async getSharedCalendars() {
    return getSharedCalendars();
  },

  async getSharedCalendarBundle(calendarId: string) {
    return getSharedCalendarBundle(calendarId);
  },

  async createSharedCalendar(input: CreateSharedCalendarInput) {
    return createSharedCalendar(input);
  },

  async addSharedEvent(calendarId: string, input: CreateSharedEventInput) {
    return addSharedEvent(calendarId, input);
  },

  async addSharedTodo(calendarId: string, input: CreateSharedTodoInput) {
    return addSharedTodo(calendarId, input);
  },

  async addSharedEntry(calendarId: string, input: CreateSharedEntryInput) {
    return addSharedEntry(calendarId, input);
  },

  async toggleSharedTodo(calendarId: string, todoId: string) {
    toggleSharedTodo(calendarId, todoId);
  },

  async getSharedCalendarByInviteCode(inviteCode: string) {
    return getSharedCalendarByInviteCode(inviteCode);
  },

  async joinSharedCalendarByInviteCode(inviteCode: string, displayName: string) {
    return joinSharedCalendarByInviteCode(inviteCode, displayName);
  }
};