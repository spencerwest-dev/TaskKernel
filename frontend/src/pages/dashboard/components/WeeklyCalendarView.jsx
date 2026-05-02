import { useMemo, useState } from "react";

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function sameDay(a, b) {
  return a.toDateString() === b.toDateString();
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function WeeklyCalendarView({ tasks = [] }) {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const completedTasks = tasks
  .filter((task) => task.completed && task.completedAt)
  .map((task) => ({
    ...task,
    completedDate: new Date(task.completedAt),
  }));

  return (
    <div className="mt-6 rounded-xl bg-white p-5 shadow">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Weekly Completion History</h2>
          <p className="text-sm text-gray-500">
            View completed tasks by week.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekStart(addDays(weekStart, -7))}
            className="rounded-lg border px-3 py-2 text-sm font-semibold"
          >
            Previous
          </button>

          <p className="text-sm font-semibold">
            {formatDate(weekStart)} - {formatDate(addDays(weekStart, 6))}
          </p>

          <button
            onClick={() => setWeekStart(addDays(weekStart, 7))}
            className="rounded-lg border px-3 py-2 text-sm font-semibold"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
        {days.map((day) => {
          const dayTasks = completedTasks.filter((task) =>
            sameDay(task.completedDate, day)
          );

          return (
            <div key={day.toISOString()} className="min-h-[130px] rounded-lg border p-3">
              <h3 className="mb-2 font-semibold">
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </h3>
              <p className="mb-2 text-xs text-gray-400">{formatDate(day)}</p>

              {dayTasks.length === 0 ? (
                <p className="text-sm text-gray-400">No completions</p>
              ) : (
                <div className="space-y-2">
                  {dayTasks.map((task) => (
                    <div key={task.id} className="rounded-md bg-gray-50 p-2 text-sm">
                      {task.title || task.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}