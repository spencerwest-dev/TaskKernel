import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

/**
 * Fetches the logged-in user's tasks from GET /tasks.
 * Also returns the user profile (xp, level, streak) from the same response.
 *
 * Returns:
 *   tasks    — array of task objects from the backend
 *   profile  — { xp, level, streak } from the user field in the response
 *   loading  — true while the request is in flight
 *   error    — error message string or null
 *   refetch  — call this to manually re-fetch
 */
export function useTasks() {
  const { getToken } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchTasks() {
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();
        const response = await fetch(`${API_BASE}/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load tasks (${response.status})`);
        }

        const data = await response.json();

        if (!cancelled) {
          // Backend returns { tasks: [...], user: { xp, level, streak } }
          setTasks(data.tasks ?? []);
          setProfile(data.user ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load tasks");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchTasks();

    return () => {
      cancelled = true;
    };
  }, [getToken, tick]);

  function refetch() {
    setTick((n) => n + 1);
  }

  return { tasks, profile, loading, error, refetch };
}