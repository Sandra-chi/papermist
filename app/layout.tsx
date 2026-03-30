import type { Metadata } from 'next';
import { Inter, Noto_Sans_SC } from 'next/font/google';

import '@/app/globals.css';
import { MobileNav } from '@/components/layout/mobile-nav';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Topbar } from '@/components/layout/topbar';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const notoSansSc = Noto_Sans_SC({ subsets: ['latin'], variable: '--font-cn' });

export const metadata: Metadata = {
  title: '纸雾 PaperMist',
  description: '一款融合日历、手帐、待办、笔记与 Daily Card 的生活方式日历应用。'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={cn(inter.variable, notoSansSc.variable, 'font-sans')}>
        <div className="min-h-screen lg:flex">
          <SidebarNav />
          <div className="min-w-0 flex-1">
            <Topbar />
            <main className="px-4 pb-24 pt-6 lg:px-8 lg:pb-10">{children}</main>
          </div>
        </div>
        <MobileNav />
      </body>
    </html>
  );
}
