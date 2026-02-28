import { useState, type FormEvent } from "react";
import type { TaskInputValues } from "./inputModalConfig";
import { TASK_COLOR_OPTIONS } from "./inputModalConfig";
import { Modal } from "./Modal";

type InputModalProps = {
  isOpen: boolean;
  mode: "add" | "update";
  initialValues: TaskInputValues;
  onClose: () => void;
  onSubmit: (values: TaskInputValues) => void;
};

export function InputModal(props: InputModalProps) {
  const { isOpen, mode, initialValues, onClose, onSubmit } = props;
  const [values, setValues] = useState<TaskInputValues>(initialValues);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit(values);
  };

  const title = mode === "add" ? "Add Task" : "Update Task";
  const submitText = mode === "add" ? "Add" : "Update";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Color</span>
          <select
            value={values.color}
            onChange={(event) => setValues((current) => ({ ...current, color: event.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            {TASK_COLOR_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Category</span>
          <input
            value={values.category}
            onChange={(event) => setValues((current) => ({ ...current, category: event.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            required
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Title</span>
          <input
            value={values.title}
            onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            required
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Content</span>
          <textarea
            value={values.content}
            onChange={(event) => setValues((current) => ({ ...current, content: event.target.value }))}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            required
          />
        </label>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {submitText}
          </button>
        </div>
      </form>
    </Modal>
  );
}
