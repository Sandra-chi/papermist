import { DailyCardPanel } from '@/components/dashboard/daily-card-panel';
import { NoteSummary } from '@/components/dashboard/note-summary';
import { TodayOverview } from '@/components/dashboard/today-overview';
import { TodoSummary } from '@/components/dashboard/todo-summary';
import { PageHeader } from '@/components/shared/page-header';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        badge="Dashboard"
        title="欢迎来到纸雾"
        description="把日期、生活信息、画报、待办与记录放进同一张柔和页面里。这个 MVP 版本已经具备真实产品感与后续扩展基础。"
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <TodayOverview />
        <DailyCardPanel />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TodoSummary />
        <NoteSummary />
      </div>
    </div>
  );
}
