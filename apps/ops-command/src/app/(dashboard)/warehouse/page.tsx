"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase';

interface ScannedPackage {
    id: string;
    tracking: string;
    suite: string;
    customer: string;
    weight: string;
    timestamp: Date;
}

export default function WarehouseInflow() {
    const [suiteId, setSuiteId] = useState('');
    const [tracking, setTracking] = useState('');
    const [weight, setWeight] = useState('');
    const [carrier, setCarrier] = useState('Amazon');

    const [customerName, setCustomerName] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [recentScans, setRecentScans] = useState<ScannedPackage[]>([]);

    useEffect(() => {
        if (suiteId.trim().length < 4) {
            setCustomerName(null);
            return;
        }

        const verifyCustomer = async () => {
            setIsVerifying(true);
            const cleanSuiteId = suiteId.trim();

            const { data, error } = await supabase
                .from('profiles')
                .select('first_name, last_name')
                .ilike('suite_number', cleanSuiteId)
                .single();

            if (data) {
                setCustomerName(`${data.first_name} ${data.last_name}`);
            } else {
                setCustomerName(null);
            }
            setIsVerifying(false);
        };

        const delayDebounceFn = setTimeout(() => {
            verifyCustomer();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [suiteId]);

    const handleLogPackage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerName) {
            alert("Cannot log package: Invalid Suite ID.");
            return;
        }

        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 600));

        const newScan: ScannedPackage = {
            id: Math.random().toString(36).substring(7),
            tracking: tracking,
            suite: suiteId.trim().toUpperCase(),
            customer: customerName,
            weight: weight,
            timestamp: new Date()
        };

        setRecentScans([newScan, ...recentScans]);
        setTracking('');
        setWeight('');
        setIsSubmitting(false);
    };

    // NEW: The "Oops" Function - Removes a scan from the current session
    const handleRemoveScan = (idToRemove: string) => {
        setRecentScans(recentScans.filter(scan => scan.id !== idToRemove));
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Warehouse Inflow</h1>
                <p className="text-slate-500 text-sm mt-1">Scan and receive incoming packages at the Miami facility.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Intake Form */}
                <div className="lg:col-span-1 space-y-6">
                    <form onSubmit={handleLogPackage} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                        <div className="border-b border-slate-100 pb-4 mb-4">
                            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                                Package Scanner
                            </h2>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Customer Suite ID</label>
                            <input type="text" required value={suiteId} onChange={(e) => setSuiteId(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-lg uppercase focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                placeholder="e.g., MD10000" />

                            <div className="mt-2 h-6 flex items-center">
                                {isVerifying && <span className="text-xs text-slate-400 flex items-center gap-2"><div className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div> Verifying...</span>}
                                {!isVerifying && customerName && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">✓ Verified: {customerName}</span>}
                                {!isVerifying && suiteId.trim().length >= 4 && !customerName && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">✕ Unregistered Suite ID</span>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Courier Tracking</label>
                            <input type="text" required value={tracking} onChange={(e) => setTracking(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                placeholder="Scan or type tracking..." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Carrier</label>
                                <select value={carrier} onChange={(e) => setCarrier(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                                    <option>Amazon</option>
                                    <option>UPS</option>
                                    <option>FedEx</option>
                                    <option>USPS</option>
                                    <option>DHL</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Weight (lbs)</label>
                                <input type="number" step="0.1" required value={weight} onChange={(e) => setWeight(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    placeholder="0.0" />
                            </div>
                        </div>

                        <button type="submit" disabled={isSubmitting || !customerName}
                            className="w-full py-3.5 mt-2 bg-slate-900 text-white rounded-xl font-bold tracking-wide hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md">
                            {isSubmitting ? 'LOGGING...' : 'LOG PACKAGE'}
                        </button>
                    </form>
                </div>

                {/* Right Column: Recent Scans Ledger */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <h2 className="font-semibold text-slate-800">Recent Session Scans</h2>
                            <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2.5 py-1 rounded-full">{recentScans.length} Packages</span>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {recentScans.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-slate-400">
                                    <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                    <p>Awaiting first scan...</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-white border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                                        <tr>
                                            <th className="px-6 py-3">Time</th>
                                            <th className="px-6 py-3">Suite ID</th>
                                            <th className="px-6 py-3">Customer</th>
                                            <th className="px-6 py-3">Tracking</th>
                                            <th className="px-6 py-3">Weight</th>
                                            <th className="px-6 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {recentScans.map((scan) => (
                                            <tr key={scan.id} className="hover:bg-slate-50 transition-colors animate-in fade-in slide-in-from-top-2 duration-300">
                                                <td className="px-6 py-3 text-slate-500">{scan.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                <td className="px-6 py-3 font-mono font-medium text-emerald-600">{scan.suite}</td>
                                                <td className="px-6 py-3 font-medium text-slate-900">{scan.customer}</td>
                                                <td className="px-6 py-3 font-mono text-slate-500 text-xs">{scan.tracking}</td>
                                                <td className="px-6 py-3 text-slate-600">{scan.weight} lbs</td>
                                                <td className="px-6 py-3 text-right">
                                                    <button
                                                        onClick={() => handleRemoveScan(scan.id)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                                        title="Remove scan"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}