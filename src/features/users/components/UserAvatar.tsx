import type { IUser } from "@/types";

type UserAvatarProps = {
  user: IUser;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-sm",
  lg: "w-12 h-12 text-lg",
};

const avatarColors = [
  "bg-indigo-600",
  "bg-rose-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-cyan-600",
  "bg-violet-600",
  "bg-pink-600",
  "bg-teal-600",
];

function getColorFromId(id: string): string {
  let hash = 0;
  for (const char of id) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

/**
 * UserAvatar Component
 * Displays user avatar or initials (SRP - Single Responsibility)
 */
export function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  return (
    <div
      className={`${sizeClasses[size]} rounded-full ${getColorFromId(user.id)} flex items-center justify-center text-white font-medium overflow-hidden`}
    >
      {user.photoURL ? (
        <img
          src={user.photoURL}
          alt={user.displayName}
          className="w-full h-full object-cover"
        />
      ) : (
        user.displayName.charAt(0).toUpperCase()
      )}
    </div>
  );
}
