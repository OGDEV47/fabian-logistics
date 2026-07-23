"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";

export default function OpsGateway() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  // The Invisible Gateway: Check if they are already logged in
  useEffect(() => {
    const verifyActiveSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Valid token found -> instantly teleport to dashboard
        router.push("/dashboard");
      } else {
        // No valid token -> reveal the login screen
        setCheckingSession(false);
      }
    };
    verifyActiveSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid staff credentials. Access denied.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  // Show a blank dark screen while checking the session to prevent UI flashing
  if (checkingSession) {
    return <div className="min-h-screen bg-slate-900"></div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Styling for the Gateway */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-emerald-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute top-[60%] right-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 rounded-2xl border border-slate-700 mb-5 shadow-inner">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">Ops Command</h1>
          <p className="text-sm text-emerald-500/80 font-mono mt-2 tracking-widest uppercase">System Gateway</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 text-red-400 rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Authorized Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono text-sm"
              placeholder="admin@demologistics.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Secure Passcode
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold tracking-widest rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed uppercase"
          >
            {loading ? "Authenticating..." : "Initialize Session"}
          </button>
        </form>
      </div>
    </div>
  );
}