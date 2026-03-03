import { useEffect, useState, type FormEvent } from "react";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CheckIcon from "@mui/icons-material/Check";
import type { TaskInputValues } from "./inputModalConfig";
import { TASK_COLOR_OPTIONS } from "./inputModalConfig";
import { Modal } from "./Modal";
import { MoreOptions, type MoreOptionsItem } from "./MoreOptions";
import { userService } from "@/services/UserService";
import type { IUser, TaskAssignee } from "@/types";

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
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userLoadError, setUserLoadError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchUsers = async (): Promise<void> => {
      setIsLoadingUsers(true);
      setUserLoadError(null);

      try {
        const allUsers = await userService.getAllUsers();
        if (!ignore) {
          setUsers(allUsers);
        }
      } catch (error) {
        if (!ignore) {
          const message =
            error instanceof Error ? error.message : "Failed to load users";
          setUserLoadError(message);
        }
      } finally {
        if (!ignore) {
          setIsLoadingUsers(false);
        }
      }
    };

    fetchUsers();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit(values);
  };

  const ASSIGNEE_COLORS = [
    "bg-indigo-600",
    "bg-blue-600",
    "bg-emerald-600",
    "bg-orange-500",
    "bg-rose-500",
    "bg-purple-600",
  ] as const;

  const getInitials = (displayName: string): string => {
    const words = displayName.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return "U";
    }
    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }
    return (words[0][0] + words[1][0]).toUpperCase();
  };


  // arrange assignee's data with a color 
  const toTaskAssignee = (user: IUser): TaskAssignee => {
    const colorIndex =
      Array.from(user.id).reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      ASSIGNEE_COLORS.length;

    return {
      id: user.id,
      initials: getInitials(user.displayName),
      colorClassName: ASSIGNEE_COLORS[colorIndex],
    };
  };

  const toggleAssignee = (user: IUser): void => {
    setValues((current) => {
      const exists = current.assignees.some((assignee) => assignee.id === user.id);
      if (exists) {
        return {
          ...current,
          assignees: current.assignees.filter((assignee) => assignee.id !== user.id),
        };
      }

      return {
        ...current,
        assignees: [...current.assignees, toTaskAssignee(user)],
      };
    });
  };

  const removeAssignee = (assignee: TaskAssignee): void => {
    const isConfirmed = window.confirm(`Remove ${assignee.initials} from assignees?`);
    if (!isConfirmed) {
      return;
    }

    setValues((current) => ({
      ...current,
      assignees: current.assignees.filter((target) => target.id !== assignee.id),
    }));
  };

  // arrange users data from assignees in order to set them up in drop down options
  // selected user as assignees is coming with Check Icon
  const userOptions: MoreOptionsItem[] = users.map((user) => {
    const isSelected = values.assignees.some((assignee) => assignee.id === user.id);
    return {
      id: user.id,
      label: user.displayName,
      icon: isSelected ? <CheckIcon fontSize="small" /> : undefined,
      onClick: () => toggleAssignee(user),
    };
  });

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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Assigned to</span>
            <MoreOptions
              items={userOptions}
              buttonAriaLabel="open assignee options"
              buttonId="assignee-options-button"
              menuId="assignee-options-menu"
              triggerIcon={<PersonAddAlt1Icon />}
              menuWidth={220}
              maxVisibleItems={5}
              closeOnItemClick={false}
            />
          </div>
          {isLoadingUsers && <p className="text-xs text-slate-500">Loading users...</p>}
          {userLoadError && <p className="text-xs text-rose-600">{userLoadError}</p>}
          {values.assignees.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {values.assignees.map((assignee) => (
                <button
                  key={assignee.id}
                  type="button"
                  onClick={() => removeAssignee(assignee)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white ${assignee.colorClassName} cursor-pointer`}
                  title="Click to remove"
                >
                  {assignee.initials}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No assignee selected</p>
          )}
        </div>

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
