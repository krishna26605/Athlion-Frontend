import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Privacy Policy | Athlion",
  description: "Read Athlion's Privacy Policy regarding data collection, event registration security, payments, and account privacy.",
  alternates: {
    canonical: "https://www.athlion.in/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 bg-black text-white px-4">
      <div className="max-w-4xl mx-auto glass-card p-8 md:p-12 rounded-3xl border border-white/10">
        <h1 className="text-3xl sm:text-5xl font-black italic tracking-tighter uppercase mb-6">PRIVACY <span className="text-[#f82506]">POLICY</span></h1>
        <p className="text-xs text-gray-500 font-bold uppercase mb-8">Effective Date: January 1, 2026</p>

        <div className="space-y-6 text-gray-300 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Overview</h2>
            <p>Athlion Fitness Entertainment (&quot;Athlion&quot;, &quot;we&quot;, &quot;us&quot;) respects your privacy. This policy explains how we collect, use, and protect your personal information when you use our website at https://www.athlion.in and register for Athlion fitness events.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. Information We Collect</h2>
            <p>We collect personal information necessary for event participation and account creation, including your name, email address, phone number, physical measurements (height, weight for division placement), wave time selections, and payment verification records processed via secure payment gateways.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. How We Use Your Data</h2>
            <p>Your information is strictly used to manage your event registrations, issue digital check-in passes, verify identity at event venues, send essential race notifications, and improve athletic services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Payment Security</h2>
            <p>Athlion does not store credit card details or bank passwords on our servers. All transactions are securely encrypted and processed by Razorpay in compliance with PCI-DSS standards.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">5. Contact Us</h2>
            <p>If you have questions regarding your data privacy, contact us at <a href="mailto:support@athlion.in" className="text-[#f82506] underline">support@athlion.in</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
