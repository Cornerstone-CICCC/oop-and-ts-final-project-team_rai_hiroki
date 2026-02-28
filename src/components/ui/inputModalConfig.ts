export type TaskInputValues = {
  color: string;
  category: string;
  title: string;
  content: string;
};

export const TASK_COLOR_OPTIONS = [
  { label: "Green", value: "bg-green-500" },
  { label: "Pink", value: "bg-pink-500" },
  { label: "Sky", value: "bg-sky-400" },
  { label: "Blue", value: "bg-blue-600" },
  { label: "Orange", value: "bg-orange-400" },
] as const;

export function getEmptyTaskInputValues(): TaskInputValues {
  return {
    color: "bg-green-500",
    category: "",
    title: "",
    content: "",
  };
}
