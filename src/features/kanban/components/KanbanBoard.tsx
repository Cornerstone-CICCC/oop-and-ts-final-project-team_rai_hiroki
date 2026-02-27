import type { DragEvent } from "react";
import { useState } from "react";
import { SearchBar } from "@/components";
import { DUMMY_TASKS, TaskList } from "@/features/tasks";
import {
  InputModal,
  getEmptyTaskInputValues,
  type TaskInputValues,
} from "@/components/ui";
import type { Task, TaskStatus } from "@/types";
import { KanbanColumn } from "./KanbanColumn";

const COLUMN_TITLES: TaskStatus[] = ["To Do", "In Progress", "Done"];
const DUMMY_ASSIGNEE = { id: "user-demo", initials: "DM", colorClassName: "bg-indigo-600" };

type TaskModalState = {
  mode: "add" | "update";
  status: TaskStatus;
  targetTaskId: string | null;
  values: TaskInputValues;
};

export function KanbanBoard() {
  const [taskList] = useState(() => new TaskList(DUMMY_TASKS));

  // to force it rerender when the values in the class changes  
  const [, setRefreshKey] = useState(0);
  const [taskModalState, setTaskModalState] = useState<TaskModalState | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  const refreshBoard = (): void => {
    setRefreshKey((currentValue) => currentValue + 1);
  };

  const handleTaskDragStart = (taskId: string, event: DragEvent<HTMLDivElement>): void => {
    taskList.onDrag(taskId, event.dataTransfer);
  };

  const handleColumnDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
  };

  const handleColumnDrop = (event: DragEvent<HTMLDivElement>, status: TaskStatus): void => {
    event.preventDefault();
    const isMoved = taskList.onDrop(event.dataTransfer, status);

    if (isMoved) {
      refreshBoard();
    }
  };

  const openAddModal = (status: TaskStatus): void => {
    setTaskModalState({
      mode: "add",
      status,
      targetTaskId: null,
      values: getEmptyTaskInputValues(),
    });
  };

  const openUpdateModal = (task: Task): void => {
    setTaskModalState({
      mode: "update",
      status: task.status,
      targetTaskId: task.id,
      values: {
        color: task.categoryColorClassName,
        category: task.category,
        title: task.title,
        content: task.content,
      },
    });
  };

  const closeTaskModal = (): void => {
    setTaskModalState(null);
  };

  const handleTaskModalSubmit = (values: TaskInputValues): void => {
    if (!taskModalState) {
      return;
    }

    if (taskModalState.mode === "add") {
      taskList.add({
        id: `task-${Date.now()}`,
        categoryColorClassName: values.color,
        category: values.category.trim(),
        title: values.title.trim(),
        content: values.content.trim(),
        assignees: [DUMMY_ASSIGNEE],
        status: taskModalState.status,
      });
    } else if (taskModalState.targetTaskId) {
      taskList.update(taskModalState.targetTaskId, {
        categoryColorClassName: values.color,
        category: values.category.trim(),
        title: values.title.trim(),
        content: values.content.trim(),
      });
    }

    closeTaskModal();
    refreshBoard();
  };

  const handleDeleteTask = (taskId: string): void => {
    const isDeleted = taskList.delete(taskId);
    if (isDeleted) {
      refreshBoard();
    }
  };

  const handleSearch = (keyword: string): void => {
    setSearchKeyword(keyword);
  };

  const getTasksByFilter = (status: TaskStatus): Task[] => {
    const tasks = taskList.getTasks(searchKeyword);
    return tasks.filter((task) => task.status === status);
  };

  return (
    <>
      <div className="flex flex-col min-h-[60vh] md:min-h-[calc(100vh-8rem)] gap-4">
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 text-black overflow-hidden">
          <h2 className="w-full flex items-center px-4 pt-4 text-2xl sm:text-4xl">CICCC Board</h2>
          <SearchBar onSearch={handleSearch} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMN_TITLES.map((title) => (
            <KanbanColumn
              key={title}
              title={title}
              tasks={getTasksByFilter(title)}
              onTaskDragStart={handleTaskDragStart}
              onColumnDragOver={handleColumnDragOver}
              onColumnDrop={handleColumnDrop}
              onAddTaskRequest={openAddModal}
              onUpdateTaskRequest={openUpdateModal}
              onDeleteTaskRequest={handleDeleteTask}
            />
          ))}
        </section>
      </div>

      {taskModalState && (
        <InputModal
          isOpen
          mode={taskModalState.mode}
          initialValues={taskModalState.values}
          onClose={closeTaskModal}
          onSubmit={handleTaskModalSubmit}
        />
      )}
    </>
  );
}

export default KanbanBoard;
