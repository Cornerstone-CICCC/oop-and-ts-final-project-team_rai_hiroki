import { cn } from "@/utils";
import type { Page } from "./Header";

type BottomNavProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItemClass = (page: Page) =>
    cn(
      "flex flex-col items-center gap-1 py-2 px-4 flex-1 text-xs font-medium transition-colors",
      currentPage === page
        ? "text-indigo-600"
        : "text-slate-400 active:text-slate-600"
    );

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200">
      <div className="flex">
        <button onClick={() => onNavigate("kanban")} className={navItemClass("kanban")}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
          </svg>
          Board
        </button>
        <button onClick={() => onNavigate("users")} className={navItemClass("users")}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Users
        </button>
      </div>
    </nav>
  );
}
