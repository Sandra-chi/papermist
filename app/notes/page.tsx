import { NoteManager } from '@/components/notes/note-manager';
import { PageHeader } from '@/components/shared/page-header';

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        badge="Notes"
        title="笔记"
        description="第一版提供最核心的笔记 CRUD：新建、列表、详情、编辑、删除。"
      />
      <NoteManager />
    </div>
  );
}
