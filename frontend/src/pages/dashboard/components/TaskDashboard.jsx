import React, { useMemo, useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import TaskColumn from "./TaskColumn";
import Navbar from "./Navbar";
import Footer from "./Footer";
import XpBar from "./XpBar";
import { addXp } from "./xpSystem";
import { useUserProfile } from "../../../hooks/useUserProfile";
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

const initialTasks = [
  {
    id: "d-1",
    type: "daily",
    title: "Drink water",
    description: "8 cups minimum",
    strength: "strong",
    frequency: "Daily",
    streak: 6,
    xp: 8,
    completed: false,
  },
  {
    id: "d-2",
    type: "daily",
    title: "20 min focused study",
    description: "One Pomodoro, no distractions",
    strength: "weak",
    frequency: "Daily",
    streak: 1,
    xp: 15,
    completed: false,
  },
  {
    id: "d-3",
    type: "daily",
    title: "Stretch + posture reset",
    description: "Neck/shoulders/hips",
    strength: "strong",
    frequency: "Daily",
    streak: 12,
    xp: 10,
    completed: true,
    xpClaimed: true,
  },
  {
    id: "d-4",
    type: "daily",
    title: "Inbox zero (10 min)",
    description: "Email + messages sweep",
    strength: "weak",
    frequency: "Daily",
    streak: 0,
    xp: 12,
    completed: false,
  },
  {
    id: "w-1",
    type: "weekly",
    title: "Plan the week",
    description: "Top 3 outcomes + schedule blocks",
    strength: "strong",
    frequency: "Weekly",
    streak: 4,
    xp: 25,
    completed: false,
  },
  {
    id: "w-2",
    type: "weekly",
    title: "Deep clean workspace",
    description: "Desk reset + file cleanup",
    strength: "weak",
    frequency: "Weekly",
    streak: 0,
    xp: 20,
    completed: false,
  },
  {
    id: "w-3",
    type: "weekly",
    title: "Review progress",
    description: "Wins, blockers, next tweaks",
    strength: "strong",
    frequency: "Weekly",
    streak: 7,
    xp: 18,
    completed: true,
    xpClaimed: true,
  },
];

export default function TaskDashboard() {
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState(initialTasks);
  const [dailyTab, setDailyTab] = useState("All");
  const [weeklyTab, setWeeklyTab] = useState("All");
  const [xp, setXp] = useState(0);
  const [xpWarning, setXpWarning] = useState("");

  // Pull real xp/level/streak from the backend
  const { profile, loading: profileLoading } = useUserProfile();

  // Once the profile loads, seed xp from the backend value
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

  function toggleTask(id) {
    const task = tasks.find((t) => t.id === id);

    if (task && !task.completed && !task.xpClaimed) {
      const result = addXp(xp, task.xp || 10);
      setXp(result.xp);
      setXpWarning("");
    } else if (task && !task.completed && task.xpClaimed) {
      setXpWarning("You can't earn XP again from this task.");
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              xpClaimed: t.xpClaimed || !t.completed,
            }
          : t
      )
    );
  }

  const doneToday = tasks.filter((t) => t.completed).length;
  const topStreak = tasks.reduce((max, t) => Math.max(max, t.streak || 0), 0);

  // Use backend streak if available, otherwise derive from tasks
  const displayStreak = profile?.streak ?? topStreak;

  function addTask() {
    const id = `d-${Date.now()}`;
    setTasks((prev) => [
      {
        id,
        type: "daily",
        title: "New task",
        description: "Edit me later (API-backed soon)",
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
            <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto]">
              <XpBar xp={xp} />
              <div className="flex gap-2">
                <div className="rounded-xl border-2 border-[#dbb96a] bg-[#fdf6e3] px-4 py-2.5 text-center">
                  <p className="text-xl font-extrabold leading-none text-[#653d15]">
                    {profileLoading ? "—" : displayStreak}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#9a6530]">Streak</p>
                  <StreakIcon className="mx-auto mt-2 h-5 w-5 text-[#9a6530]" />
                </div>
                <div className="rounded-xl border-2 border-[#dbb96a] bg-[#fdf6e3] px-4 py-2.5 text-center">
                  <p className="text-xl font-extrabold leading-none text-[#653d15]">
                    {profileLoading ? "—" : xp}
                  </p>
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
          </DashboardLayout>
        </div>
      </div>
      <Footer />
    </div>
  );
}