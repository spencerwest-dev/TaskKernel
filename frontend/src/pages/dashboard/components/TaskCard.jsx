import React, { useState } from "react";
import { useAuth } from "@clerk/react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const DIFFICULTY_META = {
  EASY: { label: "Easy", xp: 10, chip: "bg-[#e9a319] text-[#653d15]" },
  MEDIUM: { label: "Medium", xp: 25, chip: "bg-[#dbb96a] text-[#653d15]" },
  HARD: { label: "Hard", xp: 50, chip: "bg-[#653d15] text-[#fdf6e3]" },
  EPIC: { label: "Epic", xp: 100, chip: "bg-[#4a2c0e] text-[#fdf6e3]" },
};

const RECURRENCE_LABELS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  ONE_TIME: "One-time",
};

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const { getToken } = useAuth();
  const completed = Boolean(task.completed);
  const difficulty = task.difficulty || "EASY";
  const difficultyMeta = DIFFICULTY_META[difficulty] || DIFFICULTY_META.EASY;
  const recurrence = task.recurrence || "DAILY";
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const apiBaseUrl =
    process.env.REACT_APP_API_URL?.replace(/\/$/, "") || "http://localhost:8080";

  async function handleToggle() {
    if (isSaving) return;
    const nextCompleted = !completed;

    setIsSaving(true);
    setError("");
    try {
      const token = await getToken?.();
      if (!token) {
        throw new Error("Sign in again to update this task.");
      }

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
        completedAt: payload?.completedAt,
        xpClaimed: payload?.xpClaimed,
        user: payload?.user,
        unlockedAchievements: payload?.unlockedAchievements ?? [],
      });
    } catch (error) {
      console.error("Task completion update failed:", error);
      setError(error.message || "Unable to update task.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (isDeleting) return;
    setIsDeleting(true);
    setError("");
    try {
      const token = await getToken?.();
      if (!token) {
        throw new Error("Sign in again to delete this task.");
      }

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
      setError(error.message || "Unable to delete task.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-[14px] border-2 border-[#dbb96a] bg-[#f5e9cc] p-3 transition",
        "hover:-translate-y-0.5 hover:border-[#e9a319] hover:shadow-[0_3px_12px_rgba(101,61,21,0.1)]",
        completed && "bg-[#f0ddb8] opacity-70"
      )}
    >
      <button
        type="button"
        onClick={handleToggle}
        disabled={isSaving}
        aria-label={completed ? "Mark incomplete" : "Mark complete"}
        className={cn(
          "mt-0.5 inline-flex h-9 w-9 flex-none items-center justify-center rounded-full text-base font-extrabold shadow-sm transition hover:scale-105",
          completed ? "bg-[#27ae60] text-[#fdf6e3]" : "bg-[#653d15] text-[#fdf6e3]",
          isSaving && "cursor-not-allowed opacity-70"
        )}
      >
        {completed ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path d="M20 7 10 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span className="h-3 w-3 rounded-full border-2 border-current" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p
            className={cn(
              "min-w-0 truncate text-sm font-semibold",
              completed ? "line-through text-[#9a6530]" : "text-[#653d15]"
            )}
            title={task.title}
          >
            {task.title}
          </p>
          <span className="flex-none rounded-full bg-[#f0ddb8] px-2.5 py-0.5 text-[10px] font-bold uppercase text-[#7a4d1a]">
            {RECURRENCE_LABELS[recurrence] || recurrence}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold", difficultyMeta.chip)}>
            {difficultyMeta.label} · {difficultyMeta.xp} XP
          </span>
          {task.tag ? (
            <span className="rounded-full border border-[#dbb96a] bg-[#f5e9cc] px-2.5 py-0.5 text-[10px] font-bold text-[#7a4d1a]">
              {task.tag}
            </span>
          ) : null}
        </div>

        <div className="mt-2 flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit?.(task)}
            aria-label="Edit task"
            className="rounded-full bg-[#f0ddb8] px-2 py-1 text-[10px] font-semibold text-[#653d15] transition hover:bg-[#dbb96a]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Delete task"
            className="rounded-full bg-[#f0ddb8] px-2 py-1 text-[10px] font-semibold text-rose-700 transition hover:bg-[#dbb96a] disabled:opacity-50"
          >
            {isDeleting ? "..." : "Delete"}
          </button>
        </div>

        {error ? (
          <p className="mt-2 text-xs font-semibold text-rose-700">{error}</p>
        ) : null}
      </div>
    </div>
  );
}
