'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { AppCard } from '@/components/shared/app-card';
import { Badge } from '@/components/ui/badge';
import { getDailyCard } from '@/lib/repositories/daily-card-repo';
import type { DailyCard } from '@/lib/types';

export function DailyCardPanel() {
  const [card, setCard] = useState<DailyCard | null>(null);

  useEffect(() => {
    getDailyCard().then(setCard);
  }, []);

  return (
    <AppCard title="今日画报" description="第一版支持按日期读取单张 Daily Card，后续可扩展为内容流。">
      {card ? (
        <div className="overflow-hidden rounded-[24px] bg-white/60">
          <div className="relative h-72 overflow-hidden rounded-[24px]">
            <Image src={card.image_url} alt={card.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <Badge className="mb-3 bg-white/20 text-white">{card.theme}</Badge>
              <h3 className="text-2xl font-semibold">{card.title}</h3>
              <p className="mt-2 max-w-xl text-sm text-white/85">{card.subtitle}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">今天的画报还在整理中。</p>
      )}
    </AppCard>
  );
}
