import { useState, type FormEvent } from "react";
import { useAuth } from "@/hooks";
import { Modal, Input, Button, Alert } from "@/components/ui";
import { formatDateShort } from "@/utils";
import { UserAvatar } from "./UserAvatar";
import type { IUser } from "@/types";

type UserDetailModalProps = {
  user: IUser | null;
  isOpen: boolean;
  onClose: () => void;
};

export function UserDetailModal({
  user,
  isOpen,
  onClose,
}: UserDetailModalProps) {
  const { user: currentUser, updateProfile, error, clearError } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwnProfile = currentUser?.id === user?.id;

  const handleEdit = () => {
    if (!user) return;
    setDisplayName(user.displayName);
    setBio(user.bio);
    setLocalError(null);
    clearError();
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLocalError(null);
    clearError();
  };

  const handleClose = () => {
    setIsEditing(false);
    setLocalError(null);
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!displayName.trim()) {
      setLocalError("Display name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({
        displayName: displayName.trim(),
        bio: bio.trim(),
      });
      setIsEditing(false);
    } catch {
      // error is handled via auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  const displayError = localError || error;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="User Profile">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {displayError && <Alert variant="error">{displayError}</Alert>}

          <Input
            label="Display Name"
            type="text"
            id="editDetailDisplayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            disabled={isSubmitting}
          />

          <div>
            <label
              htmlFor="editDetailBio"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Bio
            </label>
            <textarea
              id="editDetailBio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              disabled={isSubmitting}
              rows={3}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all resize-none"
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              loadingText="Saving..."
            >
              Save
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <UserAvatar user={user} size="lg" />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 truncate">
                {user.displayName}
              </h3>
              <p className="text-slate-500 text-sm truncate">{user.email}</p>
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-slate-700 mb-1">
              Bio
            </span>
            <p className="text-slate-600 text-sm whitespace-pre-wrap">
              {user.bio || "No bio yet."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-sm">
            <div>
              <span className="block text-slate-400 text-xs">Joined</span>
              <span className="text-slate-600">
                {formatDateShort(user.createdAt)}
              </span>
            </div>
            <div>
              <span className="block text-slate-400 text-xs">Last Login</span>
              <span className="text-slate-600">
                {formatDateShort(user.lastLoginAt)}
              </span>
            </div>
          </div>

          {isOwnProfile && (
            <div className="pt-2">
              <Button type="button" variant="secondary" onClick={handleEdit}>
                Edit
              </Button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
