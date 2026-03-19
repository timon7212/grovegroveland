"use client";

import { useState, useEffect, useCallback } from "react";

interface Applicant {
  id: number;
  email: string;
  twitter_handle: string | null;
  telegram_handle: string | null;
  source: string | null;
  status: string;
  referral_code: string | null;
  referred_by_code: string | null;
  admin_notes: string;
  created_at: string;
  confirmed_at: string | null;
  email_sent_at: string | null;
}

interface Stats {
  total: number;
  new: number;
  confirmed: number;
  rejected: number;
  today_applied: number;
  referral_sources: Record<string, number>;
}

const TOKEN_KEY = "gg_admin_token";

function formatDate(iso: string) {
  const d = new Date(iso + "Z");
  const now = Date.now();
  const diff = now - d.getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return d.toLocaleDateString();
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: "bg-gray-100 text-gray-600",
    confirmed: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-600",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [inputToken, setInputToken] = useState("");
  const [loginError, setLoginError] = useState("");

  const [stats, setStats] = useState<Stats | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const headers = useCallback(() => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" }), [token]);

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved) { setToken(saved); setAuthed(true); }
  }, []);

  const login = async () => {
    setLoginError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: inputToken }),
    });
    if (res.ok) {
      setToken(inputToken);
      setAuthed(true);
      localStorage.setItem(TOKEN_KEY, inputToken);
    } else {
      setLoginError("Invalid token");
    }
  };

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/admin/stats", { headers: headers() });
    if (res.ok) setStats(await res.json());
    else if (res.status === 401) { setAuthed(false); localStorage.removeItem(TOKEN_KEY); }
  }, [headers]);

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: page.toString(), limit: "30" });
    if (filter) params.set("status", filter);
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/applicants?${params}`, { headers: headers() });
    if (res.ok) {
      const data = await res.json();
      setApplicants(data.applicants);
      setTotal(data.total);
      setPages(data.pages);
    } else if (res.status === 401) { setAuthed(false); localStorage.removeItem(TOKEN_KEY); }
    setLoading(false);
  }, [headers, page, filter, search]);

  useEffect(() => {
    if (authed) { fetchStats(); fetchApplicants(); }
  }, [authed, fetchStats, fetchApplicants]);

  const updateStatus = async (id: number, status: string) => {
    setActionLoading(id);
    await fetch(`/api/admin/applicants/${id}`, { method: "PATCH", headers: headers(), body: JSON.stringify({ status }) });
    await fetchApplicants();
    await fetchStats();
    setActionLoading(null);
  };

  const resendEmail = async (id: number) => {
    setActionLoading(id);
    await fetch(`/api/admin/applicants/${id}/send-email`, { method: "POST", headers: headers() });
    setActionLoading(null);
    alert("Email resent");
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthed(false);
    setToken("");
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-full bg-green-500" />
            <span className="font-semibold text-gray-900">grovegrove admin</span>
          </div>
          <input
            type="password"
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Enter admin token"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-green-400 mb-3"
          />
          {loginError && <p className="text-red-500 text-xs mb-3">{loginError}</p>}
          <button onClick={login} className="w-full py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-green-500" />
            <span className="font-semibold text-gray-900 text-sm">grovegrove admin</span>
          </div>
          <div className="flex items-center gap-4">
            {stats && (
              <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500">
                <span>Total: <strong className="text-gray-900">{stats.total}</strong></span>
                <span>New: <strong className="text-gray-900">{stats.new}</strong></span>
                <span>Confirmed: <strong className="text-green-600">{stats.confirmed}</strong></span>
                <span>Rejected: <strong className="text-red-500">{stats.rejected}</strong></span>
                <span>Today: <strong className="text-gray-900">{stats.today_applied}</strong></span>
              </div>
            )}
            <button onClick={logout} className="text-xs text-gray-400 hover:text-gray-600">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex gap-1 bg-white rounded-lg border p-0.5">
            {[{ val: "", label: "All" }, { val: "new", label: "New" }, { val: "confirmed", label: "Confirmed" }, { val: "rejected", label: "Rejected" }].map((f) => (
              <button
                key={f.val}
                onClick={() => { setFilter(f.val); setPage(1); }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === f.val ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-700"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search email or twitter..."
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-green-400 w-64"
          />
          <span className="text-xs text-gray-400 ml-auto">{total} results</span>
        </div>

        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/50">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">#</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Email</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Twitter</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Telegram</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Source</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Ref code</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Referred by</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Applied</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={10} className="py-12 text-center text-gray-400">Loading...</td></tr>
                ) : applicants.length === 0 ? (
                  <tr><td colSpan={10} className="py-12 text-center text-gray-400">No applicants found</td></tr>
                ) : (
                  applicants.map((a) => (
                    <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50/50">
                      <td className="px-4 py-2.5 text-gray-400 font-mono text-xs">{a.id}</td>
                      <td className="px-4 py-2.5 font-medium text-gray-900">{a.email}</td>
                      <td className="px-4 py-2.5 text-gray-500">{a.twitter_handle || "—"}</td>
                      <td className="px-4 py-2.5 text-gray-500">{a.telegram_handle || "—"}</td>
                      <td className="px-4 py-2.5 text-gray-500">{a.source || "—"}</td>
                      <td className="px-4 py-2.5"><StatusBadge status={a.status} /></td>
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{a.referral_code || "—"}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{a.referred_by_code || "—"}</td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">{formatDate(a.created_at)}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          {a.status === "new" && (
                            <>
                              <button
                                onClick={() => updateStatus(a.id, "confirmed")}
                                disabled={actionLoading === a.id}
                                className="px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => updateStatus(a.id, "rejected")}
                                disabled={actionLoading === a.id}
                                className="px-2.5 py-1 rounded-md bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {a.status === "confirmed" && (
                            <button
                              onClick={() => resendEmail(a.id)}
                              disabled={actionLoading === a.id}
                              className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                              Resend email
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border text-xs disabled:opacity-30 hover:bg-gray-50"
            >
              Prev
            </button>
            <span className="text-xs text-gray-500">Page {page} of {pages}</span>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="px-3 py-1.5 rounded-lg border text-xs disabled:opacity-30 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
