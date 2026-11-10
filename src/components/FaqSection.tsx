import React, { useState } from 'react';
import { Search, ChevronDown, HelpCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { faqData } from '../data/mockData';

interface FaqSectionProps {
  lang: Language;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ lang }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'all' | 'passport' | 'peduli-wni' | 'fees' | 'appointment'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndices, setOpenIndices] = useState<number[]>([0]); // first open by default

  const toggleIndex = (idx: number) => {
    setOpenIndices(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const filteredFaqs = faqData.filter(item => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const q = lang === 'en' ? item.questionEn.toLowerCase() : item.questionId.toLowerCase();
    const a = lang === 'en' ? item.answerEn.toLowerCase() : item.answerId.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || q.includes(query) || a.includes(query);
    return matchesTab && matchesSearch;
  });

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-sunny-navy text-xs font-bold tracking-wide uppercase mb-3">
            {t.faq.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-sunny-navy tracking-tight">
            {t.faq.title}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {t.faq.subtitle}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.faq.searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 focus:border-sunny-navy text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'bg-sunny-navy text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.faq.tabAll}
          </button>
          <button
            onClick={() => setActiveTab('passport')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'passport'
                ? 'bg-sunny-navy text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.faq.tabPassport}
          </button>
          <button
            onClick={() => setActiveTab('peduli-wni')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'peduli-wni'
                ? 'bg-sunny-navy text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.faq.tabPeduli}
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'fees'
                ? 'bg-sunny-navy text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.faq.tabFees}
          </button>
          <button
            onClick={() => setActiveTab('appointment')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'appointment'
                ? 'bg-sunny-navy text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.faq.tabAppointment}
          </button>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/80">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {t.faq.noResults}
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndices.includes(idx);
              const question = lang === 'en' ? faq.questionEn : faq.questionId;
              const answer = lang === 'en' ? faq.answerEn : faq.answerId;

              return (
                <div
                  key={idx}
                  className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white transition-all hover:border-slate-300"
                >
                  <button
                    onClick={() => toggleIndex(idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <span className="font-bold text-xs sm:text-sm text-sunny-navy leading-snug">
                      {question}
                    </span>
                    <div className={`w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-slate-200' : ''
                    }`}>
                      <ChevronDown className="w-4 h-4 text-slate-600" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/60 bg-slate-50/50">
                      {answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
};
