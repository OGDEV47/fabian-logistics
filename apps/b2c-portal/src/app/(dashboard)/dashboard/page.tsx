"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('Customer');

  // Stats State
  const [readyCount, setReadyCount] = useState(0);
  const [transitCount, setTransitCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // 1. Get the current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Try to get a clean name from the email (e.g., "john.doe@email.com" -> "John")
      const emailName = session.user.email?.split('@')[0].split('.')[0] || 'Customer';
      const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
      setUserName(capitalizedName);

      // 2. Fetch ALL of their packages to calculate stats
      const { data, error } = await supabase
        .from('pre_alerts')
        .select('status')
        .eq('user_id', session.user.id);

      if (!error && data) {
        // Tally up the statuses
        const ready = data.filter(pkg => pkg.status === 'Ready for Pickup').length;
        const transit = data.filter(pkg => pkg.status === 'In Transit').length;
        const pending = data.filter(pkg => pkg.status === 'Pending' || pkg.status === 'Received at Origin').length;

        setReadyCount(ready);
        setTransitCount(transit);
        setPendingCount(pending);
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {userName}</h1>
        <p className="text-slate-500 mt-2">Here is what's happening with your packages today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ready for Pickup Card */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 z-0"></div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-emerald-600 mb-1 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Ready for Pickup
            </p>
            <h2 className="text-4xl font-bold text-slate-900">
              {loading ? <span className="animate-pulse text-slate-200">...</span> : readyCount}
            </h2>
          </div>
        </div>

        {/* In Transit / Pending Card */}
        <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-[0_4px_20px_-4px_rgba(37,99,235,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 z-0"></div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-blue-600 mb-1 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              In Transit & Pending
            </p>
            <h2 className="text-4xl font-bold text-slate-900">
              {loading ? <span className="animate-pulse text-slate-200">...</span> : (transitCount + pendingCount)}
            </h2>
          </div>
        </div>

        {/* Account Balance Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-16 -mt-16 z-0"></div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              Account Balance
            </p>
            <h2 className="text-4xl font-bold text-slate-900">$0.00</h2>
          </div>
        </div>
      </div>

      {/* Quick Actions / Getting Started */}
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 mt-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/pre-alerts" className="flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Add Pre-Alert</h4>
              <p className="text-sm text-slate-500">Notify us of an incoming package</p>
            </div>
          </a>
          <a href="/calculator" className="flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Estimate Costs</h4>
              <p className="text-sm text-slate-500">Calculate freight and duty fees</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}