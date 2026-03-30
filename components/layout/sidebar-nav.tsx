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

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="paper-panel hidden w-72 shrink-0 border-r border-white/60 px-5 py-6 lg:flex lg:flex-col">
      <Link href="/" className="mb-8 flex items-center gap-3 px-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-soft">
          PM
        </div>
        <div>
          <p className="text-lg font-semibold">纸雾 PaperMist</p>
          <p className="text-sm text-muted-foreground">A soft life calendar</p>
        </div>
      </Link>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all',
                active ? 'bg-white text-foreground shadow-soft' : 'text-muted-foreground hover:bg-white/70 hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[28px] border border-white/70 bg-white/60 p-5 shadow-soft">
        <p className="text-sm font-medium">MVP 提示</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          当前版本已预留 Supabase、内容流、提醒与用户系统扩展位，适合继续向社区与多历法方向演进。
        </p>
      </div>
    </aside>
  );
}
