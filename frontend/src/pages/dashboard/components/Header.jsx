import { useState, useRef, useEffect } from "react";

const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Oldest", value: "oldest" },
  { label: "Hardest First", value: "hardest" },
  { label: "Easiest First", value: "easiest" },
];

export default function Header({
  query,
  onQueryChange,
  onOpenFilters,
  onAddTask,
  // Live stats props from TaskDashboard; refresh after each complete/un-complete API response.
  xp = 0,
  level = 1,
  streak = 0,
  sortOrder,
  onSortChange,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="border-b-2 border-[#dbb96a] bg-[#f0ddb8]">
      <div className="mx-auto flex max-w-7xl items-center gap-2.5 px-5 py-4 md:px-7">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border-2 border-[#dbb96a] bg-[#f0ddb8] px-4 py-2 transition focus-within:border-[#e9a319] focus-within:bg-[#f5e9cc]">
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

        {/* Demo note: this stats row uses lg:flex, so it is visible only on large screens. */}
        <div className="hidden items-center gap-2 lg:flex">
          {/* Level stat box: updates in real time when tasks are completed or un-completed. */}
          <div className="rounded-xl border-2 border-[#dbb96a] bg-[#f5e9cc] px-3 py-1.5 text-center">
            <p className="text-sm font-extrabold leading-none text-[#653d15]">{level}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#9a6530]">Level</p>
          </div>
          {/* XP stat box: updates in real time when tasks are completed or un-completed. */}
          <div className="rounded-xl border-2 border-[#dbb96a] bg-[#f5e9cc] px-3 py-1.5 text-center">
            <p className="text-sm font-extrabold leading-none text-[#653d15]">{xp}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#9a6530]">XP</p>
          </div>
          {/* Streak stat box: updates in real time when tasks are completed or un-completed. */}
          <div className="rounded-xl border-2 border-[#dbb96a] bg-[#f5e9cc] px-3 py-1.5 text-center">
            <p className="text-sm font-extrabold leading-none text-[#653d15]">{streak}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#9a6530]">Streak</p>
          </div>
        </div>

        <div ref={ref} className="relative hidden md:inline-flex">
          <button
            type="button"
            onClick={() => setDropdownOpen((open) => !open)}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#dbb96a] bg-[#f5e9cc] px-3 py-2 text-sm font-semibold text-[#7a4d1a] hover:bg-[#f0ddb8]"
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
            {sortOrder !== "latest" && (
              <span className="h-2 w-2 rounded-full bg-[#653d15]" />
            )}
            Tags / Filters
          </button>
          {dropdownOpen && (
            <div
              className="absolute z-50 top-full mt-1 right-0 rounded-xl border-2 border-[#dbb96a] bg-[#f5e9cc] shadow-md min-w-[160px] overflow-hidden"
            >
              {SORT_OPTIONS.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    onSortChange?.(value);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-semibold text-[#653d15] hover:bg-[#f5e9cc] ${
                    value === sortOrder ? "font-extrabold" : ""
                  }`}
                >
                  {value === sortOrder ? `✓ ${label}` : label}
                </button>
              ))}
            </div>
          )}
        </div>

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
