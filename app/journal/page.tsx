import { JournalEditor } from '@/components/journal/journal-editor';
import { PageHeader } from '@/components/shared/page-header';

export default function JournalPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        badge="Journal"
        title="手帐 / Journal"
        description="查看最近记录，并编辑今天的手帐。你也可以通过日期详情页，进入指定日期的 Journal。"
      />
      <JournalEditor />
    </div>
  );
}
