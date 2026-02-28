import { useState } from "react";
import { LoadingSpinner } from "@/components/ui";
import { useUserList } from "../hooks";
import { UserCard } from "./UserCard";
import { UserDetailModal } from "./UserDetailModal";
import type { IUser } from "@/types";

/**
 * UserListPage Component
 * Displays a list of all users in the system
 */
export function UserListPage() {
  const { users, isLoading, error } = useUserList();
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Users ({users.length})
        </h2>
      </div>

      {users.length === 0 ? (
        <p className="text-slate-500 text-center py-8">No users found</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <UserCard key={user.id} user={user} onClick={() => setSelectedUser(user)} />
          ))}
        </div>
      )}

      <UserDetailModal
        user={selectedUser}
        isOpen={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
