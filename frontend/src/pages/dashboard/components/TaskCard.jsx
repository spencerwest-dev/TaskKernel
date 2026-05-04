import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { ReactComponent as StreakIcon } from "../../../assets/Icons/streak_icon.svg";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function strengthStyles(strength) {
  if (strength === "weak") {
    return {
      button: "bg-[#e9a319] text-[#653d15]",
      chip: "bg-[#e9a319] text-[#653d15]",
    };
  }
  return {
    button: "bg-[#653d15] text-[#fdf6e3]",
    chip: "bg-[#653d15] text-[#fdf6e3]",
  };
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const { getToken } = useAuth();

  const styles = strengthStyles(task.strength);
  const completed = Boolean(task.completed);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const apiBaseUrl =
    process.env.REACT_APP_API_URL?.replace(/\/$/, "") || "http://localhost:8080";

  async function handleToggle() {
    if (isSaving) return;
    const nextCompleted = !completed;

    setIsSaving(true);
    try {
      const token = await getToken?.();
      if (!token) {
        onToggle?.(task.id, { completed: nextCompleted });
        return;
      }

      // CWE-306: critical completion calls must send the Clerk JWT (never omit when token exists).
      const response = await fetch(`${apiBaseUrl}/tasks/${task.id}/complete`, {
        method: nextCompleted ? "POST" : "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Unable to update task completion (${response.status}).`);
      }

      const payload = await response.json();
      onToggle?.(task.id, {
        completed: nextCompleted,
        user: payload?.user,
      });
    } catch (error) {
      console.error("Task completion update failed:", error);
      onToggle?.(task.id, { completed: nextCompleted });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const token = await getToken?.();
      const response = await fetch(`${apiBaseUrl}/tasks/${task.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Unable to delete task (${response.status}).`);
      }

      onDelete?.(task.id);
    } catch (error) {
      console.error("Task delete failed:", error);
      // Still remove locally if API fails
      onDelete?.(task.id);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-[14px] border-2 border-[#dbb96a] bg-[#fdf6e3] p-3 transition",
        "hover:-translate-y-0.5 hover:border-[#e9a319] hover:shadow-[0_3px_12px_rgba(101,61,21,0.1)]",
        completed && "bg-[#f5e9cc] opacity-60"
      )}
    >
      <button
        type="button"
        onClick={handleToggle}
        disabled={isSaving}
        aria-label={completed ? "Mark incomplete" : "Mark complete"}
        className={cn(
          "mt-0.5 inline-flex h-9 w-9 flex-none items-center justify-center rounded-full text-base font-extrabold shadow-sm transition hover:scale-105",
          completed ? "bg-[#27ae60] text-white" : styles.button,
          isSaving && "cursor-not-allowed opacity-70"
        )}
      >
        {completed ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path d="M20 7 10 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
                completed ? "line-through text-[#9a6530]" : "text-[#653d15]"
              )}
              title={task.title}
            >
              {task.title}
            </p>
            {task.description ? (
              <p className="mt-0.5 line-clamp-2 text-xs text-[#9a6530]">{task.description}</p>
            ) : null}
          </div>

          <div className="flex flex-none flex-col items-end gap-1 text-xs font-bold text-[#9a6530]">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f5e9cc] px-2 py-0.5">
              <StreakIcon className="h-4 w-4 text-[#9a6530]" />
              <span>{task.streak ?? 0}</span>
            </span>
            <span className="rounded-full bg-[#f5e9cc] px-2 py-0.5">{task.frequency}</span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold", styles.chip)}>
              {task.strength === "weak" ? "Weak" : "Strong"}
            </span>
            {task.xp ? (
              <span className="rounded-full bg-[#dbb96a] px-2.5 py-0.5 text-[10px] font-bold text-[#653d15]">
                +{task.xp} XP
              </span>
            ) : null}
          </div>

          {/* Edit + Delete buttons — visible on hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onEdit?.(task)}
              aria-label="Edit task"
              className="rounded-full bg-[#f5e9cc] px-2 py-1 text-[10px] font-semibold text-[#653d15] hover:bg-[#dbb96a] transition"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              aria-label="Delete task"
              className="rounded-full bg-[#f5e9cc] px-2 py-1 text-[10px] font-semibold text-rose-600 hover:bg-rose-100 transition disabled:opacity-50"
            >
              {isDeleting ? "..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}