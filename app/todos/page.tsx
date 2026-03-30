import { PageHeader } from '@/components/shared/page-header';
import { TodoManager } from '@/components/todos/todo-manager';

export default function TodosPage({ searchParams }: { searchParams?: { date?: string } }) {
  return (
    <div className="space-y-6">
      <PageHeader
        badge="Todos"
        title="待办事项"
        description="支持新增、编辑、删除、完成状态切换，以及按日期筛选。后续可继续接入提醒与专注模式。"
      />
      <TodoManager initialDate={searchParams?.date} />
    </div>
  );
}
