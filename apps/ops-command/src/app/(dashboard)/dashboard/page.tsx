"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabase';

export default function OpsDashboard() {
    const [metrics, setMetrics] = useState({
        customers: 0,
        preAlerts: 0,
        miamiPackages: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMetrics() {
            // 1. Fetch live count of registered customers
            const { count: customerCount, error: customerError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            // 2. Fetch live count of pending pre-alerts 
            // (Fails gracefully to 0 if table isn't fully set up yet)
            const { count: preAlertCount, error: preAlertError } = await supabase
                .from('pre_alerts')
                .select('*', { count: 'exact', head: true });

            // 3. Fetch live count of packages sitting in Miami
            // (Fails gracefully to 0 if table isn't fully set up yet)
            const { count: miamiCount, error: miamiError } = await supabase
                .from('packages')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'Received in Miami');

            setMetrics({
                customers: customerError ? 0 : (customerCount || 0),
                preAlerts: preAlertError ? 0 : (preAlertCount || 0),
                miamiPackages: miamiError ? 0 : (miamiCount || 0)
            });

            setLoading(false);
        }

        fetchMetrics();
    }, []);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Operations Overview</h1>
                <p className="text-slate-500 mt-1">Real-time logistics metrics and recent activity.</p>
            </div>

            {/* KPI Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Metric 1: Pre-Alerts */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pending Pre-Alerts</p>
                        <div className="flex items-center gap-3 mt-2">
                            {loading ? (
                                <div className="w-8 h-8 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
                            ) : (
                                <p className="text-3xl font-bold text-slate-900">{metrics.preAlerts}</p>
                            )}
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                </div>

                {/* Metric 2: Miami Packages */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Packages in Miami</p>
                        <div className="flex items-center gap-3 mt-2">
                            {loading ? (
                                <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
                            ) : (
                                <p className="text-3xl font-bold text-slate-900">{metrics.miamiPackages}</p>
                            )}
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                </div>

                {/* Metric 3: Active Customers */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Customers</p>
                        <div className="flex items-center gap-3 mt-2">
                            {loading ? (
                                <div className="w-8 h-8 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
                            ) : (
                                <p className="text-3xl font-bold text-slate-900">{metrics.customers}</p>
                            )}
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                </div>
            </div>

            {/* Recent Activity Table Placeholder */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="font-semibold text-slate-800">Recent System Activity</h2>
                </div>
                <div className="p-8 text-center text-slate-500">
                    <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <p>No recent activity detected.</p>
                    <p className="text-sm mt-1">Manifests and user registrations will appear here soon.</p>
                </div>
            </div>
        </div>
    );
}