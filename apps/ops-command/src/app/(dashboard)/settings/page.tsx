"use client";

import React, { useState } from 'react';

export default function SystemConfigPage() {
    // Configuration State
    const [suitePrefix, setSuitePrefix] = useState('MD');
    const [nextSuiteNumber, setNextSuiteNumber] = useState('10205');
    const [autoVerifyEmails, setAutoVerifyEmails] = useState(false);
    const [defaultWeightUnit, setDefaultWeightUnit] = useState('LBS');

    const [isSaving, setIsSaving] = useState(false);

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Simulate an API call to a future 'system_settings' table
        await new Promise(resolve => setTimeout(resolve, 800));

        setIsSaving(false);
        // In a real app, we might use a nice toast notification here instead of an alert
        alert("System configuration updated successfully.");
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">System Configuration</h1>
                <p className="text-slate-500 text-sm mt-1">Manage global routing rules, ID generation, and platform defaults.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">

                {/* Section 1: Customer ID Generation */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                            Suite ID Generation Rules
                        </h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Global Prefix</label>
                            <p className="text-xs text-slate-400 mb-3">The alphabetical code prepended to new users.</p>
                            <input
                                type="text"
                                value={suitePrefix}
                                onChange={(e) => setSuitePrefix(e.target.value.toUpperCase())}
                                maxLength={4}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Next Available Sequence</label>
                            <p className="text-xs text-slate-400 mb-3">The numeric sequence for the next signup.</p>
                            <input
                                type="number"
                                value={nextSuiteNumber}
                                onChange={(e) => setNextSuiteNumber(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div className="md:col-span-2 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3">
                            <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-sm text-indigo-800">
                                The next customer to sign up will be assigned: <strong className="font-mono bg-indigo-100 px-2 py-0.5 rounded text-indigo-900">{suitePrefix}{nextSuiteNumber}</strong>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Operational Defaults */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Warehouse & Security Defaults
                        </h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Toggle Switch: Auto Verify */}
                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setAutoVerifyEmails(!autoVerifyEmails)}>
                            <div>
                                <p className="font-semibold text-slate-800 text-sm">Auto-Verify Customer Emails</p>
                                <p className="text-xs text-slate-500 mt-1">Allow customers to log in without clicking an email link.</p>
                            </div>
                            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoVerifyEmails ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoVerifyEmails ? 'translate-x-6' : 'translate-x-1'}`} />
                            </div>
                        </div>

                        {/* Select: Default Weight */}
                        <div className="p-4 border border-slate-200 rounded-xl">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Default Warehouse Weight Unit</label>
                            <select
                                value={defaultWeightUnit}
                                onChange={(e) => setDefaultWeightUnit(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                            >
                                <option value="LBS">Pounds (LBS)</option>
                                <option value="KG">Kilograms (KG)</option>
                            </select>
                        </div>

                    </div>
                </div>

                {/* Action Footer */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold tracking-wide hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                SAVING...
                            </>
                        ) : (
                            'SAVE CONFIGURATION'
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
}