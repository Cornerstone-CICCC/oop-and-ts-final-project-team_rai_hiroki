import type { DragEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Alert, LoadingSpinner, SearchBar } from "@/components";
import { DUMMY_TASKS, TaskList, getDraggedTaskId, taskService } from "@/features/tasks";
import {
  InputModal,
  getEmptyTaskInputValues,
  type TaskInputValues,
} from "@/components/ui";
import type { Task, TaskStatus } from "@/types";
import { KanbanColumn } from "./KanbanColumn";

const COLUMN_TITLES: TaskStatus[] = ["To Do", "In Progress", "Done"];

type TaskModalState = {
  mode: "add" | "update";
  status: TaskStatus;
  targetTaskId: string | null;
  values: TaskInputValues;
};

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [taskModalState, setTaskModalState] = useState<TaskModalState | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const taskList = useMemo(() => new TaskList(tasks), [tasks]);

  useEffect(() => {
    // watch data timely
    const unsubscribe = taskService.subscribe(
      (nextTasks) => {
        setTasks(nextTasks);
        setIsLoading(false);
      },
      (error) => {
        setErrorMessage(error.message);
        setIsLoading(false);
      },
    );

    // seeding initial data
    const seed = () => taskService.seedIfEmpty(DUMMY_TASKS).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to seed tasks";
      setErrorMessage(message);
    });

    seed()

    return () => {
      unsubscribe();
    };
  }, []);

  const handleTaskDragStart = (taskId: string, event: DragEvent<HTMLDivElement>): void => {
    taskList.onDrag(taskId, event.dataTransfer);
  };

  const handleColumnDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
  };

  const handleColumnDrop = (event: DragEvent<HTMLDivElement>, status: TaskStatus): void => {
    event.preventDefault();
    const taskId = getDraggedTaskId(event.dataTransfer);
    if (!taskId) {
      return;
    }

    const targetTask = tasks.find((task) => task.id === taskId);
    if (!targetTask || targetTask.status === status) {
      return;
    }

    const updateStatus = () => taskService.updateTaskStatus(taskId, status).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to move task";
      setErrorMessage(message);
    });
    updateStatus()
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
        assignees: task.assignees,
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
      void taskService
        .add({
          id: `task-${Date.now()}`,
          categoryColorClassName: values.color,
          category: values.category.trim(),
          title: values.title.trim(),
          content: values.content.trim(),
          assignees: values.assignees,
          status: taskModalState.status,
        })
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : "Failed to add task";
          setErrorMessage(message);
        });
    } else if (taskModalState.targetTaskId) {
      void taskService
        .update(taskModalState.targetTaskId, {
          categoryColorClassName: values.color,
          category: values.category.trim(),
          title: values.title.trim(),
          content: values.content.trim(),
          assignees: values.assignees,
        })
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : "Failed to update task";
          setErrorMessage(message);
        });
    }

    closeTaskModal();
  };

  const handleDeleteTask = (taskId: string): void => {
    void taskService.delete(taskId).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to delete task";
      setErrorMessage(message);
    });
  };

  const handleSearch = (keyword: string): void => {
    setSearchKeyword(keyword);
  };

  const getTasksByFilter = (status: TaskStatus): Task[] => {
    const tasks = taskList.getTasks(searchKeyword);
    return tasks.filter((task) => task.status === status);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-[60vh] md:min-h-[calc(100vh-8rem)] gap-4">
        {errorMessage && <Alert variant="error">{errorMessage}</Alert>}
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
