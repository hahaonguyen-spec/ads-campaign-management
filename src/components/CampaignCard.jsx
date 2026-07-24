import React from 'react';
import { DollarSign, Users, Target, ArrowUpRight, Calendar, Globe, Layers, Rocket, CalendarClock, PlusCircle } from 'lucide-react';

export default function CampaignCard({ campaign, onSelect, onDelete, onOpenMetricInput }) {
  const { id, overview, kpiTracking = [] } = campaign;

  const isPlanned = overview?.status === 'Planned' || kpiTracking.length === 0;

  // Calculate actuals
  let totalSpend = 0;
  let totalLeads = 0;
  let totalFtd = 0;
  let totalDeposit = 0;

  if (kpiTracking && Array.isArray(kpiTracking)) {
    totalSpend = kpiTracking.reduce((acc, row) => acc + (row.spend || 0), 0);
    totalLeads = kpiTracking.reduce((acc, row) => acc + (row.leads || 0), 0);
    totalFtd = kpiTracking.reduce((acc, row) => acc + (row.ftd || 0), 0);
    totalDeposit = kpiTracking.reduce((acc, row) => acc + (row.netDeposit || 0), 0);
  }

  const avgCpl = totalLeads > 0 ? (totalSpend / totalLeads) : 0;
  
  // Targets / Expected Outcome
  const expected = overview?.expectedTargets || {
    targetBudget: overview?.totalBudget || 5000,
    targetLeads: Math.round((overview?.totalBudget || 5000) / 8.0),
    targetCpl: 8.00,
    targetFtd: 50,
    targetNetDeposit: 25000
  };

  const leadProgress = expected.targetLeads > 0 ? Math.min(100, Math.round((totalLeads / expected.targetLeads) * 100)) : 0;

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between group">
      <div>
        
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {isPlanned ? (
            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <CalendarClock className="w-3 h-3 text-amber-400" />
              Planned Campaign
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <Rocket className="w-3 h-3 text-emerald-400 animate-pulse" />
              Launching / Active
            </span>
          )}

          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-800">
            <Globe className="w-3 h-3 text-amber-400" />
            {overview?.region || 'Global'}
          </span>
        </div>

        {/* Campaign Title & Type */}
        <h3 
          onClick={() => onSelect(campaign)} 
          className="text-base font-bold text-white group-hover:text-amber-400 transition cursor-pointer line-clamp-1 mb-1"
        >
          {overview?.name || 'Untitled Campaign'}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-1 mb-4 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          {overview?.type || 'Performance Ads'} • {overview?.owner || 'Unassigned'}
        </p>

        {/* PLANNED CAMPAIGN VIEW (Expected Outcome Targets) */}
        {isPlanned ? (
          <div className="space-y-3 p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 mb-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <span className="text-[11px] font-bold uppercase text-amber-400 tracking-wider">Expected Target Outcome</span>
              <span className="text-[10px] text-slate-400">Budget: ${expected.targetBudget.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Target Leads</span>
                <span className="text-xs font-bold font-mono text-amber-300">{expected.targetLeads.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Target CPL</span>
                <span className="text-xs font-bold font-mono text-emerald-300">${expected.targetCpl.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Target FTD</span>
                <span className="text-xs font-bold font-mono text-blue-300">{expected.targetFtd.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-500/10 flex justify-between text-[11px] text-slate-300">
              <span>Expected Deposit:</span>
              <span className="font-mono font-bold text-purple-300">${expected.targetNetDeposit.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          /* LAUNCHING CAMPAIGN VIEW (Actual Results vs Target) */
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Actual Spend</span>
                <span className="text-xs font-bold font-mono text-slate-100">${totalSpend.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Actual Leads</span>
                <span className="text-xs font-bold font-mono text-amber-400">{totalLeads.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Actual CPL</span>
                <span className="text-xs font-bold font-mono text-emerald-400">${avgCpl.toFixed(2)}</span>
              </div>
            </div>

            {/* Target vs Actual Progress */}
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Leads vs Target ({expected.targetLeads})</span>
                <span className="font-mono font-bold text-amber-400">{leadProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="h-full gradient-gold-bg rounded-full" style={{ width: `${leadProgress}%` }}></div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {overview?.duration || '4 Weeks'}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenMetricInput(campaign);
            }}
            className="flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 transition"
            title="Log/Update tracking metrics"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Track</span>
          </button>

          <button
            onClick={() => onSelect(campaign)}
            className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1 rounded-lg border border-amber-500/30 transition"
          >
            <span>View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
