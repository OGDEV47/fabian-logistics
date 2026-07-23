"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase';

interface Manifest {
    id: string;
    flight_number: string;
    destination: string;
    status: 'Building' | 'Dispatched';
    package_count: number;
    total_weight: number;
    created_at: string;
}

export default function ManifestsPage() {
    const [flightNumber, setFlightNumber] = useState('');
    const [destination, setDestination] = useState('Kingston (KIN)');

    const [manifests, setManifests] = useState<Manifest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch live manifests on load
    useEffect(() => {
        fetchManifests();
    }, []);

    const fetchManifests = async () => {
        const { data, error } = await supabase
            .from('manifests')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setManifests(data);
        if (error) console.error("Error fetching manifests:", error);
        setLoading(false);
    };

    const handleCreateManifest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newId = `MAN-${Math.floor(Math.random() * 10000)}X`;

        const { error } = await supabase.from('manifests').insert([{
            id: newId,
            flight_number: flightNumber.toUpperCase(),
            destination: destination,
            status: 'Building',
            package_count: 0,
            total_weight: 0
        }]);

        if (!error) {
            setFlightNumber('');
            fetchManifests(); // Refresh the list
        } else {
            alert("Error creating manifest.");
            console.error(error);
        }

        setIsSubmitting(false);
    };

    const handleDispatch = async (id: string) => {
        // Optimistic UI update so the button locks instantly
        setManifests(manifests.map(m =>
            m.id === id ? { ...m, status: 'Dispatched' } : m
        ));

        // Update the database
        const { error } = await supabase
            .from('manifests')
            .update({ status: 'Dispatched' })
            .eq('id', id);

        if (error) {
            alert("Failed to dispatch manifest.");
            fetchManifests(); // Revert UI if DB fails
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Flight Manifests</h1>
                <p className="text-slate-500 text-sm mt-1">Batch packages for export and manage bulk tracking updates.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Form */}
                <div className="lg:col-span-1 space-y-6">
                    <form onSubmit={handleCreateManifest} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                        <div className="border-b border-slate-100 pb-4 mb-4">
                            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Create New Manifest
                            </h2>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Flight / Voyage Number</label>
                            <input type="text" required value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl uppercase focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g., AA-704" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Destination Airport</label>
                            <select value={destination} onChange={(e) => setDestination(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                <option>Kingston (KIN)</option>
                                <option>Montego Bay (MBJ)</option>
                            </select>
                        </div>

                        <button type="submit" disabled={isSubmitting || !flightNumber}
                            className="w-full py-3.5 mt-2 bg-slate-900 text-white rounded-xl font-bold tracking-wide hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md">
                            {isSubmitting ? 'GENERATING...' : 'OPEN MANIFEST'}
                        </button>
                    </form>
                </div>

                {/* Right Column: Active Manifests Table */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <h2 className="font-semibold text-slate-800">Export Queue</h2>
                        </div>

                        <div className="flex-1 overflow-x-auto">
                            {loading ? (
                                <div className="flex justify-center items-center h-full min-h-[300px]">
                                    <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
                                </div>
                            ) : manifests.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-slate-400">
                                    <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                    <p>No active manifests.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-white border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                                        <tr>
                                            <th className="px-6 py-3">Manifest ID</th>
                                            <th className="px-6 py-3">Routing</th>
                                            <th className="px-6 py-3">Metrics</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {manifests.map((manifest) => (
                                            <tr key={manifest.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-mono font-bold text-slate-900">{manifest.id}</div>
                                                    <div className="text-xs text-slate-500">{new Date(manifest.created_at).toLocaleDateString()}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-blue-600">{manifest.flight_number}</div>
                                                    <div className="text-xs text-slate-500">{manifest.destination}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-slate-900 font-medium">{manifest.package_count} pkgs</div>
                                                    <div className="text-xs text-slate-500">{manifest.total_weight} lbs</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {manifest.status === 'Building' ? (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                                                            Building
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                                                            Dispatched
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDispatch(manifest.id)}
                                                        disabled={manifest.status === 'Dispatched'}
                                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {manifest.status === 'Building' ? 'DISPATCH' : 'LOCKED'}
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