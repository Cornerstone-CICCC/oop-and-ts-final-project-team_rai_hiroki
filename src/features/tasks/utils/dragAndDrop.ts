const TASK_ID_DATA_KEY = "text/plain";

// put ID of the task that was dragged
export function setDraggedTaskId(
  dataTransfer: DataTransfer | null,
  taskId: string,
): void {
  if (!dataTransfer) {
    return;
  }

  dataTransfer.setData(TASK_ID_DATA_KEY, taskId);
  dataTransfer.effectAllowed = "move";
}

// return ID of the task that was dropped
export function getDraggedTaskId(dataTransfer: DataTransfer | null): string {
  if (!dataTransfer) {
    return "";
  }

  return dataTransfer.getData(TASK_ID_DATA_KEY);
}
