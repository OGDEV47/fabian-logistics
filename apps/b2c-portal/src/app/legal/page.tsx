"use client";

import React, { useState } from 'react';
import { Printer } from 'lucide-react';

type DocumentId = 'data-sharing' | 'data-processing' | 'privacy-policy' | 'terms';

interface LegalDocument {
    id: DocumentId;
    title: string;
    version: string;
    effectiveDate: string;
    lastUpdated: string;
    content: React.ReactNode;
}

const DOCUMENTS: LegalDocument[] = [
    {
        id: 'data-sharing',
        title: 'Data Sharing Agreement',
        version: '1.2.0',
        effectiveDate: 'October 1, 2023',
        lastUpdated: 'October 15, 2023',
        content: (
            <article className="space-y-8 text-slate-700 leading-relaxed">
                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Purpose and Scope</h2>
                    <p>
                        This Data Sharing Agreement establishes the strict protocols governing how personal and operational data may be shared with authorized third-party partners. We operate on a principle of least privilege, ensuring data is only shared when explicitly required for service delivery.
                    </p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Authorized Recipients</h2>
                    <p className="mb-3">Data sharing is restricted to vetted entities, specifically:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Customs and border control authorities for strict legal compliance.</li>
                        <li>Verified logistics and last-mile delivery partners, strictly limited to necessary shipping details (e.g., name, delivery address).</li>
                        <li>Payment processing gateways, restricted to secure transaction data under PCI-DSS compliance.</li>
                    </ul>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Explicit User Consent</h2>
                    <p>
                        No user data is shared for marketing, analytics, or monetization purposes. Sharing beyond the core service requirements mandates explicit, opt-in consent from the user, revocable at any time via the account settings portal.
                    </p>
                </section>
            </article>
        )
    },
    {
        id: 'data-processing',
        title: 'Data Processing Agreement',
        version: '2.1.0',
        effectiveDate: 'January 15, 2024',
        lastUpdated: 'February 10, 2024',
        content: (
            <article className="space-y-8 text-slate-700 leading-relaxed">
                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Processing Operations</h2>
                    <p>
                        Data processing activities are strictly limited to operations necessary for account provisioning, package routing, and compliance auditing. All data in transit and at rest is subjected to AES-256 encryption.
                    </p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Security Controls</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Access Controls:</strong> Role-Based Access Control (RBAC) is enforced across all internal systems.</li>
                        <li><strong>Audit Logging:</strong> All data access events are logged and retained for a period of 365 days for forensic auditing.</li>
                        <li><strong>Vulnerability Management:</strong> Continuous monitoring and regular penetration testing are conducted on all processing environments.</li>
                    </ul>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Regulatory Obligations</h2>
                    <p>
                        Our processing environments are designed to comply with international standards, including GDPR and local data protection regulations. In the event of a breach, strict notification protocols are triggered within 72 hours.
                    </p>
                </section>
            </article>
        )
    },
    {
        id: 'privacy-policy',
        title: 'Data Privacy Policy',
        version: '3.0.4',
        effectiveDate: 'March 1, 2024',
        lastUpdated: 'March 1, 2024',
        content: (
            <article className="space-y-8 text-slate-700 leading-relaxed">
                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Minimal Data Collection</h2>
                    <p>
                        We collect only the absolute minimum data required to facilitate logistics and shipping services. Extraneous metadata, behavioral tracking, and background telemetry are strictly prohibited on our platforms.
                    </p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Zero-Tracking Commitment</h2>
                    <p>
                        Our portal does not utilize third-party tracking cookies or marketing pixels. We respect Do Not Track (DNT) signals by default and ensure your browsing activity remains entirely private.
                    </p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Customer Rights & Retention</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Right to Erasure:</strong> Customers may request immediate deletion of their operational data, subject only to mandatory legal retention requirements (e.g., tax records).</li>
                        <li><strong>Data Portability:</strong> Users can export their transaction history and profile data in standardized, machine-readable formats.</li>
                        <li><strong>Retention Limits:</strong> Account data is automatically purged 24 months after account closure.</li>
                    </ul>
                </section>
            </article>
        )
    },
    {
        id: 'terms',
        title: 'Terms and Conditions',
        version: '1.5.0',
        effectiveDate: 'August 10, 2023',
        lastUpdated: 'December 5, 2023',
        content: (
            <article className="space-y-8 text-slate-700 leading-relaxed">
                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Usage Rules</h2>
                    <p>
                        By utilizing this service, users agree to provide accurate information for customs clearance and delivery routing. The service must not be used to transport illicit, hazardous, or legally restricted materials under any circumstances.
                    </p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Shipping and Delivery Terms</h2>
                    <p>
                        Estimated delivery times are non-binding. We maintain liability for packages only while they are in our direct custody. Transfer of liability occurs upon final delivery to the authorized recipient or verified location.
                    </p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Account Termination</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>We reserve the right to immediately suspend or terminate accounts found to be engaging in fraudulent activities or violating customs regulations.</li>
                        <li>Users may terminate their accounts at any time via the portal, initiating the standard data offboarding process.</li>
                    </ul>
                </section>
            </article>
        )
    }
];

export default function LegalAgreementsPage() {
    const [activeDocId, setActiveDocId] = useState<DocumentId>('data-sharing');

    const activeDocument = DOCUMENTS.find(doc => doc.id === activeDocId) || DOCUMENTS[0];

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-900">Policies & Legal Agreements</h1>
                    <p className="mt-2 text-slate-600">Review our enterprise-grade security commitments and operational terms.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left Sidebar Navigation */}
                    <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-8">
                        <nav 
                            className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide" 
                            aria-label="Legal Documents Navigation"
                        >
                            {DOCUMENTS.map(doc => (
                                <button
                                    key={doc.id}
                                    onClick={() => setActiveDocId(doc.id)}
                                    className={`whitespace-nowrap lg:whitespace-normal text-left px-5 py-3.5 rounded-xl transition-all duration-200 font-medium text-sm
                                        ${activeDocId === doc.id 
                                            ? 'bg-blue-600 text-white shadow-sm' 
                                            : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                                        }`}
                                    aria-current={activeDocId === doc.id ? 'page' : undefined}
                                >
                                    {doc.title}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 w-full min-w-0 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 lg:p-12">
                        
                        {/* Document Header */}
                        <div className="border-b border-slate-200 pb-8 mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
                                <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                                    {activeDocument.title}
                                </h1>
                                <button 
                                    onClick={handlePrint} 
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shrink-0 shadow-sm"
                                    aria-label="Print Document"
                                >
                                    <Printer className="w-4 h-4" />
                                    Print Document
                                </button>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-500">
                                <div>
                                    <span className="font-semibold text-slate-700">Version:</span> {activeDocument.version}
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-700">Effective Date:</span> {activeDocument.effectiveDate}
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-700">Last Updated:</span> {activeDocument.lastUpdated}
                                </div>
                            </div>
                        </div>

                        {/* Document Content */}
                        <div className="prose prose-slate max-w-none">
                            {activeDocument.content}
                        </div>
                        
                    </main>

                </div>
            </div>
            
            {/* Print styles */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    body {
                        background-color: white !important;
                    }
                    aside, button {
                        display: none !important;
                    }
                    main {
                        border: none !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                    }
                }
            `}} />
        </div>
    );
}
