import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function strengthStyles(strength) {
  if (strength === "weak") {
    return {
      ring: "ring-orange-500/20",
      button: "bg-orange-500 hover:bg-orange-600",
      chip: "bg-orange-50 text-orange-700 ring-1 ring-orange-600/20",
    };
  }
  return {
    ring: "ring-indigo-500/15",
    button: "bg-indigo-600 hover:bg-indigo-700",
    chip: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20",
  };
}

export default function TaskCard({ task, onToggle }) {
  const styles = strengthStyles(task.strength);
  const completed = Boolean(task.completed);

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition",
        "hover:-translate-y-0.5 hover:shadow-md",
        completed && "opacity-70",
        styles.ring && "ring-1 " + styles.ring
      )}
    >
      <button
        type="button"
        onClick={() => onToggle?.(task.id)}
        aria-label={completed ? "Mark incomplete" : "Mark complete"}
        className={cn(
          "mt-0.5 inline-flex h-10 w-10 flex-none items-center justify-center rounded-full text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500/40",
          completed ? "bg-emerald-600 hover:bg-emerald-700" : styles.button
        )}
      >
        {completed ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
          >
            <path
              d="M20 7 10 17l-5-5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <span className="text-lg font-bold leading-none">+</span>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className={cn(
                "truncate text-sm font-semibold",
                completed ? "line-through text-slate-500" : "text-slate-900"
              )}
              title={task.title}
            >
              {task.title}
            </p>
            {task.description ? (
              <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                {task.description}
              </p>
            ) : null}
          </div>

          <div className="flex flex-none flex-col items-end gap-1 text-xs text-slate-600">
            <span className="rounded-full bg-slate-50 px-2 py-0.5 ring-1 ring-slate-200">
              🔥 {task.streak ?? 0}
            </span>
            <span className="rounded-full bg-slate-50 px-2 py-0.5 ring-1 ring-slate-200">
              {task.frequency}
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className={cn("rounded-full px-2 py-0.5 text-[11px]", styles.chip)}>
            {task.strength === "weak" ? "Weak" : "Strong"}
          </span>
          {task.xp ? (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700 ring-1 ring-emerald-600/20">
              +{task.xp} XP
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
