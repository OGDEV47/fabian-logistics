"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Identity State (Read-only)
    const [userId, setUserId] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [suiteNumber, setSuiteNumber] = useState('');

    // Editable Profile State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');

    // Delivery Preferences State
    const [branch, setBranch] = useState('Kingston Branch');
    const [localAddress, setLocalAddress] = useState('');

    // Authorized Users State
    const [authorizedUsers, setAuthorizedUsers] = useState<string[]>([]);
    const [newUserName, setNewUserName] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            setUserId(session.user.id);
            setEmail(session.user.email || '');

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (data) {
                setFirstName(data.first_name || '');
                setLastName(data.last_name || '');
                setSuiteNumber(data.suite_number || '');
                setPhone(data.phone || '');
                setBranch(data.preferred_branch || 'Kingston Branch');
                setLocalAddress(data.local_address || '');
                setAuthorizedUsers(data.authorized_users || []);
            }
            setLoading(false);
        };

        fetchProfile();
    }, []);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setSaving(true);
        setMessage(null);

        const { error } = await supabase
            .from('profiles')
            .update({
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                preferred_branch: branch,
                local_address: localAddress,
                authorized_users: authorizedUsers
            })
            .eq('id', userId);

        if (error) {
            setMessage({ type: 'error', text: "Failed to update profile. Please try again." });
        } else {
            setMessage({ type: 'success', text: "Profile updated successfully!" });
            setTimeout(() => setMessage(null), 3000);
        }
        setSaving(false);
    };

    const addAuthorizedUser = (e: React.MouseEvent) => {
        e.preventDefault();
        if (newUserName.trim() && !authorizedUsers.includes(newUserName.trim())) {
            setAuthorizedUsers([...authorizedUsers, newUserName.trim()]);
            setNewUserName('');
        }
    };

    const removeAuthorizedUser = (nameToRemove: string) => {
        setAuthorizedUsers(authorizedUsers.filter(name => name !== nameToRemove));
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading profile...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
                <p className="text-slate-500 mt-2">Manage your personal information, delivery routing, and authorized pickups.</p>
            </div>

            {message && (
                <div className={`p-4 rounded-xl text-sm font-medium border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Main Forms */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Personal Information */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                        <h2 className="text-xl font-semibold text-slate-800 mb-6">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address <span className="text-slate-400 font-normal">(Read-only)</span></label>
                                <input type="email" value={email} disabled
                                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(876) 000-0000"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" />
                            </div>
                        </div>
                    </div>

                    {/* Delivery & Routing */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                        <h2 className="text-xl font-semibold text-slate-800 mb-6">Delivery & Routing</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Delivery/Pickup Location</label>
                                <select value={branch} onChange={(e) => setBranch(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900">
                                    <option value="Kingston Branch">Hold at Kingston Branch (Half-Way Tree)</option>
                                    <option value="Montego Bay Branch">Hold at Montego Bay Branch</option>
                                    <option value="Ocho Rios Branch">Hold at Ocho Rios Branch</option>
                                    <option value="Knutsford Express">Forward via Knutsford Express</option>
                                    <option value="Zipmail Delivery">Local Delivery (Zipmail)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Dedicated Location Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-slate-800">My Saved Location</h2>
                            <span className="text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-md">Primary</span>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Local Address (Jamaica)</label>
                            <textarea value={localAddress} onChange={(e) => setLocalAddress(e.target.value)} rows={3}
                                placeholder="E.g., 123 Main Street, Kingston 10, St. Andrew"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 resize-none" />
                            <p className="text-xs text-slate-500 mt-2">We will use this address if you select Zipmail or Knutsford Express routing above.</p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" disabled={saving}
                            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70">
                            {saving ? 'Saving Changes...' : 'Save Profile Changes'}
                        </button>
                    </div>
                </div>

                {/* Right Column: Security & Authorized Users */}
                <div className="lg:col-span-1 space-y-8">

                    {/* Identity Card - LIGHT THEME */}
                    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8"></div>
                        <p className="text-slate-500 text-sm font-medium mb-1 relative z-10">Account ID / Suite</p>
                        <h3 className="text-2xl font-bold font-mono text-blue-600 relative z-10">{suiteNumber}</h3>
                    </div>

                    {/* Authorized Pickups */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Authorized Pickups</h3>
                        <p className="text-sm text-slate-500 mb-6">Add names of people allowed to collect packages on your behalf. ID will be required.</p>

                        <div className="flex gap-2 mb-4">
                            <input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)}
                                placeholder="E.g., Jane Doe"
                                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900" />
                            <button onClick={addAuthorizedUser}
                                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors">
                                Add
                            </button>
                        </div>

                        {authorizedUsers.length === 0 ? (
                            <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50">
                                <p className="text-sm text-slate-500">No authorized users added.</p>
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {authorizedUsers.map((name, index) => (
                                    <li key={index} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                        <span className="text-sm font-medium text-slate-700">{name}</span>
                                        <button onClick={(e) => { e.preventDefault(); removeAuthorizedUser(name); }}
                                            className="text-slate-400 hover:text-red-500 transition-colors p-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Security */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Security</h3>
                        <a href="/forgot-password" target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group">
                            <div>
                                <p className="font-medium text-slate-900 text-sm">Change Password</p>
                                <p className="text-xs text-slate-500 mt-0.5">Send a secure reset link</p>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </a>
                    </div>

                </div>
            </form>
        </div>
    );
}