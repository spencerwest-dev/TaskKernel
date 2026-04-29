import React, { useEffect, useState } from "react";

const initialFormState = {
  title: "",
  description: "",
  type: "daily",
  strength: "weak",
};

// Rate limiting constants (in milliseconds)
const TASK_CREATION_COOLDOWN = 2000; // 2 seconds between task creations

export default function AddTaskModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState(initialFormState);
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  useEffect(() => {
    if (open) {
      setForm(initialFormState);
      // Check if still in cooldown when modal opens
      const lastCreationTime = localStorage.getItem("lastTaskCreationTime");
      if (lastCreationTime) {
        const timeSinceLastCreation = Date.now() - parseInt(lastCreationTime);
        if (timeSinceLastCreation < TASK_CREATION_COOLDOWN) {
          const remaining = Math.ceil((TASK_CREATION_COOLDOWN - timeSinceLastCreation) / 1000);
          setIsOnCooldown(true);
          setCooldownRemaining(remaining);
        }
      }
    }
  }, [open]);

  // Handle cooldown countdown timer
  useEffect(() => {
    if (!isOnCooldown || cooldownRemaining <= 0) {
      setIsOnCooldown(false);
      setCooldownRemaining(0);
      return;
    }

    const timer = setTimeout(() => {
      setCooldownRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isOnCooldown, cooldownRemaining]);

  if (!open) {
    return null;
  }

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Prevent submission during cooldown
    if (isOnCooldown) {
      return;
    }
    
    if (!form.title.trim()) {
      return;
    }

    // Record task creation time for rate limiting
    localStorage.setItem("lastTaskCreationTime", Date.now().toString());
    setIsOnCooldown(true);
    setCooldownRemaining(2);

    onCreate?.({
      title: form.title.trim(),
      description: form.description.trim(),
      type: form.type,
      strength: form.strength,
    });
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
      <div className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Add Task</h2>
            <p className="mt-1 text-sm text-slate-500">Create a new task with title, description, type, and strength.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Close
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Title
            <input
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              placeholder="Task title"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea
              value={form.description}
              onChange={handleChange("description")}
              placeholder="Task description"
              rows="4"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Type
              <select
                value={form.type}
                onChange={handleChange("type")}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Strength
              <select
                value={form.strength}
                onChange={handleChange("strength")}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="weak">Weak</option>
                <option value="strong">Strong</option>
              </select>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isOnCooldown}
              className="rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-indigo-500"
              title={isOnCooldown ? `Wait ${cooldownRemaining}s before creating another task` : "Create a new task"}
            >
              {isOnCooldown ? `Wait ${cooldownRemaining}s` : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
