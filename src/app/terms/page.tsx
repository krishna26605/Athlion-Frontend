import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service | Athlion",
  description: "Read Athlion's Terms of Service regarding event participation rules, ticketing, safety guidelines, and website usage.",
  alternates: {
    canonical: "https://www.athlion.in/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 bg-black text-white px-4">
      <div className="max-w-4xl mx-auto glass-card p-8 md:p-12 rounded-3xl border border-white/10">
        <h1 className="text-3xl sm:text-5xl font-black italic tracking-tighter uppercase mb-6">TERMS OF <span className="text-[#f82506]">SERVICE</span></h1>
        <p className="text-xs text-gray-500 font-bold uppercase mb-8">Effective Date: January 1, 2026</p>

        <div className="space-y-6 text-gray-300 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Event Participation & Safety Waiver</h2>
            <p>By registering for an Athlion event, participants acknowledge the strenuous physical nature of hybrid fitness racing. Participants agree to follow all station movement standards, safety instructions, and referee directions on race day.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. Ticketing & Registration Transfer</h2>
            <p>All race entries are associated with a unique QR check-in code. Registrations are non-refundable unless an event is officially canceled by Athlion. Name or division transfers must be requested at least 7 days prior to race day.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Code of Conduct</h2>
            <p>Athlion maintains zero tolerance for unsportsmanlike behavior, cheating, altering station weights, or obstructing fellow athletes. Violators will be disqualified immediately without refund.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Intellectual Property</h2>
            <p>All content, branding, station designs, logos, and digital materials on https://www.athlion.in are the exclusive property of Athlion Fitness Entertainment.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
