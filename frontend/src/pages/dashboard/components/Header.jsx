import React from "react";

export default function Header({
  query,
  onQueryChange,
  onOpenFilters,
  onAddTask,
  xp = 0,
  level = 1,
  streak = 0,
}) {
  return (
    <header className="border-b-2 border-[#dbb96a] bg-[#f0ddb8]">
      <div className="mx-auto flex max-w-7xl items-center gap-2.5 px-5 py-4 md:px-7">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border-2 border-[#dbb96a] bg-[#f0ddb8] px-4 py-2 transition focus-within:border-[#e9a319] focus-within:bg-[#fdf6e3]">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4 flex-none text-[#b08040]"
            fill="none"
          >
            <path
              d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <path
              d="M16.5 16.5 21 21"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            value={query}
            onChange={(e) => onQueryChange?.(e.target.value)}
            placeholder="Search tasks…"
            className="w-full min-w-0 bg-transparent text-sm font-medium text-[#653d15] placeholder:text-[#b08040] focus:outline-none"
          />
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <div className="rounded-xl border-2 border-[#dbb96a] bg-[#fdf6e3] px-3 py-1.5 text-center">
            <p className="text-sm font-extrabold leading-none text-[#653d15]">{level}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#9a6530]">Level</p>
          </div>
          <div className="rounded-xl border-2 border-[#dbb96a] bg-[#fdf6e3] px-3 py-1.5 text-center">
            <p className="text-sm font-extrabold leading-none text-[#653d15]">{xp}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#9a6530]">XP</p>
          </div>
          <div className="rounded-xl border-2 border-[#dbb96a] bg-[#fdf6e3] px-3 py-1.5 text-center">
            <p className="text-sm font-extrabold leading-none text-[#653d15]">{streak}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#9a6530]">Streak</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenFilters}
          className="hidden items-center gap-2 rounded-full border-2 border-[#dbb96a] bg-[#fdf6e3] px-3 py-2 text-sm font-semibold text-[#7a4d1a] hover:bg-[#f5e9cc] md:inline-flex"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4 text-[#9a6530]"
            fill="none"
          >
            <path
              d="M4 6h16M7 12h10M10 18h4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Tags / Filters
        </button>

        <button
          type="button"
          onClick={onAddTask}
          className="inline-flex items-center justify-center rounded-full bg-[#653d15] px-5 py-2.5 text-sm font-bold text-[#fdf6e3] transition hover:bg-[#4a2c0e]"
        >
          Add Task
        </button>
      </div>
    </header>
  );
}
