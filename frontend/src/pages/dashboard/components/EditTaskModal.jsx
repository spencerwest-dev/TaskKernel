import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";
const TASK_UPDATE_COOLDOWN = 2000;

export default function EditTaskModal({ open, task, onClose, onSave }) {
  const { getToken } = useAuth();
  const [form, setForm] = useState({
    title: "",
    difficulty: "EASY",
    recurrence: "DAILY",
    tag: "",
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  useEffect(() => {
    if (open && task) {
      setForm({
        title: task.title || "",
        difficulty: task.difficulty || "EASY",
        recurrence: task.recurrence || "DAILY",
        tag: task.tag || "",
      });
      setError("");

      const lastUpdateTime = localStorage.getItem("lastTaskUpdateTime");
      if (lastUpdateTime) {
        const timeSinceLastUpdate = Date.now() - parseInt(lastUpdateTime, 10);
        if (timeSinceLastUpdate < TASK_UPDATE_COOLDOWN) {
          const remaining = Math.ceil((TASK_UPDATE_COOLDOWN - timeSinceLastUpdate) / 1000);
          setIsOnCooldown(true);
          setCooldownRemaining(remaining);
        }
      }
    }
  }, [open, task]);

  useEffect(() => {
    if (!isOnCooldown || cooldownRemaining <= 0) {
      setIsOnCooldown(false);
      setCooldownRemaining(0);
      return;
    }
    const timer = setTimeout(() => setCooldownRemaining((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [isOnCooldown, cooldownRemaining]);

  if (!open || !task) return null;

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isOnCooldown) return;
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    setIsSaving(true);
    setError("");

    const payload = {
      title: form.title.trim(),
      description: task.description || "",
      difficulty: form.difficulty,
      recurrence: form.recurrence,
      tag: form.tag.trim() || null,
    };

    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Unable to save task.");

      localStorage.setItem("lastTaskUpdateTime", Date.now().toString());
      setIsOnCooldown(true);
      setCooldownRemaining(2);

      const updatedTask = await response.json();
      onSave?.(updatedTask);
      onClose?.();
    } catch (saveError) {
      setError(saveError.message || "Unable to save task.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#653d15]/40 px-4 py-6">
      <div className="w-full max-w-xl rounded-[2rem] bg-[#f5e9cc] p-6 shadow-2xl ring-2 ring-[#dbb96a]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#653d15]">Edit Task</h2>
            <p className="mt-1 text-sm text-[#9a6530]">Update task details and save changes.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border-2 border-[#dbb96a] bg-[#f0ddb8] px-3 py-2 text-sm font-semibold text-[#653d15] hover:bg-[#dbb96a]"
          >
            Close
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-[#653d15]">
            Title
            <input
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              className="mt-2 w-full rounded-3xl border-2 border-[#dbb96a] bg-[#f5e9cc] px-4 py-3 text-sm text-[#653d15] outline-none focus:border-[#e9a319] focus:ring-2 focus:ring-[#e9a319]/30 placeholder:text-[#b08040]"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#653d15]">
              Difficulty
              <select
                value={form.difficulty}
                onChange={handleChange("difficulty")}
                className="mt-2 w-full rounded-3xl border-2 border-[#dbb96a] bg-[#f5e9cc] px-4 py-3 text-sm text-[#653d15] outline-none focus:border-[#e9a319] focus:ring-2 focus:ring-[#e9a319]/30"
              >
                <option value="EASY">Easy · 10 XP</option>
                <option value="MEDIUM">Medium · 25 XP</option>
                <option value="HARD">Hard · 50 XP</option>
                <option value="EPIC">Epic · 100 XP</option>
              </select>
            </label>

            <label className="block text-sm font-semibold text-[#653d15]">
              Recurrence
              <select
                value={form.recurrence}
                onChange={handleChange("recurrence")}
                className="mt-2 w-full rounded-3xl border-2 border-[#dbb96a] bg-[#f5e9cc] px-4 py-3 text-sm text-[#653d15] outline-none focus:border-[#e9a319] focus:ring-2 focus:ring-[#e9a319]/30"
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="ONE_TIME">One-time</option>
              </select>
            </label>
          </div>

          <label className="block text-sm font-semibold text-[#653d15]">
            Tag
            <input
              type="text"
              value={form.tag}
              onChange={handleChange("tag")}
              className="mt-2 w-full rounded-3xl border-2 border-[#dbb96a] bg-[#f5e9cc] px-4 py-3 text-sm text-[#653d15] outline-none focus:border-[#e9a319] focus:ring-2 focus:ring-[#e9a319]/30 placeholder:text-[#b08040]"
            />
          </label>

          {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-3xl border-2 border-[#dbb96a] bg-[#f0ddb8] px-4 py-3 text-sm font-semibold text-[#653d15] hover:bg-[#dbb96a]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isOnCooldown}
              className="rounded-3xl bg-[#653d15] px-5 py-3 text-sm font-bold text-[#fdf6e3] shadow-sm hover:bg-[#4a2c0e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isOnCooldown ? `Wait ${cooldownRemaining}s` : isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
