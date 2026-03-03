export type TaskStatus = "To Do" | "In Progress" | "Done";

export type TaskAssignee = {
  id: string;
  initials: string;
  colorClassName: string;
};

export type Task = {
  id: string;
  category: string;
  categoryColorClassName: string;
  title: string;
  content: string;
  assignees: TaskAssignee[];
  status: TaskStatus;
};

export type TaskDocument = Omit<Task, "id">;
