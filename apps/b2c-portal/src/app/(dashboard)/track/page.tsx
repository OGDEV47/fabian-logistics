"use client";

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';

// Define the logical flow of our package statuses
const STATUS_STEPS = [
    'Pending',
    'Received at Origin',
    'In Transit',
    'Ready for Pickup',
    'Delivered'
];

export default function TrackPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [packageData, setPackageData] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError(null);
        setHasSearched(true);
        setPackageData(null);

        // Query the database for this specific tracking number
        const { data, error } = await supabase
            .from('pre_alerts')
            .select('*')
            .eq('tracking_number', searchQuery.trim())
            .single(); // We only expect one package per tracking number

        if (error) {
            if (error.code === 'PGRST116') {
                // PGRST116 is Supabase's specific error code for "Row not found"
                setError("We couldn't find a package with that tracking number. Please check and try again.");
            } else {
                setError("An error occurred while fetching tracking details.");
            }
        } else {
            setPackageData(data);
        }

        setLoading(false);
    };

    // Helper function to determine timeline colors
    const getStepStatus = (stepIndex: number, currentStatus: string) => {
        const currentIndex = STATUS_STEPS.indexOf(currentStatus || 'Pending');
        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'current';
        return 'upcoming';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header & Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Track Package</h1>
                <p className="text-slate-500 mb-8">Enter your tracking number to see real-time updates on your shipment.</p>

                <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="e.g. TBA123456789"
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
                    >
                        {loading ? 'Searching...' : 'Track'}
                    </button>
                </form>
            </div>

            {/* Results Area */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-start gap-4">
                    <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <div>
                        <h3 className="font-semibold">Package Not Found</h3>
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                    </div>
                </div>
            )}

            {packageData && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Package Summary Header */}
                    <div className="bg-slate-50 border-b border-slate-200 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Tracking Number</p>
                            <h2 className="text-2xl font-bold text-slate-900">{packageData.tracking_number}</h2>
                        </div>
                        <div className="flex gap-6">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Courier</p>
                                <p className="font-semibold text-slate-900">{packageData.courier}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Weight</p>
                                <p className="font-semibold text-slate-900">{packageData.expected_weight} lbs</p>
                            </div>
                        </div>
                    </div>

                    {/* Visual Timeline */}
                    <div className="p-8 md:p-12">
                        <div className="relative">
                            {/* The connecting line */}
                            <div className="absolute top-5 left-8 right-8 h-1 bg-slate-100 hidden md:block"></div>

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                                {STATUS_STEPS.map((step, index) => {
                                    const state = getStepStatus(index, packageData.status);

                                    return (
                                        <div key={step} className="flex md:flex-col items-center gap-4 md:gap-3 text-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors duration-300 z-10 bg-white
                        ${state === 'completed' ? 'border-blue-600 bg-blue-600 text-white' :
                                                    state === 'current' ? 'border-blue-600 text-blue-600 ring-4 ring-blue-50' :
                                                        'border-slate-200 text-slate-300'}`}
                                            >
                                                {state === 'completed' ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                ) : (
                                                    index + 1
                                                )}
                                            </div>
                                            <div>
                                                <p className={`font-semibold ${state === 'upcoming' ? 'text-slate-400' : 'text-slate-900'}`}>
                                                    {step}
                                                </p>
                                                {state === 'current' && (
                                                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wider mt-1">Current Status</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
