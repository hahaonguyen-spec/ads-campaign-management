import React from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { generateCampaignInsights } from '../utils/analytics';

export default function AIInsights({ campaign }) {
  const insights = generateCampaignInsights(campaign);

  if (!insights || insights.length === 0) return null;

  const iconMap = {
    warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-400 shrink-0" />
  };

  const bgMap = {
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-300'
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg gradient-gold-bg text-dark-900">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Automated Campaign Diagnostic Insights</h3>
        </div>
        <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">CPT AI Engine</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((item, idx) => (
          <div key={idx} className={`p-3.5 rounded-xl border ${bgMap[item.type]} flex items-start gap-3`}>
            {iconMap[item.type]}
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold leading-tight">{item.title}</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-black/40 text-slate-300">
                  {item.category}
                </span>
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
