import React from "react";
import TaskCard from "./TaskCard";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TaskColumn({
  title = "Tasks",
  subtitle = "All active work in one place.",
  tasks,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  className,
}) {
  return (
    <section
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-[18px] border-2 border-[#dbb96a] bg-[#f5e9cc]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 bg-[#653d15] px-4 py-3">
        <div>
          <h2 className="text-[15px] font-extrabold text-[#fdf6e3]">{title}</h2>
          <p className="mt-0.5 text-xs font-semibold text-[#dbb96a]">{subtitle}</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-[#e9a319] px-2.5 py-0.5 text-[11px] font-extrabold text-[#653d15]">
          {tasks.length}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-[#dbb96a] bg-[#f0ddb8] px-4 py-6 text-center text-sm font-semibold text-[#7a4d1a]">
              No tasks match this search.
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
