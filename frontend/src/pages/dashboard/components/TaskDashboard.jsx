import React, { useMemo, useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import TaskColumn from "./TaskColumn";
import Navbar from "./Navbar";
import Footer from "./Footer";
import XpBar from "./XpBar";
import EditTaskModal from "./EditTaskModal";
import AddTaskModal from "./AddTaskModal";
import AchievementTracker from "./AchievementTracker";
import { getLevel } from "./xpSystem";
import { useAuth } from "@clerk/react";
import { useTasks } from "../../../hooks/useTasks";
import { useAchievements } from "../../../hooks/useAchievements";
import { ReactComponent as DoneIcon } from "../../../assets/Icons/done_icon.svg";
import { ReactComponent as StreakIcon } from "../../../assets/Icons/streak_icon.svg";
import { ReactComponent as XPIcon } from "../../../assets/Icons/xp_icon.svg";
import WeeklyCalendarView from "./WeeklyCalendarView";

const DIFFICULTY_ORDER = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
  EPIC: 4,
};

function matchesQuery(task, query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return true;
  return (
    String(task.title || "").toLowerCase().includes(q) ||
    String(task.tag || "").toLowerCase().includes(q)
  );
}

function sortTasks(tasks, order) {
  const sorted = [...tasks];
  if (order === "latest") {
    sorted.sort((a, b) => Number(b.id) - Number(a.id));
  } else if (order === "oldest") {
    sorted.sort((a, b) => Number(a.id) - Number(b.id));
  } else if (order === "hardest") {
    sorted.sort(
      (a, b) =>
        (DIFFICULTY_ORDER[b.difficulty] || 0) -
        (DIFFICULTY_ORDER[a.difficulty] || 0)
    );
  } else if (order === "easiest") {
    sorted.sort(
      (a, b) =>
        (DIFFICULTY_ORDER[a.difficulty] || 0) -
        (DIFFICULTY_ORDER[b.difficulty] || 0)
    );
  }
  return sorted;
}

function UnlockNotification({ achievement, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3200);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!achievement) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-xl border-2 border-[#dbb96a] bg-[#e9a319] p-4 shadow-lg">
      <p className="text-sm font-extrabold text-[#653d15]">Achievement Unlocked</p>
      <p className="mt-1 text-sm font-semibold text-[#653d15]">{achievement.title}</p>
      <p className="mt-1 text-xs font-bold text-[#7a4d1a]">+{achievement.xp_reward ?? achievement.xpReward} XP</p>
    </div>
  );
}

export default function TaskDashboard() {
  const { getToken } = useAuth();
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [tasks, setTasks] = useState([]);
  const [xp, setXp] = useState(0);
  const [editingTask, setEditingTask] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [newlyUnlocked, setNewlyUnlocked] = useState(null);

  const { tasks: apiTasks, profile, loading } = useTasks();
  const {
    achievements,
    loading: achievementsLoading,
    error: achievementsError,
    refetch: refetchAchievements,
  } = useAchievements();

  useEffect(() => {
    setTasks(apiTasks);
  }, [apiTasks]);

  useEffect(() => {
    if (profile?.xp != null) {
      setXp(profile.xp);
    }
  }, [profile]);

  const filteredTasks = useMemo(() => {
    return sortTasks(
      tasks.filter((task) => matchesQuery(task, query)),
      sortOrder
    );
  }, [tasks, query, sortOrder]);

  function toggleTask(id, payload) {
    if (payload?.user?.xp != null) {
      setXp(payload.user.xp);
    }

    const unlocked = payload?.unlockedAchievements ?? [];
    if (unlocked.length > 0) {
      setNewlyUnlocked(unlocked[0]);
      refetchAchievements();
    }

    const nextCompleted = payload?.completed ?? true;
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: nextCompleted,
              completedAt: nextCompleted
                ? payload?.completedAt ?? task.completedAt ?? new Date().toISOString()
                : null,
              xpClaimed: payload?.xpClaimed ?? (task.xpClaimed || nextCompleted),
            }
          : task
      )
    );
  }

  function handleEditSave(updatedTask) {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? { ...task, ...updatedTask } : task))
    );
    setEditingTask(null);
  }

  function handleDelete(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  const doneToday = tasks.filter((task) => task.completed).length;
  const displayStreak =
    profile?.streak ??
    tasks.reduce((max, task) => Math.max(max, task.streak || 0), 0);
  const displayLevel = getLevel(xp);

  async function handleCreateTask({ title, difficulty, recurrence, tag }) {
    setError("");
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:8080"}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, difficulty, recurrence, tag }),
        }
      );

      if (!response.ok) throw new Error("Failed to create task.");

      const createdTask = await response.json();
      setTasks((prev) => [createdTask, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f0ddb8]">
      <Navbar />
      <div className="flex-1 min-h-0">
        <div className="h-full">
          <DashboardLayout
            query={query}
            onQueryChange={setQuery}
            onOpenFilters={() => {}}
            onAddTask={() => setAddModalOpen(true)}
            xp={xp}
            level={displayLevel}
            streak={displayStreak}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          >
            {loading ? (
              <div className="flex items-center justify-center py-20 text-sm font-semibold text-[#9a6530]">
                Loading your tasks...
              </div>
            ) : (
              <>
                <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto]">
                  <XpBar xp={xp} />
                  <div className="flex gap-2">
                    <div className="rounded-xl border-2 border-[#dbb96a] bg-[#f0ddb8] px-4 py-2.5 text-center">
                      <p className="text-xl font-extrabold leading-none text-[#653d15]">
                        {displayStreak}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#9a6530]">
                        Streak
                      </p>
                      <StreakIcon className="mx-auto mt-2 h-5 w-5 text-[#9a6530]" />
                    </div>
                    <div className="rounded-xl border-2 border-[#dbb96a] bg-[#f0ddb8] px-4 py-2.5 text-center">
                      <p className="text-xl font-extrabold leading-none text-[#653d15]">
                        {xp}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#9a6530]">
                        Total XP
                      </p>
                      <XPIcon className="mx-auto mt-2 h-5 w-5 text-[#9a6530]" />
                    </div>
                    <div className="rounded-xl border-2 border-[#dbb96a] bg-[#f0ddb8] px-4 py-2.5 text-center">
                      <p className="text-xl font-extrabold leading-none text-[#653d15]">
                        {doneToday}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#9a6530]">
                        Done
                      </p>
                      <DoneIcon className="mx-auto mt-2 h-5 w-5 text-[#9a6530]" />
                    </div>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm font-medium text-rose-700">
                      {error}
                    </p>
                  )}
                </div>

                <TaskColumn
                  title="Tasks"
                  subtitle="Daily, weekly, and one-time tasks."
                  tasks={filteredTasks}
                  onToggleTask={toggleTask}
                  onEditTask={setEditingTask}
                  onDeleteTask={handleDelete}
                  className="min-h-[420px]"
                />

                <div className="mt-5">
                  <AchievementTracker
                    achievements={achievements}
                    loading={achievementsLoading}
                    error={achievementsError}
                  />
                </div>
                <WeeklyCalendarView tasks={tasks} />
              </>
            )}
          </DashboardLayout>
        </div>
      </div>
      <Footer />

      <AddTaskModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onCreate={handleCreateTask}
      />

      <EditTaskModal
        open={editingTask !== null}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleEditSave}
      />

      <UnlockNotification
        achievement={newlyUnlocked}
        onClose={() => setNewlyUnlocked(null)}
      />
    </div>
  );
}
