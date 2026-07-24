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
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 glass-panel-hover flex flex-col justify-between space-y-4 relative group">
      
      {/* Top Status & Region Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          
          {/* Status Badge */}
          <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
            isLaunching 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm' 
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
          }`}>
            {isLaunching ? <Rocket className="w-3 h-3 text-emerald-400" /> : <CalendarClock className="w-3 h-3 text-amber-400" />}
            <span>{isLaunching ? 'LAUNCHING / ACTIVE' : 'PLANNED / TARGET'}</span>
          </span>

          {/* Region Pill */}
          <span className="text-[10px] font-medium text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded-full border border-slate-800 flex items-center gap-1">
            <Globe className="w-3 h-3 text-emerald-400" />
            <span className="truncate max-w-[120px]">{overview.region || 'Global'}</span>
          </span>
        </div>

        {/* Campaign Title & Owner */}
        <div>
          <h3 
            onClick={onSelect}
            className="text-base font-extrabold text-white group-hover:text-emerald-400 transition cursor-pointer flex items-center justify-between gap-2"
          >
            <span className="line-clamp-1">{overview.name || 'Untitled Campaign'}</span>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition shrink-0" />
          </h3>
          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
            {overview.type} • <strong className="text-slate-300 font-medium">{overview.owner}</strong>
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
              {isLaunching ? 'Actual Spend' : 'Target Budget'}
            </span>
            <span className="text-xs font-extrabold font-mono text-white block mt-0.5">
              ${(isLaunching ? totalSpend : expected.targetBudget).toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
              {isLaunching ? 'Actual Leads' : 'Target Leads'}
            </span>
            <span className="text-xs font-extrabold font-mono text-amber-400 block mt-0.5">
              {(isLaunching ? totalLeads : expected.targetLeads).toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
              {isLaunching ? 'Actual CPL' : 'Target CPL'}
            </span>
            <span className="text-xs font-extrabold font-mono text-emerald-400 block mt-0.5">
              ${(isLaunching ? avgCpl : expected.targetCpl).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>Leads vs Target ({expected.targetLeads.toLocaleString()})</span>
            <span className="font-bold text-emerald-400">{progressPct}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div 
              className="h-full gradient-emerald-bg rounded-full transition-all duration-500" 
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Footer Quick Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
        <span className="text-[11px] font-mono text-slate-400">
          ⏱️ {overview.duration || '1 Month'}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMetricInput}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 text-[11px] font-semibold transition"
          >
            <PlusCircle className="w-3 h-3" />
            <span>Track</span>
          </button>

          <button
            onClick={onSelect}
            className="flex items-center gap-1 px-3 py-1 rounded-lg gradient-emerald-bg text-white text-[11px] font-semibold hover:brightness-110 shadow transition"
          >
            <span>View</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>

          <button
            onClick={onDelete}
            className="p-1 text-slate-600 hover:text-red-400 transition"
            title="Delete Campaign"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
