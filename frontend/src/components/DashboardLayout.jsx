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
    <div className="h-full bg-gradient-to-b from-slate-50 to-indigo-50/40 text-slate-900">
      <div className="flex h-full flex-col">
        <Header
          query={query}
          onQueryChange={onQueryChange}
          onOpenFilters={onOpenFilters}
          onAddTask={onAddTask}
        />

        <main className="flex-1 min-h-0">
          <div className="mx-auto h-full max-w-6xl px-4 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

