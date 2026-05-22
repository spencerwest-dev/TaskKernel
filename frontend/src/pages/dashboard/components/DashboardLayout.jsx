import React from "react";
import Header from "./Header";

export default function DashboardLayout({
  query,
  onQueryChange,
  onOpenFilters,
  onAddTask,
  xp,
  level,
  streak,
  sortOrder,
  onSortChange,
  children,
}) {
  return (
    <div className="h-full bg-[#f0ddb8] text-[#653d15]">
      <div className="flex h-full flex-col">
        <Header
          query={query}
          onQueryChange={onQueryChange}
          onOpenFilters={onOpenFilters}
          onAddTask={onAddTask}
          xp={xp}
          level={level}
          streak={streak}
          sortOrder={sortOrder}
          onSortChange={onSortChange}
        />

        <main className="flex-1 min-h-0">
          <div className="mx-auto h-full max-w-7xl px-5 py-5 md:px-7">{children}</div>
        </main>
      </div>
    </div>
  );
}
