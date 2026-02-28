// implements in relation to firebase

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import type { Unsubscribe } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Task, TaskDocument, TaskStatus } from "@/types";

export class TaskService {
  tasksCollection = "tasks";

  public subscribe(
    onTasks: (tasks: Task[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    const tasksRef = collection(db, this.tasksCollection);

    return onSnapshot(
      tasksRef,
      (snapshot) => {
        const tasks = snapshot.docs.map((taskDocument) => ({
          id: taskDocument.id,
          ...(taskDocument.data() as TaskDocument),
        }));
        onTasks(tasks);
      },
      (error) => {
        if (onError) {
          onError(
            error instanceof Error ? error : new Error("Failed to load tasks"),
          );
        }
      },
    );
  }

  public async seedIfEmpty(seedTasks: Task[]): Promise<void> {
    const tasksRef = collection(db, this.tasksCollection);
    const snapshot = await getDocs(tasksRef);

    if (!snapshot.empty) {
      return;
    }

    // in order to seed at once
    const batch = writeBatch(db);

    seedTasks.forEach((task) => {
      const { id, ...taskData } = task;
      batch.set(doc(db, this.tasksCollection, id), taskData);
    });

    await batch.commit();
  }

  public async add(task: Task): Promise<void> {
    const { id, ...taskData } = task;
    await setDoc(doc(db, this.tasksCollection, id), taskData);
  }

  public async update(
    taskId: string,
    fields: Partial<TaskDocument>,
  ): Promise<void> {
    await updateDoc(doc(db, this.tasksCollection, taskId), fields);
  }

  public async delete(taskId: string): Promise<void> {
    await deleteDoc(doc(db, this.tasksCollection, taskId));
  }

  public async updateTaskStatus(
    taskId: string,
    targetStatus: TaskStatus,
  ): Promise<void> {
    await this.update(taskId, { status: targetStatus });
  }
}

export const taskService = new TaskService();
