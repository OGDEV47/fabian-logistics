"use client";

import React, { useState, useEffect } from 'react';

const DUTY_FREE_THRESHOLD = 100; // Items under $100 USD don't pay duty/GCT

export default function CalculatorPage() {
  const [value, setValue] = useState<string>('');
  const [weight, setWeight] = useState<number>(1);
  const [category, setCategory] = useState<string>('Electronics');

  // New Live Exchange Rate State
  const [exchangeRate, setExchangeRate] = useState<number>(155); // Fallback to 155
  const [isFetchingRate, setIsFetchingRate] = useState<boolean>(true);

  // Fetch the live exchange rate on load
  useEffect(() => {
    const fetchLiveRate = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data && data.rates && data.rates.JMD) {
          setExchangeRate(data.rates.JMD);
        }
      } catch (error) {
        console.error("Failed to fetch live exchange rate, using fallback.", error);
      } finally {
        setIsFetchingRate(false);
      }
    };
    fetchLiveRate();
  }, []);

  // Calculation logic
  const numericValue = parseFloat(value) || 0;
  const hasInputs = numericValue > 0;
  const isDutiable = numericValue > DUTY_FREE_THRESHOLD;

  // Freight: Flat $4.00 per lb (minimum 1 lb)
  const freightUSD = hasInputs ? Math.max(weight, 1) * 4.00 : 0;

  // Duty & GCT (Only applies if item is over $100 USD)
  const dutyRate = category === 'Electronics' ? 0.20 : category === 'Apparel' ? 0.15 : 0.10;
  const dutyUSD = isDutiable ? (numericValue + freightUSD) * dutyRate : 0;
  const gctUSD = isDutiable ? (numericValue + freightUSD + dutyUSD) * 0.15 : 0;

  // Processing Fee: $500 standard handling, or $2000 if customs clearance is needed
  const processingFeeJMD = isDutiable ? 2000 : 500;

  // Total owed TO THE COURIER (Freight + Duty + GCT + Fees). 
  const totalCourierUSD = freightUSD + dutyUSD + gctUSD;
  const totalLandedJMD = hasInputs ? (totalCourierUSD * exchangeRate) + processingFeeJMD : 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Freight & Duty Calculator</h1>
        <p className="text-slate-500 mt-2">Estimate your shipping and customs costs before you buy.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Package Details</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Item Value (USD)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-medium">$</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="block w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex justify-between">
                <span>Estimated Weight</span>
                <span className="text-blue-600 font-semibold">{weight} lbs</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="100"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>0.5 lbs</span>
                <span>100 lbs</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex justify-between">
                <span>Duty Category</span>
                {!isDutiable && hasInputs && (
                  <span className="text-emerald-600 font-medium text-xs bg-emerald-50 px-2 py-0.5 rounded-md">Duty-Free (Under $100)</span>
                )}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={!isDutiable && hasInputs}
                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="Electronics">Electronics (20%)</option>
                <option value="Apparel">Clothing & Apparel (15%)</option>
                <option value="Supplements">Vitamins & Supplements (10%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Receipt */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden sticky top-8">
            <div className="p-6 md:p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Estimated Shipping Bill
              </h3>

              {!hasInputs ? (
                <div className="text-center py-10 px-4 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50">
                  <div className="w-12 h-12 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🧾</span>
                  </div>
                  <p className="text-slate-500 text-sm">
                    Enter your item value and weight to see a detailed cost breakdown.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Freight Cost ({weight} lbs)</span>
                    <span className="text-slate-900 font-medium">${freightUSD.toFixed(2)}</span>
                  </div>

                  {isDutiable ? (
                    <>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Customs Duty ({category})</span>
                        <span className="text-slate-900 font-medium">${dutyUSD.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm pb-4 border-b border-slate-100">
                        <span className="text-slate-500">GCT (15%)</span>
                        <span className="text-slate-900 font-medium">${gctUSD.toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-center text-sm pb-4 border-b border-slate-100">
                      <span className="text-slate-500">Customs Duty & GCT</span>
                      <span className="text-emerald-600 font-medium">Waived</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm pt-2">
                    <span className="text-slate-500">{isDutiable ? 'Customs Clearance Fee' : 'Handling Fee'}</span>
                    <span className="text-slate-900 font-medium">JMD ${processingFeeJMD.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pb-4 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2">
                      Exchange Rate
                      {isFetchingRate ? (
                        <span className="text-blue-500 text-xs animate-pulse">(Updating...)</span>
                      ) : (
                        <span className="text-emerald-500 text-xs">(Live)</span>
                      )}
                    </span>
                    <span className="text-slate-900 font-medium">1 USD = {exchangeRate.toFixed(2)} JMD</span>
                  </div>

                  <div className="pt-4">
                    <div className="flex justify-between items-end">
                      <span className="text-slate-900 font-semibold flex flex-col">
                        Estimated Courier Bill
                        <span className="text-xs text-slate-400 font-normal mt-0.5">Doesn't include item cost</span>
                      </span>
                      <span className="text-3xl font-bold text-blue-600">
                        JMD ${totalLandedJMD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}