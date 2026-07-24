import React from 'react';
import { FileText, Award, DollarSign, Target, TrendingUp, CheckCircle2, AlertTriangle, Printer, Calculator } from 'lucide-react';
import WeeklyAggregationTable from './WeeklyAggregationTable';

export default function MonthlyReviewReport({ campaign }) {
  const { overview = {}, kpiTracking = [] } = campaign;

  const totalMarketingSpend = overview.marketingSpend || overview.totalBudget || 0;
  const creditBonusCost = overview.creditBonusCost || 0;
  const totalCampaignCost = overview.totalCampaignCost || (totalMarketingSpend + creditBonusCost);

  // Actual performance totals
  const actualSpend = kpiTracking.reduce((a, b) => a + (Number(b.spend) || 0), 0);
  const actualLeads = kpiTracking.reduce((a, b) => a + (Number(b.leads) || 0), 0);
  const actualFtd = kpiTracking.reduce((a, b) => a + (Number(b.ftd) || 0), 0);
  const actualNetDeposit = kpiTracking.reduce((a, b) => a + (Number(b.netDeposit) || 0), 0);
  const actualLots = kpiTracking.reduce((a, b) => a + (Number(b.lots) || 0), 0);
  const actualNmi = kpiTracking.reduce((a, b) => a + (Number(b.nmi) || 0), 0) || Math.round(actualNetDeposit * 0.25);

  const avgCpl = actualLeads > 0 ? actualSpend / actualLeads : 0;
  const costPerFtd = actualFtd > 0 ? actualSpend / actualFtd : 0;
  const roiPercent = totalCampaignCost > 0 ? (((actualNmi - totalCampaignCost) / totalCampaignCost) * 100) : 0;

  const targets = overview.expectedTargets || {
    targetLeads: 1000,
    targetFtd: 150,
    targetNmi: 25000
  };

  const leadsProgress = targets.targetLeads > 0 ? Math.round((actualLeads / targets.targetLeads) * 100) : 0;
  const ftdProgress = targets.targetFtd > 0 ? Math.round((actualFtd / targets.targetFtd) * 100) : 0;
  const nmiProgress = targets.targetNmi > 0 ? Math.round((actualNmi / targets.targetNmi) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-6 print:p-0">
      
      {/* Report Header Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl gradient-gold-bg text-dark-900 font-extrabold">
              CPT-I
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                Monthly & End-of-Campaign Review Report
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Approval Standard
                </span>
              </h3>
              <p className="text-xs text-slate-400">{overview.name} • {overview.duration}</p>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Export / Print Report</span>
          </button>
        </div>

        {/* PRIMARY KEY METRICS (CPT-I Mandate: Leads, FTD, NMI) */}
        <div className="space-y-2">
          <span className="text-[11px] uppercase font-bold text-amber-400 tracking-wider block">
            CPT-I Mandated Key Metrics: Leads • FTD • NMI
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-amber-400 font-bold">1. Verified Leads</span>
                <span className="text-slate-400 font-mono">Target: {targets.targetLeads?.toLocaleString()}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-white">{actualLeads.toLocaleString()}</span>
                <span className="text-xs font-mono font-bold text-amber-400">{leadsProgress}% Target</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="h-full gradient-gold-bg rounded-full" style={{ width: `${Math.min(100, leadsProgress)}%` }}></div>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">Average CPL: ${avgCpl.toFixed(2)}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/30 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-blue-400 font-bold">2. First Time Depositors (FTD)</span>
                <span className="text-slate-400 font-mono">Target: {targets.targetFtd?.toLocaleString()}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-blue-300">{actualFtd.toLocaleString()}</span>
                <span className="text-xs font-mono font-bold text-blue-400">{ftdProgress}% Target</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, ftdProgress)}%` }}></div>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">Cost Per FTD: ${costPerFtd.toFixed(2)}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-400 font-bold">3. Net Margin Income (NMI)</span>
                <span className="text-slate-400 font-mono">Target: ${targets.targetNmi?.toLocaleString()}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-emerald-400">${actualNmi.toLocaleString()}</span>
                <span className="text-xs font-mono font-bold text-emerald-400">{nmiProgress}% Target</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, nmiProgress)}%` }}></div>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">Net Deposit: ${actualNetDeposit.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AUTOMATED WEEKLY SUBTOTAL SUMMARY */}
      <WeeklyAggregationTable kpiRows={kpiTracking} />

      {/* COST VS RETURN RATIO */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
          <span>Campaign Costs (Marketing Spend + Credit Bonus) VS NMI Return</span>
          <span className="text-xs font-mono font-bold text-emerald-400">Net Campaign ROI: {roiPercent.toFixed(1)}%</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Paid Marketing Spend</span>
            <span className="text-base font-bold font-mono text-white block mt-0.5">${totalMarketingSpend.toLocaleString()}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Credit Bonus / Incentives</span>
            <span className="text-base font-bold font-mono text-amber-400 block mt-0.5">${creditBonusCost.toLocaleString()}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Total Campaign Costs</span>
            <span className="text-base font-extrabold font-mono text-rose-400 block mt-0.5">${totalCampaignCost.toLocaleString()}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-emerald-500/30 bg-emerald-500/5">
            <span className="text-emerald-400 text-[10px] uppercase block font-bold">NMI Net Revenue</span>
            <span className="text-base font-extrabold font-mono text-emerald-400 block mt-0.5">${actualNmi.toLocaleString()}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
