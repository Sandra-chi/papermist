'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookHeart, CalendarDays, ClipboardList, LayoutDashboard, StickyNote } from 'lucide-react';

import { cn } from '@/lib/utils';

const items = [
  { href: '/', label: '首页', icon: LayoutDashboard },
  { href: '/calendar', label: '日历', icon: CalendarDays },
  { href: '/journal', label: '手帐', icon: BookHeart },
  { href: '/todos', label: '待办', icon: ClipboardList },
  { href: '/notes', label: '笔记', icon: StickyNote }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-24px)] -translate-x-1/2 rounded-full border border-white/70 bg-white/85 p-2 shadow-mist backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center rounded-full px-2 py-2 text-[11px] transition',
                active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              )}
            >
              <Icon className="mb-1 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
