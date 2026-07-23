"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabase';

// Define the shape of our profile data based on your Supabase table
interface Profile {
    id: string;
    first_name: string;
    last_name: string;
    suite_number: string;
    phone: string | null;
    preferred_branch: string | null;
}

export default function CustomerDirectory() {
    const [customers, setCustomers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function fetchCustomers() {
            // Fetch all profiles from the database
            const { data, error } = await supabase
                .from('profiles')
                .select('id, first_name, last_name, suite_number, phone, preferred_branch')
                .order('first_name', { ascending: true });

            if (error) {
                console.error("Error fetching customers:", error);
            } else if (data) {
                setCustomers(data);
            }
            setLoading(false);
        }

        fetchCustomers();
    }, []);

    // Filter logic for the search bar
    const filteredCustomers = customers.filter((customer) => {
        const fullName = `${customer.first_name} ${customer.last_name}`.toLowerCase();
        const suite = (customer.suite_number || '').toLowerCase();
        const query = searchQuery.toLowerCase();

        return fullName.includes(query) || suite.includes(query);
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Customer Directory</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage and view registered logistics users.</p>
                </div>

                <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or Suite ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all"
                    />
                </div>
            </div>

            {/* Data Table Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                <th className="px-6 py-4">Suite ID</th>
                                <th className="px-6 py-4">Customer Name</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Branch</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                // Loading Skeleton
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
                                            Loading directory...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                // Empty State
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        <p>No customers found.</p>
                                    </td>
                                </tr>
                            ) : (
                                // Data Rows
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap font-mono font-medium text-emerald-600">
                                            {customer.suite_number || 'PENDING'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                                            {customer.first_name} {customer.last_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm">
                                            {customer.phone || '—'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm">
                                            {customer.preferred_branch || 'Unassigned'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer info */}
                {!loading && filteredCustomers.length > 0 && (
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
                        Showing {filteredCustomers.length} registered {filteredCustomers.length === 1 ? 'user' : 'users'}.
                    </div>
                )}
            </div>
        </div>
    );
}