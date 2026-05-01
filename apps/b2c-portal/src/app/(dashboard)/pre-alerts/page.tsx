"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/utils/supabase';

export default function PreAlertsPage() {
  const [showForm, setShowForm] = useState(false);
  const [preAlerts, setPreAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courier, setCourier] = useState('');
  const [expectedValue, setExpectedValue] = useState('');
  const [expectedWeight, setExpectedWeight] = useState('');
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const closeForm = () => {
    setShowForm(false);
    setIsEditMode(false);
    setEditId(null);
    setTrackingNumber('');
    setCourier('');
    setExpectedValue('');
    setExpectedWeight('');
    setInvoiceFile(null);
    setError(null);
  };

  const openNewForm = () => {
    closeForm();
    setShowForm(true);
  };

  const handleEditClick = (alert: any) => {
    setTrackingNumber(alert.tracking_number);
    setCourier(alert.courier);
    setExpectedValue(alert.expected_value?.toString() || '');
    setExpectedWeight(alert.expected_weight?.toString() || '');
    setEditId(alert.id);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Quick validation: keep it under 10MB
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be under 10MB");
        return;
      }
      setInvoiceFile(file);
      setError(null);
    }
  };

  useEffect(() => {
    const initData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        fetchPreAlerts(session.user.id);
      } else {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const fetchPreAlerts = async (uid: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pre_alerts')
      .select('*')
      .eq('user_id', uid)
      .order('id', { ascending: false });

    if (error) {
      console.error("Error fetching pre-alerts:", error);
    } else {
      setPreAlerts(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSubmitting(true);
    setError(null);

    let submitError;
    let finalInvoiceUrl = null;

    // 1. Handle File Upload if a file was selected
    if (invoiceFile) {
      const fileExt = invoiceFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('invoices')
        .upload(fileName, invoiceFile);

      if (uploadError) {
        setError("Failed to upload invoice: " + uploadError.message);
        setSubmitting(false);
        return;
      }

      // Get the public URL to save to the database
      const { data: { publicUrl } } = supabase.storage
        .from('invoices')
        .getPublicUrl(fileName);

      finalInvoiceUrl = publicUrl;
    }

    // 2. Save the Record to the Database
    if (isEditMode && editId) {
      const updateData: any = {
        tracking_number: trackingNumber,
        courier: courier,
        expected_value: parseFloat(expectedValue),
        expected_weight: parseFloat(expectedWeight),
      };

      // Only update the invoice URL if they uploaded a new one
      if (finalInvoiceUrl) updateData.invoice_url = finalInvoiceUrl;

      const { error } = await supabase
        .from('pre_alerts')
        .update(updateData)
        .eq('id', editId);
      submitError = error;
    } else {
      const newPreAlert = {
        tracking_number: trackingNumber,
        courier: courier,
        expected_value: parseFloat(expectedValue),
        expected_weight: parseFloat(expectedWeight),
        user_id: userId,
        status: 'Pending',
        invoice_url: finalInvoiceUrl, // Save the link!
      };
      const { error } = await supabase
        .from('pre_alerts')
        .insert([newPreAlert]);
      submitError = error;
    }

    if (submitError) {
      setError(submitError.message);
      setSubmitting(false);
    } else {
      closeForm();
      setSubmitting(false);
      fetchPreAlerts(userId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pre-Alerts</h1>
          <p className="text-slate-500 mt-1">Notify the warehouse of your incoming packages to speed up processing.</p>
        </div>
        <button
          onClick={openNewForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Pre-Alert
        </button>
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-800">{isEditMode ? 'Edit Pre-Alert' : 'New Pre-Alert'}</h2>
              <button
                type="button"
                onClick={closeForm}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tracking Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tracking Number *</label>
                  <input
                    type="text"
                    required
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
                    placeholder="e.g. TBA123456789"
                  />
                </div>

                {/* Courier */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Courier *</label>
                  <select
                    required
                    value={courier}
                    onChange={(e) => setCourier(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  >
                    <option value="">Select a courier</option>
                    <option value="Amazon Logistics">Amazon Logistics</option>
                    <option value="USPS">USPS</option>
                    <option value="FedEx">FedEx</option>
                    <option value="UPS">UPS</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Expected Value */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expected Value (USD) *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-medium">$</span>
                    </div>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={expectedValue}
                      onChange={(e) => setExpectedValue(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Expected Weight */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expected Weight (lbs) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.1"
                      value={expectedWeight}
                      onChange={(e) => setExpectedWeight(e.target.value)}
                      className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
                      placeholder="0.0"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-medium">lbs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active File Upload Zone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Upload Invoice (Optional)</label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf, .png, .jpg, .jpeg"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed rounded-xl transition-colors cursor-pointer
                  ${invoiceFile ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
                `}
                >
                  <div className="space-y-2 text-center">
                    {invoiceFile ? (
                      <div className="text-blue-700 font-medium flex flex-col items-center gap-2">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {invoiceFile.name}
                        <span className="text-xs text-blue-500 font-normal block">Click to change file</span>
                      </div>
                    ) : (
                      <>
                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-slate-600 justify-center">
                          <span className="relative font-medium text-blue-600">
                            Click to upload
                          </span>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-slate-500">PDF, PNG, JPG up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition-colors flex items-center disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditMode ? 'Saving...' : 'Uploading & Submitting...'}
                    </>
                  ) : (
                    isEditMode ? 'Save Changes' : 'Submit Pre-Alert'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tracking Number</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Courier</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Weight</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    Loading pre-alerts...
                  </td>
                </tr>
              ) : preAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No pre-alerts found. Add your first one above!
                  </td>
                </tr>
              ) : (
                preAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{alert.tracking_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-slate-600">{alert.courier}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-slate-600">${Number(alert.expected_value).toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-slate-600">{alert.expected_weight} lbs</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {alert.invoice_url ? (
                        <a href={alert.invoice_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                          View
                        </a>
                      ) : (
                        <span className="text-slate-400 text-sm">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${alert.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                        {alert.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(alert)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}