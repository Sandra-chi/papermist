// lib/shared/service.ts
import type { SharedRepository } from '@/lib/shared/repository';
import { localSharedRepository } from '@/lib/shared/repository-local';

const provider = process.env.NEXT_PUBLIC_SHARED_PROVIDER ?? 'local';

export const sharedRepository: SharedRepository = localSharedRepository;

export const sharedProvider = provider;