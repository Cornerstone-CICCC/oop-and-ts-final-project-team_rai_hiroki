import { Modal } from "@/components/ui";
import type { Task } from "@/types";

type TaskDetailProps = {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
};

export function TaskDetail(props: TaskDetailProps) {
  const { task, isOpen, onClose } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Detail">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-500">CATEGORY</p>
          <p className="mt-1 text-sm font-medium text-slate-800">{task.category}</p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-500">TITLE</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{task.title}</p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-500">CONTENT</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{task.content}</p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-500">ASSIGNEES</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {task.assignees.map((assignee) => (
              <span
                key={assignee.id}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${assignee.colorClassName}`}
              >
                {assignee.initials}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
