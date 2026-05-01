import React, { useMemo, useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import TaskColumn from "./TaskColumn";
import Navbar from "./Navbar";
import Footer from "./Footer";
import XpBar from "./XpBar";
import { addXp } from "./xpSystem";
import { useTasks } from "../../../hooks/useTasks";
import { ReactComponent as DoneIcon } from "../../../assets/Icons/done_icon.svg";
import { ReactComponent as StreakIcon } from "../../../assets/Icons/streak_icon.svg";
import { ReactComponent as XPIcon } from "../../../assets/Icons/xp_icon.svg";

function normalizeTab(tab) {
  return String(tab || "All");
}

function matchesTab(task, tab) {
  const t = normalizeTab(tab);
  if (t === "All") return true;
  if (t === "Completed") return Boolean(task.completed);
  if (t === "Weak") return task.strength === "weak" && !task.completed;
  if (t === "Strong") return task.strength === "strong" && !task.completed;
  return true;
}

function matchesQuery(task, query) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q) return true;
  return (
    String(task.title || "").toLowerCase().includes(q) ||
    String(task.description || "").toLowerCase().includes(q)
  );
}

export default function TaskDashboard() {
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState([]);
  const [dailyTab, setDailyTab] = useState("All");
  const [weeklyTab, setWeeklyTab] = useState("All");
  const [xp, setXp] = useState(0);
  const [xpWarning, setXpWarning] = useState("");

  // Fetch real tasks + user profile from the backend
  const { tasks: apiTasks, profile, loading, refetch } = useTasks();

  // Once tasks load, replace local state with real data
  useEffect(() => {
    if (apiTasks.length > 0) {
      setTasks(apiTasks);
    }
  }, [apiTasks]);

  // Seed XP from backend profile
  useEffect(() => {
    if (profile?.xp != null) {
      setXp(profile.xp);
    }
  }, [profile]);

  const dailyTasks = useMemo(() => {
    return tasks
      .filter((t) => t.type === "daily")
      .filter((t) => matchesQuery(t, query))
      .filter((t) => matchesTab(t, dailyTab));
  }, [tasks, query, dailyTab]);

  const weeklyTasks = useMemo(() => {
    return tasks
      .filter((t) => t.type === "weekly")
      .filter((t) => matchesQuery(t, query))
      .filter((t) => matchesTab(t, weeklyTab));
  }, [tasks, query, weeklyTab]);

  function toggleTask(id, payload) {
    // If we got real user data back from the API, update XP
    if (payload?.user?.xp != null) {
      setXp(payload.user.xp);
      setXpWarning("");
    } else {
      // Fallback: local XP calculation
      const task = tasks.find((t) => t.id === id);
      if (task && !task.completed && !task.xpClaimed) {
        const result = addXp(xp, task.xp || 10);
        setXp(result.xp);
        setXpWarning("");
      } else if (task && !task.completed && task.xpClaimed) {
        setXpWarning("You can't earn XP again from this task.");
      }
    }

    const nextCompleted = payload?.completed ?? true;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: nextCompleted,
              xpClaimed: t.xpClaimed || nextCompleted,
            }
          : t
      )
    );
  }

  const doneToday = tasks.filter((t) => t.completed).length;
  const displayStreak = profile?.streak ?? tasks.reduce((max, t) => Math.max(max, t.streak || 0), 0);

  function addTask() {
    const id = `d-${Date.now()}`;
    setTasks((prev) => [
      {
        id,
        type: "daily",
        title: "New task",
        description: "",
        strength: "weak",
        frequency: "Daily",
        streak: 0,
        xp: 10,
        completed: false,
      },
      ...prev,
    ]);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf6e3]">
      <Navbar />
      <div className="flex-1 min-h-0">
        <div className="h-full">
          <DashboardLayout
            query={query}
            onQueryChange={setQuery}
            onOpenFilters={() => {}}
            onAddTask={addTask}
          >
            {loading ? (
              <div className="flex items-center justify-center py-20 text-sm font-semibold text-[#9a6530]">
                Loading your tasks…
              </div>
            ) : (
              <>
                <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto]">
                  <XpBar xp={xp} />
                  <div className="flex gap-2">
                    <div className="rounded-xl border-2 border-[#dbb96a] bg-[#fdf6e3] px-4 py-2.5 text-center">
                      <p className="text-xl font-extrabold leading-none text-[#653d15]">{displayStreak}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#9a6530]">Streak</p>
                      <StreakIcon className="mx-auto mt-2 h-5 w-5 text-[#9a6530]" />
                    </div>
                    <div className="rounded-xl border-2 border-[#dbb96a] bg-[#fdf6e3] px-4 py-2.5 text-center">
                      <p className="text-xl font-extrabold leading-none text-[#653d15]">{xp}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#9a6530]">Total XP</p>
                      <XPIcon className="mx-auto mt-2 h-5 w-5 text-[#9a6530]" />
                    </div>
                    <div className="rounded-xl border-2 border-[#dbb96a] bg-[#fdf6e3] px-4 py-2.5 text-center">
                      <p className="text-xl font-extrabold leading-none text-[#653d15]">{doneToday}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#9a6530]">Done</p>
                      <DoneIcon className="mx-auto mt-2 h-5 w-5 text-[#9a6530]" />
                    </div>
                  </div>
                  {xpWarning && (
                    <p className="mt-2 text-sm font-medium text-red-600">{xpWarning}</p>
                  )}
                </div>
                <div className="grid h-full min-h-0 grid-cols-1 gap-5 lg:grid-cols-2">
                  <TaskColumn
                    title="Daily Tasks"
                    subtitle="Small wins, big streaks."
                    tasks={dailyTasks}
                    activeTab={dailyTab}
                    onTabChange={setDailyTab}
                    onToggleTask={toggleTask}
                    className="min-h-0"
                  />
                  <TaskColumn
                    title="Weekly Tasks"
                    subtitle="Build skills over time."
                    tasks={weeklyTasks}
                    activeTab={weeklyTab}
                    onTabChange={setWeeklyTab}
                    onToggleTask={toggleTask}
                    className="min-h-0"
                  />
                </div>
              </>
            )}
          </DashboardLayout>
        </div>
      </div>
      <Footer />
    </div>
  );
}