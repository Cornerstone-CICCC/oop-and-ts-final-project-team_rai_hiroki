import { useState, useEffect } from "react";
import type { IUser } from "@/types";
import { useProfileService } from "@/services";

type UseUserListReturn = {
  users: IUser[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

/**
 * useUserList Hook
 * Subscribes to and manages the real-time list of all users
 */
export function useUserList(): UseUserListReturn {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const profileService = useProfileService();

  useEffect(() => {
    const unsubscribe = profileService.observeAllProfiles(
      (allUsers) => {
        setUsers(allUsers);
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [profileService]);

  // Keep refetch for interface compatibility, though it's not strictly necessary with real-time updates
  const refetch = async () => {
    // Real-time listener handles updates, so this could just be a no-op
    // But we could force a re-subscription if really needed.
    // For now, it's a no-op.
  };

  return { users, isLoading, error, refetch };
}
