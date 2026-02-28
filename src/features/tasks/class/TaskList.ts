import type { Task, TaskStatus } from "@/types";
import { getDraggedTaskId, setDraggedTaskId } from "../utils";

export class TaskList {
  tasks: Task[];

  constructor(initialTasks: Task[] = []) {
    this.tasks = [...initialTasks];
  }

  getAll(): Task[] {
    return [...this.tasks];
  }

  getByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter((task) => task.status === status);
  }

  add(newTask: Task): void {
    this.tasks.push(newTask);
  }

  delete(taskId: string): boolean {
    const targetIndex = this.tasks.findIndex((task) => task.id === taskId);
    if (targetIndex === -1) {
      return false;
    }

    this.tasks.splice(targetIndex, 1);
    return true;
  }

  update(
    taskId: string,
    fields: {
      categoryColorClassName: string;
      category: string;
      title: string;
      content: string;
    },
  ): boolean {
    const targetTask = this.tasks.find((task) => task.id === taskId);
    if (!targetTask) {
      return false;
    }

    targetTask.categoryColorClassName = fields.categoryColorClassName;
    targetTask.category = fields.category;
    targetTask.title = fields.title;
    targetTask.content = fields.content;
    return true;
  }

  updateTaskStatus(taskId: string, targetStatus: TaskStatus): boolean {
    const targetTask = this.tasks.find((task) => task.id === taskId);
    if (!targetTask) {
      return false;
    }

    if (targetTask.status === targetStatus) {
      return false;
    }

    targetTask.status = targetStatus;
    return true;
  }

  onDrag(taskId: string, dataTransfer: DataTransfer | null): void {
    setDraggedTaskId(dataTransfer, taskId);
  }

  onDrop(dataTransfer: DataTransfer | null, targetStatus: TaskStatus): boolean {
    const taskId = getDraggedTaskId(dataTransfer);
    if (!taskId) {
      return false;
    }

    return this.updateTaskStatus(taskId, targetStatus);
  }
}
