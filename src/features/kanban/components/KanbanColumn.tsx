import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton } from "@mui/material";
import { TaskCard } from "@/features/tasks";
import type { Task } from "@/types";

type KanbanColumnProps = {
  title: string;
  tasks: Task[];
};

export function KanbanColumn(props: KanbanColumnProps) {
  const { title, tasks } = props;
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-100 p-3 sm:p-4 min-h-80 md:min-h-100">
      <header className="flex items-center justify-between mb-3">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800">{title}</h3>
        <div className="flex items-center">
          <IconButton aria-label={`add task to ${title.toLowerCase()}`} size="small">
            <AddIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label={`open ${title.toLowerCase()} options`} size="small">
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </div>
      </header>

      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 min-h-24 sm:min-h-32 md:min-h-40" />
        )}
      </div>
    </div>
  );
}
