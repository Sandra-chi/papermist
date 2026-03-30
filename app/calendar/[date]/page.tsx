import Link from 'next/link';

import { DateDetailPanel } from '@/components/calendar/date-detail-panel';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';

export default function CalendarDatePage({ params }: { params: { date: string } }) {
  return (
    <div className="space-y-6">
      <PageHeader
        badge="Date Detail"
        title={`日期详情 · ${params.date}`}
        description="在这里查看当天的公历信息、农历占位信息、星座、宜忌，以及进入当日手帐与待办。"
        actions={
          <Button asChild variant="outline">
            <Link href="/calendar">返回月历</Link>
          </Button>
        }
      />

      <DateDetailPanel date={params.date} />
    </div>
  );
}
