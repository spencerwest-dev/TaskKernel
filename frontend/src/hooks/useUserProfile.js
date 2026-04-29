import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

/**
 * Fetches the logged-in user's profile (xp, level, streak) from GET /user/me.
 * Uses the Clerk JWT for auth — safe, no user ID in the URL.
 *
 * Returns:
 *   profile  — { id, xp, level, streak } or null while loading
 *   loading  — true while the request is in flight
 *   error    — error message string or null
 *   refetch  — call this to manually re-fetch (e.g. after completing a task)
 */
export function useUserProfile() {
  const { getToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();
        const response = await fetch(`${API_BASE}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load profile (${response.status})`);
        }

        const data = await response.json();
        if (!cancelled) {
          setProfile(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load profile");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [getToken, tick]);

  function refetch() {
    setTick((n) => n + 1);
  }

  return { profile, loading, error, refetch };
}