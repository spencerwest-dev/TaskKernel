// TaskDashboard Filtering Unit Tests
// To run ONLY these tests:
//   npm test -- --watchAll=false --testPathPattern=TaskDashboard.filtering
//
// These test the two pure filter helpers from TaskDashboard.jsx:
//   matchesTab(task, tab)  — drives the All / Weak / Strong / Completed tabs
//   matchesQuery(task, q)  — drives the search bar
//
// No rendering needed — these are plain logic tests with no React imports.
//
// If you ever extract the helpers to a shared utils file, replace the inline
// copies below with a single import and the tests will still pass unchanged.

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
    String(task.title || "")
      .toLowerCase()
      .includes(q) ||
    String(task.description || "")
      .toLowerCase()
      .includes(q)
  );
}

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const TASKS = {
  strongActive: {
    id: "s-active",
    title: "Drink water",
    description: "8 cups minimum",
    strength: "strong",
    completed: false,
  },
  weakActive: {
    id: "w-active",
    title: "20 min study",
    description: "One Pomodoro session",
    strength: "weak",
    completed: false,
  },
  strongCompleted: {
    id: "s-done",
    title: "Stretch routine",
    description: "Neck, shoulders, hips",
    strength: "strong",
    completed: true,
  },
  weakCompleted: {
    id: "w-done",
    title: "Inbox zero",
    description: "Email sweep",
    strength: "weak",
    completed: true,
  },
};

const ALL_TASKS = Object.values(TASKS);

// ─── matchesTab ───────────────────────────────────────────────────────────────

describe("matchesTab", () => {
  describe('tab = "All"', () => {
    it("passes every task regardless of strength or completion", () => {
      ALL_TASKS.forEach((task) => {
        expect(matchesTab(task, "All")).toBe(true);
      });
    });

    it("treats null / undefined tab as 'All'", () => {
      ALL_TASKS.forEach((task) => {
        expect(matchesTab(task, null)).toBe(true);
        expect(matchesTab(task, undefined)).toBe(true);
      });
    });
  });

  describe('tab = "Completed"', () => {
    it("passes tasks that are completed", () => {
      expect(matchesTab(TASKS.strongCompleted, "Completed")).toBe(true);
      expect(matchesTab(TASKS.weakCompleted, "Completed")).toBe(true);
    });

    it("rejects tasks that are not completed", () => {
      expect(matchesTab(TASKS.strongActive, "Completed")).toBe(false);
      expect(matchesTab(TASKS.weakActive, "Completed")).toBe(false);
    });
  });

  describe('tab = "Weak"', () => {
    it("passes weak tasks that are not yet completed", () => {
      expect(matchesTab(TASKS.weakActive, "Weak")).toBe(true);
    });

    it("rejects strong tasks", () => {
      expect(matchesTab(TASKS.strongActive, "Weak")).toBe(false);
    });

    it("rejects weak tasks that are already completed", () => {
      expect(matchesTab(TASKS.weakCompleted, "Weak")).toBe(false);
    });
  });

  describe('tab = "Strong"', () => {
    it("passes strong tasks that are not yet completed", () => {
      expect(matchesTab(TASKS.strongActive, "Strong")).toBe(true);
    });

    it("rejects weak tasks", () => {
      expect(matchesTab(TASKS.weakActive, "Strong")).toBe(false);
    });

    it("rejects strong tasks that are already completed", () => {
      expect(matchesTab(TASKS.strongCompleted, "Strong")).toBe(false);
    });
  });

  describe("unknown tab", () => {
    it("falls through to true (shows all) for unrecognised tab values", () => {
      ALL_TASKS.forEach((task) => {
        expect(matchesTab(task, "SomeUnknownTab")).toBe(true);
      });
    });
  });
});

// ─── matchesQuery ─────────────────────────────────────────────────────────────

describe("matchesQuery", () => {
  const task = {
    title: "Drink Water",
    description: "Stay hydrated throughout the day",
  };

  it("returns true for an empty query", () => {
    expect(matchesQuery(task, "")).toBe(true);
    expect(matchesQuery(task, "   ")).toBe(true);
    expect(matchesQuery(task, null)).toBe(true);
    expect(matchesQuery(task, undefined)).toBe(true);
  });

  it("matches a substring of the title (case-insensitive)", () => {
    expect(matchesQuery(task, "drink")).toBe(true);
    expect(matchesQuery(task, "WATER")).toBe(true);
    expect(matchesQuery(task, "Drink Water")).toBe(true);
  });

  it("matches a substring of the description (case-insensitive)", () => {
    expect(matchesQuery(task, "hydrated")).toBe(true);
    expect(matchesQuery(task, "THROUGHOUT")).toBe(true);
  });

  it("returns false when neither title nor description matches", () => {
    expect(matchesQuery(task, "exercise")).toBe(false);
    expect(matchesQuery(task, "zzz")).toBe(false);
  });

  it("handles tasks with missing title or description gracefully", () => {
    expect(matchesQuery({ title: null, description: null }, "water")).toBe(
      false,
    );
    expect(matchesQuery({ title: undefined, description: undefined }, "")).toBe(
      true,
    );
    expect(matchesQuery({}, "test")).toBe(false);
  });
});

// ─── Combined filter pipeline (tab + query) ───────────────────────────────────

describe("combined tab + query filtering", () => {
  // Mirrors the useMemo chain in TaskDashboard: matchesQuery first, then matchesTab
  function applyFilters(tasks, query, tab) {
    return tasks
      .filter((t) => matchesQuery(t, query))
      .filter((t) => matchesTab(t, tab));
  }

  it("'All' tab with empty query returns every task", () => {
    const result = applyFilters(ALL_TASKS, "", "All");
    expect(result).toHaveLength(ALL_TASKS.length);
  });

  it("'Completed' tab with empty query returns only completed tasks", () => {
    const result = applyFilters(ALL_TASKS, "", "Completed");
    expect(result.every((t) => t.completed)).toBe(true);
    expect(result).toHaveLength(2); // strongCompleted + weakCompleted
  });

  it("'Weak' tab with empty query returns only active weak tasks", () => {
    const result = applyFilters(ALL_TASKS, "", "Weak");
    expect(result.every((t) => t.strength === "weak" && !t.completed)).toBe(
      true,
    );
    expect(result).toHaveLength(1); // weakActive only
  });

  it("'Strong' tab with empty query returns only active strong tasks", () => {
    const result = applyFilters(ALL_TASKS, "", "Strong");
    expect(result.every((t) => t.strength === "strong" && !t.completed)).toBe(
      true,
    );
    expect(result).toHaveLength(1); // strongActive only
  });

  it("search query narrows results further within a tab", () => {
    // "All" tab + query "stretch" should surface only the stretch task
    const result = applyFilters(ALL_TASKS, "stretch", "All");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("s-done");
  });

  it("returns empty array when query matches nothing", () => {
    const result = applyFilters(ALL_TASKS, "zzznomatch", "All");
    expect(result).toHaveLength(0);
  });

  it("returns empty array when tab excludes all query matches", () => {
    // "Inbox zero" is weak + completed → filtered OUT by the Weak tab
    const result = applyFilters(ALL_TASKS, "inbox", "Weak");
    expect(result).toHaveLength(0);
  });

  it("toggling a task moves it out of Weak and into Completed", () => {
    const tasks = [{ ...TASKS.weakActive }];

    // Before toggle – visible under Weak
    expect(applyFilters(tasks, "", "Weak")).toHaveLength(1);

    // Simulate toggleTask (completed: false → true)
    const toggled = tasks.map((t) =>
      t.id === TASKS.weakActive.id ? { ...t, completed: true } : t,
    );

    // After toggle – gone from Weak, present in Completed
    expect(applyFilters(toggled, "", "Weak")).toHaveLength(0);
    expect(applyFilters(toggled, "", "Completed")).toHaveLength(1);
  });
});
