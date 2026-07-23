"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";

export default function OpsLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
            // Successfully authenticated -> route to the command center
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-900 rounded-xl border border-slate-700 mb-4 shadow-inner">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">OPS COMMAND</h1>
                    <p className="text-sm text-slate-400 mt-2">Authorized Personnel Only</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 text-red-400 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Staff Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            placeholder="admin@demologistics.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Passcode
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Authenticating..." : "SECURE LOGIN"}
                    </button>
                </form>
            </div>
        </div>
    );
}