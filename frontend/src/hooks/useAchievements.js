import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

/**
 * Fetches the logged-in user's achievements from GET /achievements.
 *
 * Returns:
 *   achievements — array of achievement objects from the backend
 *   loading      — true while the request is in flight
 *   error        — error message string or null
 *   refetch      — call this to manually re-fetch
 *   addAchievement — function to create a new achievement
 *   deleteAchievement — function to delete an achievement
 */
export function useAchievements() {
  const { getToken } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchAchievements() {
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();
        const response = await fetch(`${API_BASE}/achievements`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load achievements (${response.status})`);
        }

        const data = await response.json();

        if (!cancelled) {
          setAchievements(data ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load achievements");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchAchievements();

    return () => {
      cancelled = true;
    };
  }, [getToken, tick]);

  async function addAchievement(name, description, xpThreshold, streakThreshold) {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE}/achievements`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          xpThreshold,
          streakThreshold,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create achievement (${response.status})`);
      }

      const newAchievement = await response.json();
      setAchievements((prev) => [...prev, newAchievement]);
      return newAchievement;
    } catch (err) {
      setError(err.message || "Failed to create achievement");
      throw err;
    }
  }

  async function deleteAchievement(achievementId) {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE}/achievements/${achievementId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete achievement (${response.status})`);
      }

      setAchievements((prev) => prev.filter((a) => a.id !== achievementId));
    } catch (err) {
      setError(err.message || "Failed to delete achievement");
      throw err;
    }
  }

  function refetch() {
    setTick((n) => n + 1);
  }

  return { achievements, loading, error, refetch, addAchievement, deleteAchievement };
}
