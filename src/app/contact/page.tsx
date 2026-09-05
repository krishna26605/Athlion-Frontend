'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 bg-black text-white px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#f82506]/10 border border-[#f82506]/30 text-[#f82506] text-xs font-black uppercase tracking-[0.3em] mb-4">
            GET IN TOUCH
          </span>
          <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase mb-4 leading-tight">
            CONTACT <span className="text-[#f82506]">ATHLION</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto">
            Have questions about event registrations, gym partnerships, sponsorship, or athlete support? Reach out to us.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Direct Contact Info Card */}
          <div className="md:col-span-5 glass-card p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-black italic uppercase text-[#f82506] mb-6">CONTACT DETAILS</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-[#f82506] shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest block">Email Support</span>
                    <a href="mailto:support@athlion.in" className="text-sm font-bold text-white hover:text-[#f82506] transition-colors">
                      support@athlion.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-[#f82506] shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest block">Official WhatsApp</span>
                    <a href="https://wa.me/919579680332" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-white hover:text-[#f82506] transition-colors">
                      +91 95796 80332
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-[#f82506] shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest block">Headquarters</span>
                    <p className="text-sm font-bold text-gray-300">
                      Athlion Fitness Entertainment, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-8">
              <p className="text-xs text-gray-500 font-medium">
                Support Hours: Monday – Saturday, 9:00 AM to 7:00 PM IST
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7 glass-card p-8 rounded-3xl border border-white/10">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="mx-auto text-green-500" size={56} />
                <h3 className="text-2xl font-black italic uppercase">MESSAGE SENT SUCCESSFULLY!</h3>
                <p className="text-gray-400 text-sm">Thank you for reaching out. Our team will respond within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="btn-primary px-6 py-2.5 text-xs font-black uppercase italic mt-4">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-2xl font-black italic uppercase mb-4">SEND A MESSAGE</h2>

                <div>
                  <label className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-[#f82506] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-[#f82506] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-1">Inquiry Type</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-sm focus:border-[#f82506] outline-none text-white"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Event Registration Support">Event Registration Support</option>
                    <option value="Gym Partnership">Gym Partnership</option>
                    <option value="Sponsorship & Brands">Sponsorship & Brands</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-[#f82506] outline-none"
                  />
                </div>

                <button type="submit" className="w-full btn-primary py-4 font-black italic tracking-widest text-sm flex items-center justify-center gap-2 uppercase">
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
