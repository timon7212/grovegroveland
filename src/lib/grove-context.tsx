"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

interface WaitlistStats {
  total_spots: number;
  applied: number;
  confirmed: number;
  remaining: number;
}

interface ApplyPayload {
  email: string;
  twitter?: string;
  telegram?: string;
  source: string;
  ref?: string;
}

interface GroveState {
  position: number;
  referralCode: string;
  showSuccess: boolean;
  stats: WaitlistStats;
  loading: boolean;
}

interface GroveContextType extends GroveState {
  signup: (payload: ApplyPayload) => Promise<{ success: boolean; error?: string }>;
  closeSuccess: () => void;
  refetchStats: () => void;
}

const GroveContext = createContext<GroveContextType | null>(null);

const defaultStats: WaitlistStats = { total_spots: 500, applied: 1790, confirmed: 0, remaining: 500 };

export function GroveProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GroveState>({
    position: 0,
    referralCode: "",
    showSuccess: false,
    stats: defaultStats,
    loading: false,
  });

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/waitlist/stats");
      if (res.ok) {
        const data = await res.json();
        setState((s) => ({ ...s, stats: data }));
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30_000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const signup = useCallback(async (payload: ApplyPayload) => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const res = await fetch("/api/waitlist/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setState((s) => ({
          ...s,
          position: data.position,
          referralCode: data.referralCode || "",
          showSuccess: true,
          loading: false,
          stats: { ...s.stats, applied: s.stats.applied + 1 },
        }));
        return { success: true };
      }

      setState((s) => ({ ...s, loading: false }));
      return { success: false, error: data.error };
    } catch {
      setState((s) => ({ ...s, loading: false }));
      return { success: false, error: "network_error" };
    }
  }, []);

  const closeSuccess = useCallback(() => setState((s) => ({ ...s, showSuccess: false })), []);

  return (
    <GroveContext.Provider value={{ ...state, signup, closeSuccess, refetchStats: fetchStats }}>
      {children}
    </GroveContext.Provider>
  );
}

export function useGrove() {
  const ctx = useContext(GroveContext);
  if (!ctx) throw new Error("useGrove must be used within GroveProvider");
  return ctx;
}
