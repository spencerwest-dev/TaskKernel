import React from "react";
import Header from "./Header";

export default function DashboardLayout({
  query,
  onQueryChange,
  onOpenFilters,
  onAddTask,
  children,
}) {
  return (
    <div className="h-full bg-[#fdf6e3] text-[#653d15]">
      <div className="flex h-full flex-col">
        <Header
          query={query}
          onQueryChange={onQueryChange}
          onOpenFilters={onOpenFilters}
          onAddTask={onAddTask}
        />

        <main className="flex-1 min-h-0">
          <div className="mx-auto h-full max-w-7xl px-5 py-5 md:px-7">{children}</div>
        </main>
      </div>
    </div>
  );
}
