import { SearchBar } from "@/components";

export function KanbanBoard() {
  return (
    <div className="flex h-[60vh] md:h-[calc(100vh-8rem)]">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 w-full text-slate-400">
        <SearchBar />
      </div>
    </div>
  );
}

export default KanbanBoard;
