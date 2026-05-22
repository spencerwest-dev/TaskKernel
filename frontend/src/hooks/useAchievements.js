import { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

export function useAchievements() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  useEffect(() => {
    let cancelled = false;

    async function fetchAchievements() {
      if (!isLoaded || !isSignedIn) {
        setAchievements([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const token = await getTokenRef.current();
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
  }, [isLoaded, isSignedIn, tick]);

  function refetch() {
    setTick((n) => n + 1);
  }

  return { achievements, loading, error, refetch };
}
