import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Send,
  AlertCircle,
  CheckCircle2,
  FileQuestion,
  Headphones,
} from 'lucide-react';
import { useKhabar } from '../../context/KhabarContext';
import { FAQS } from '../../data/khabarData';

export const HelpCenterView: React.FC = () => {
  const { supportTickets, createSupportTicket, orders, showToast, formatBDT } = useKhabar();

  const [selectedCategory, setSelectedCategory] = useState('Order issue');
  const [subject, setSubject] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || '');
  const [message, setMessage] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const supportCategories = [
    'Order issue',
    'Payment issue',
    'Missing item',
    'Wrong item',
    'Late delivery',
    'Refund',
    'Restaurant issue',
    'Account issue',
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      showToast('Please enter subject and message details', 'error');
      return;
    }
    createSupportTicket(selectedCategory, subject, message, selectedOrderId);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
            <Headphones className="w-4 h-4 text-brand-600" />
            <span>24/7 Dhaka Customer Support</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            How can we help you today?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Get instant assistance on your active delivery, payments, or report any kitchen issue.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Dhaka Support Hotline</span>
              <span className="text-xs font-semibold text-brand-600">+880 9612-008800</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Email Support Desk</span>
              <span className="text-xs font-semibold text-emerald-600">help@khabar.com.bd</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Live Chat Agent</span>
              <span className="text-xs font-semibold text-purple-600">Avg. 2 min response</span>
            </div>
          </div>
        </div>

        {/* Support Ticket Submission Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-display font-black text-lg text-slate-900">
              Open a Support Ticket
            </h2>
            <p className="text-xs text-slate-500">
              Select the issue type and our support executive will resolve it with urgency.
            </p>
          </div>

          <form onSubmit={handleTicketSubmit} className="space-y-4">
            {/* Category Chips */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Issue Category
              </label>
              <div className="flex flex-wrap gap-2">
                {supportCategories.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedCategory === cat
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Related Order ID (Optional)
                </label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:border-brand-500"
                >
                  <option value="">None / General Inquiry</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      #{o.id} — {o.restaurantName} ({formatBDT(o.total)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Missing drinks in order / rider delay"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Explanation
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe what happened so we can assist you right away..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Submit Support Request</span>
            </button>
          </form>
        </div>

        {/* Existing Support Tickets Roster */}
        {supportTickets.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900">Your Support Tickets</h3>
            <div className="space-y-3">
              {supportTickets.map((tck) => (
                <div key={tck.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-xs sm:text-sm text-slate-900">
                        {tck.subject}
                      </span>
                      <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded font-mono">
                        {tck.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{tck.message}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      Category: {tck.category} • Created {tck.createdAt}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      tck.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {tck.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Frequently Asked Questions Accordion */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-brand-600" />
            Frequently Asked Questions
          </h3>
          <div className="divide-y divide-slate-100">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-display font-bold text-xs sm:text-sm text-slate-900 hover:text-brand-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed animate-in fade-in duration-150">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
