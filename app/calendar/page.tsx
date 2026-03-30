'use client';

import { addMonths } from 'date-fns';
import { useState } from 'react';

import { CalendarGrid } from '@/components/calendar/calendar-grid';
import { DateDetailPanel } from '@/components/calendar/date-detail-panel';
import { PageHeader } from '@/components/shared/page-header';
import { formatDate } from '@/lib/date';

export default function CalendarPage() {
  const [month, setMonth] = useState(new Date());
  const today = formatDate(new Date());

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Calendar"
        title="月视图日历"
        description="支持月份切换与日期详情查看。当前版本的农历、节气、黄历信息以稳定的 mock 结构承接，后续可无缝切换成真实历法服务。"
      />

      <CalendarGrid
        month={month}
        onMonthChange={(direction) => setMonth((current) => addMonths(current, direction === 'next' ? 1 : -1))}
      />

      <DateDetailPanel date={today} />
    </div>
  );
}
