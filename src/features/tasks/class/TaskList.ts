import type { Task, TaskStatus } from "@/types";

export class TaskList {
  tasks: Task[];

  constructor(initialTasks: Task[] = []) {
    this.tasks = [...initialTasks];
  }

  getAll(): Task[] {
    return this.tasks;
  }

  getByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter((task) => task.status === status);
  }

  add(newTask: Task): void {
    this.tasks.push(newTask);
  }
}
