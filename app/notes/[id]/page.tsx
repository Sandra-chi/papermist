import Link from 'next/link';

import { NoteDetail } from '@/components/notes/note-detail';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';

export default function NoteDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <PageHeader
        badge="Note Detail"
        title="笔记详情"
        description="支持查看与编辑单篇笔记内容。"
        actions={
          <Button asChild variant="outline">
            <Link href="/notes">返回笔记列表</Link>
          </Button>
        }
      />
      <NoteDetail noteId={params.id} />
    </div>
  );
}
