"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);

  // User & Profile Data
  const [profile, setProfile] = useState<any>(null);

  // Stats & Table Data
  const [readyItems, setReadyItems] = useState<any[]>([]);
  const [transitCount, setTransitCount] = useState(0);
  const [totalShipped, setTotalShipped] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // 1. Fetch User Profile (for the Shipping Address)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setProfile(profileData);

      // 2. Fetch ALL packages
      const { data: packages, error } = await supabase
        .from('pre_alerts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (!error && packages) {
        const ready = packages.filter(pkg => pkg.status === 'Ready for Pickup');
        const transit = packages.filter(pkg => pkg.status === 'In Transit');

        setReadyItems(ready);
        setTransitCount(transit.length);
        setTotalShipped(packages.length);
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {profile?.first_name || 'Customer'}
        </h1>
        <p className="text-slate-500 mt-2">Here is your account overview and recent shipment activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm relative overflow-hidden">
          <p className="text-sm font-medium text-emerald-600 mb-1">Ready for Pickup</p>
          <h2 className="text-3xl font-bold text-slate-900">{loading ? '...' : readyItems.length}</h2>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm relative overflow-hidden">
          <p className="text-sm font-medium text-blue-600 mb-1">In Transit</p>
          <h2 className="text-3xl font-bold text-slate-900">{loading ? '...' : transitCount}</h2>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Shipped</p>
          <h2 className="text-3xl font-bold text-slate-900">{loading ? '...' : totalShipped}</h2>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <p className="text-sm font-medium text-slate-500 mb-1">Account Balance</p>
          <h2 className="text-3xl font-bold text-slate-900">$0.00</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Tables & Quick Actions */}
        <div className="lg:col-span-2 space-y-8">

          {/* Ready for Pickup Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Ready for Pickup</h3>
              <Link href="/pre-alerts" className="text-sm text-blue-600 font-medium hover:underline">View All</Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Item/Tracking</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Sender</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Total Val.</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
                  ) : readyItems.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No items ready for pickup</td></tr>
                  ) : (
                    readyItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{item.tracking_number}</td>
                        <td className="px-6 py-4 text-slate-600">{item.courier}</td>
                        <td className="px-6 py-4 text-slate-600">${Number(item.expected_value).toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Pay & Release</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions Returned! */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/pre-alerts" className="flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Add Pre-Alert</h4>
                  <p className="text-sm text-slate-500">Notify us of an incoming package</p>
                </div>
              </Link>
              <Link href="/calculator" className="flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all group">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Estimate Costs</h4>
                  <p className="text-sm text-slate-500">Calculate freight and duty fees</p>
                </div>
              </Link>
            </div>
          </div>

        </div>

        {/* Right Column: Address (Light Theme) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Your US Shipping Address</h3>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
            ) : (
              <div className="space-y-4 font-mono text-sm bg-slate-50 p-5 rounded-xl border border-slate-100 text-slate-900">
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-1 font-sans">Name</p>
                  <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-1 font-sans">Address Line 1</p>
                  <p className="font-medium">8400 NW 25th St</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-1 font-sans">Address Line 2 (Suite)</p>
                  <p className="font-medium text-blue-600">{profile?.suite_number}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1 font-sans">City</p>
                    <p className="font-medium">Miami</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1 font-sans">State</p>
                    <p className="font-medium">FL</p>
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-1 font-sans">Zip Code</p>
                  <p className="font-medium">33122</p>
                </div>
              </div>
            )}

            <button className="w-full mt-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
              Copy Address
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}