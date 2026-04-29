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
        "flex min-h-0 flex-col overflow-hidden rounded-[18px] border-2 border-[#dbb96a] bg-[#f5e9cc]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 bg-[#653d15] px-4 py-3">
        <h2 className="text-[15px] font-extrabold text-[#fdf6e3]">{title}</h2>
        <span className="inline-flex items-center rounded-full bg-[#e9a319] px-2.5 py-0.5 text-[11px] font-extrabold text-[#653d15]">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-wrap gap-1 border-b-2 border-[#dbb96a] bg-[#f0ddb8] px-3.5">
        {TABS.map((tab) => {
          const selected = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange?.(tab)}
              className={cn(
                "border-b-[3px] border-transparent px-2.5 py-2 text-xs font-semibold text-[#9a6530] transition",
                selected
                  ? "border-[#e9a319] text-[#653d15]"
                  : "hover:text-[#653d15]"
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="space-y-3">
          {orderedTasks.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-[#dbb96a] bg-[#fdf6e3] px-4 py-6 text-center text-sm font-semibold text-[#b08040]">
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
