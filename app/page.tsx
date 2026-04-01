// app/page.tsx
import { DailyCardPanel } from '@/components/dashboard/daily-card-panel';
import { NoteSummary } from '@/components/dashboard/note-summary';
import { SharedOverview } from '@/components/dashboard/shared-overview';
import { TodayOverview } from '@/components/dashboard/today-overview';
import { TodoSummary } from '@/components/dashboard/todo-summary';
import { PageHeader } from '@/components/shared/page-header';
import { MoodWeatherCard } from '@/components/weather/mood-weather-card';
import { RealWeatherCard } from '@/components/weather/real-weather-card';
import { formatDate } from '@/lib/date';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        badge="Dashboard"
        title="欢迎来到纸雾"
        description="把日期、生活信息、画报、待办、记录与共享日历放进同一张柔和页面里。"
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <TodayOverview />
        <DailyCardPanel />
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <RealWeatherCard />
        <MoodWeatherCard
          date={formatDate(new Date(), 'yyyy-MM-dd')}
          title="今日心情天气"
          description="选一个最贴近你今天状态的天气。"
        />
      </section>

      <SharedOverview />

      <div className="grid gap-6 xl:grid-cols-2">
        <TodoSummary />
        <NoteSummary />
      </div>
    </div>
  );
}