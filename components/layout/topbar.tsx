'use client';

import Link from 'next/link';
import { Plus, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/50 bg-background/80 px-4 py-4 backdrop-blur-xl lg:px-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">PaperMist</p>
        <h1 className="text-xl font-semibold">纸感日历与生活记录</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-muted-foreground shadow-soft md:flex">
          <Search className="h-4 w-4" />
          搜索功能预留中
        </div>
        <Button asChild variant="outline" className="hidden md:inline-flex">
          <Link href="/calendar">打开日历</Link>
        </Button>
        <Button asChild>
          <Link href="/journal">
            <Plus className="mr-1 h-4 w-4" />
            今日记录
          </Link>
        </Button>
      </div>
    </header>
  );
}
