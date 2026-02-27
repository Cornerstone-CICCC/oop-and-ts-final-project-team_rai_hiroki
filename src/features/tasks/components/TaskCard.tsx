import { useState, type DragEvent } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { MoreOptions, type MoreOptionsItem } from "@/components/ui/MoreOptions";
import type { Task } from "@/types";
import { TaskDetail } from "./TaskDetail";

type TaskCardProps = {
  task: Task;
  onDragStart: (taskId: string, event: DragEvent<HTMLDivElement>) => void;
  onUpdateRequest: (task: Task) => void;
};

export function TaskCard(props: TaskCardProps) {
  const { task, onDragStart, onUpdateRequest } = props;
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const openDetail = (): void => {
    setIsDetailOpen(true);
  };

  const closeDetail = (): void => {
    setIsDetailOpen(false);
  };

  const optionItems: MoreOptionsItem[] = [
    { id: "detail", label: "Detail", onClick: openDetail },
    { id: "update", label: "Update", onClick: () => onUpdateRequest(task) },
    { id: "delete", label: "Delete" },
  ];

  return (
    <>
      <div
        draggable
        onDragStart={(event) => onDragStart(task.id, event)}
        className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 cursor-grab active:cursor-grabbing"
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${task.categoryColorClassName}`} aria-hidden="true" />
            <span className="text-[10px] font-semibold tracking-wide text-slate-500">{task.category}</span>
          </div>
          <MoreOptions
            items={optionItems}
            buttonAriaLabel={`open options for ${task.title}`}
            buttonId={`task-${task.id}-options-button`}
            menuId={`task-${task.id}-options-menu`}
            triggerIcon={<MoreHorizIcon fontSize="small" />}
            menuWidth={160}
            maxVisibleItems={3}
          />
        </div>

        <h4 className="text-xl font-semibold leading-7 text-slate-900">{task.title}</h4>
        <p className="mt-2 text-sm leading-6 text-slate-700">{task.content}</p>

        <div className="mt-4 flex items-center">
          {task.assignees.map((assignee, index) => (
            <span
              key={assignee.id}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white ${assignee.colorClassName} ${index > 0 ? "-ml-2" : ""}`}
            >
              {assignee.initials}
            </span>
          ))}
        </div>
      </div>

      <TaskDetail task={task} isOpen={isDetailOpen} onClose={closeDetail} />
    </>
  );
}
