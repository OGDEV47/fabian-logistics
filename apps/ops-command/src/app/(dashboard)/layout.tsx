"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";

export default function OpsLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [staffEmail, setStaffEmail] = useState<string | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
            } else {
                setStaffEmail(session.user.email ?? null);
            }
        };
        checkSession();
    }, [router]);

    return (
        <div className="flex h-screen w-full bg-slate-50 text-slate-900">
            {/* Sidebar: Operations Command */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <span className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        OPS COMMAND
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">Logistics</p>
                    <a href="/manifests" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-all text-sm font-medium">
                        Manifests
                    </a>
                    <a href="/warehouse" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-all text-sm font-medium">
                        Warehouse Inflow
                    </a>

                    <div className="pt-4">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">Management</p>
                        <a href="/customers" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-all text-sm font-medium">
                            Customer Directory
                        </a>
                        <a href="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-all text-sm font-medium">
                            System Config
                        </a>
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700">
                        <p className="text-xs text-slate-500 truncate">{staffEmail}</p>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase">System Admin</p>
                    </div>
                </div>
            </aside>

            {/* Main Admin Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
                    <h2 className="font-semibold text-slate-800 text-sm italic">"Precision in every parcel"</h2>
                    <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors">
                        SECURE LOGOUT
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}