import React from 'react';
import { Rocket, CalendarClock, Globe, DollarSign, Users, Target, ArrowUpRight, PlusCircle, Trash2, Eye } from 'lucide-react';

export default function CampaignCard({ campaign, onSelect, onDelete, onOpenMetricInput }) {
  const { overview = {}, kpiTracking = [] } = campaign;

  const isLaunching = overview.status === 'Launching' || (kpiTracking && kpiTracking.some(r => Number(r.spend) > 0));

  // Calculate actuals
  const totalSpend = kpiTracking.reduce((a, b) => a + (Number(b.spend) || 0), 0);
  const totalLeads = kpiTracking.reduce((a, b) => a + (Number(b.leads) || 0), 0);
  const avgCpl = totalLeads > 0 ? totalSpend / totalLeads : 0;

  // Expected targets
  const expected = overview.expectedTargets || {
    targetBudget: overview.totalBudget || 5000,
    targetLeads: Math.round((overview.totalBudget || 5000) / 8.0),
    targetCpl: 8.00
  };

  const progressPct = expected.targetLeads > 0 
    ? Math.min(100, Math.round((totalLeads / expected.targetLeads) * 100)) 
    : 0;

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 glass-panel-hover flex flex-col justify-between space-y-4 relative group">
      
      {/* Top Status & Region Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          
          {/* Status Badge */}
          <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full border flex items-center gap-1.5 ${
            isLaunching 
              ? 'bg-[#0AE5D5]/20 text-[#0AE5D5] border-[#0AE5D5]/40 shadow-sm' 
              : 'bg-[#33CCFF]/20 text-[#33CCFF] border-[#33CCFF]/40 shadow-sm'
          }`}>
            {isLaunching ? <Rocket className="w-3.5 h-3.5 text-[#0AE5D5]" /> : <CalendarClock className="w-3.5 h-3.5 text-[#33CCFF]" />}
            <span>{isLaunching ? 'LAUNCHING / ACTIVE' : 'PLANNED / TARGET'}</span>
          </span>

          {/* Region Pill */}
          <span className="text-xs font-semibold text-slate-300 bg-[#071322] px-2.5 py-1 rounded-full border border-slate-700 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-[#0AE5D5]" />
            <span className="truncate max-w-[130px]">{overview.region || 'Global'}</span>
          </span>
        </div>

        {/* Campaign Title & Owner */}
        <div>
          <h3 
            onClick={onSelect}
            className="text-base sm:text-lg font-black text-white group-hover:text-[#0AE5D5] transition cursor-pointer flex items-center justify-between gap-2 leading-tight"
          >
            <span className="line-clamp-1">{overview.name || 'Untitled Campaign'}</span>
            <ArrowUpRight className="w-4.5 h-4.5 text-slate-500 group-hover:text-[#0AE5D5] transition shrink-0" />
          </h3>
          <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-medium">
            {overview.type} • <strong className="text-slate-200">{overview.owner}</strong>
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#071322] border border-slate-700/80 text-center">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 block font-bold">
              {isLaunching ? 'Actual Spend' : 'Target Budget'}
            </span>
            <span className="text-sm sm:text-base font-black font-mono text-white block mt-0.5">
              ${(isLaunching ? totalSpend : expected.targetBudget).toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 block font-bold">
              {isLaunching ? 'Actual Leads' : 'Target Leads'}
            </span>
            <span className="text-sm sm:text-base font-black font-mono text-[#33CCFF] block mt-0.5">
              {(isLaunching ? totalLeads : expected.targetLeads).toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 block font-bold">
              {isLaunching ? 'Actual CPL' : 'Target CPL'}
            </span>
            <span className="text-sm sm:text-base font-black font-mono text-[#0AE5D5] block mt-0.5">
              ${(isLaunching ? avgCpl : expected.targetCpl).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono text-slate-300">
            <span>Leads Target ({expected.targetLeads.toLocaleString()})</span>
            <span className="font-bold text-[#0AE5D5]">{progressPct}%</span>
          </div>
          <div className="w-full bg-[#071322] rounded-full h-2 overflow-hidden border border-slate-700">
            <div 
              className="h-full gradient-cpt-brand rounded-full transition-all duration-500" 
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Footer Quick Actions */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
        <span className="text-xs font-mono text-slate-400 font-medium">
          ⏱️ {overview.duration || '1 Month'}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMetricInput}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#071322] hover:bg-[#1E375E] text-[#33CCFF] border border-slate-700 text-xs font-bold transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Track</span>
          </button>

          <button
            onClick={onSelect}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl gradient-cpt-brand text-[#071322] text-xs font-black hover:brightness-110 shadow transition"
          >
            <span>View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition"
            title="Delete Campaign"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}

