import Link from 'next/link';

import { JournalEditor } from '@/components/journal/journal-editor';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';

export default function JournalDatePage({ params }: { params: { date: string } }) {
  return (
    <div className="space-y-6">
      <PageHeader
        badge="Journal Detail"
        title={`指定日期手帐 · ${params.date}`}
        description="每个日期都可拥有一篇对应的手帐记录，适合做每天的简短复盘与心情留存。"
        actions={
          <Button asChild variant="outline">
            <Link href="/journal">返回手帐页</Link>
          </Button>
        }
      />
      <JournalEditor selectedDate={params.date} />
    </div>
  );
}
