import React, { useMemo, useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import TaskColumn from "../../../components/TaskColumn";
import Navbar from "./Navbar";
import Footer from "./Footer";

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
  },
];

export default function TaskDashboard() {
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState(initialTasks);
  const [dailyTab, setDailyTab] = useState("All");
  const [weeklyTab, setWeeklyTab] = useState("All");

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
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

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
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 min-h-0">
        <div className="h-full">
          <DashboardLayout
            query={query}
            onQueryChange={setQuery}
            onOpenFilters={() => {}}
            onAddTask={addTask}
          >
            <div className="grid h-full min-h-0 grid-cols-1 gap-6 lg:grid-cols-2">
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

