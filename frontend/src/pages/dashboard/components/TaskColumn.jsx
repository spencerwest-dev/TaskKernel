import React from "react";
import TaskCard from "./TaskCard";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const TABS = ["All", "Weak", "Strong", "Completed"];

export default function TaskColumn({
  title,
  subtitle,
  tasks,
  activeTab,
  onTabChange,
  onToggleTask,
  className,
}) {

   const filteredTasks = tasks.filter((task) => {
    if (activeTab === "All") return true;
    if (activeTab === "Weak") return task.strength === "weak";
    if (activeTab === "Strong") return task.strength === "strong";
    if (activeTab === "Completed") return task.completed === true;
    return true;
  });

  const orderedTasks = [...filteredTasks].sort((a, b) => {
    if (a.priority === b.priority) return 0;
    return a.priority ? -1 : 1;
  });


  return (
    <section
      className={cn(
        "flex min-h-0 flex-col rounded-3xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        <span className="inline-flex h-7 items-center rounded-full bg-slate-900 px-2.5 text-xs font-semibold text-white">
          {tasks.length}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const selected = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange?.(tab)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                selected
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="space-y-3">
          {orderedTasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
              No tasks match this filter.
            </div>
          ) : (
           orderedTasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={onToggleTask} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
