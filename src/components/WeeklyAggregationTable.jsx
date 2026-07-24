import React from 'react';
import { Calculator, TrendingUp, Sparkles, Layers } from 'lucide-react';

export default function WeeklyAggregationTable({ kpiRows = [] }) {
  // Aggregate rows by week name (case-insensitive trim)
  const groupMap = {};

  kpiRows.forEach(row => {
    const rawWk = (row.week || 'Unspecified').trim();
    const groupKey = rawWk.toLowerCase();

    if (!groupMap[groupKey]) {
      groupMap[groupKey] = {
        displayWeek: rawWk,
        count: 0,
        spend: 0,
        impressions: 0,
        clicks: 0,
        leads: 0,
        accountOpened: 0,
        kyc: 0,
        ftd: 0,
        ftt: 0,
        grossDeposit: 0,
        netDeposit: 0,
        lots: 0,
        nmi: 0,
        channels: []
      };
    }

    const g = groupMap[groupKey];
    g.count += 1;
    g.spend += Number(row.spend) || 0;
    g.impressions += Number(row.impressions) || 0;
    g.clicks += Number(row.clicks) || 0;
    g.leads += Number(row.leads) || 0;
    g.accountOpened += Number(row.accountOpened) || 0;
    g.kyc += Number(row.kyc) || 0;
    g.ftd += Number(row.ftd) || 0;
    g.ftt += Number(row.ftt) || 0;
    g.grossDeposit += Number(row.grossDeposit) || 0;
    g.netDeposit += Number(row.netDeposit) || 0;
    g.lots += Number(row.lots) || 0;
    g.nmi += Number(row.nmi) || 0;

    if (row.channel && !g.channels.includes(row.channel)) {
      g.channels.push(row.channel);
    }
  });

  const aggregatedList = Object.values(groupMap);

  if (aggregatedList.length === 0) {
    return (
      <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-[#0C2038]/80 text-center space-y-2">
        <Calculator className="w-6 h-6 text-[#0AE5D5] mx-auto" />
        <h4 className="text-sm font-bold text-white">Automated Weekly Subtotal Summary</h4>
        <p className="text-xs text-slate-400">No weekly performance metrics recorded yet. Metrics will auto-sum here by week.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-5 rounded-2xl border border-[#33CCFF]/30 bg-gradient-to-b from-[#112037] to-[#0C2038] space-y-4 shadow-xl animate-fadeIn">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#33CCFF]/20 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl gradient-cpt-brand text-[#071322] font-black shadow-md">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-wide">Automated Weekly Subtotal Summary</h3>
            <p className="text-xs text-slate-300">Automatically sums metrics across all ad platforms for each week (e.g. Total Week 1 Spend, Total Accounts, Total Deposits)</p>
          </div>
        </div>

        <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-[#0AE5D5]/15 text-[#0AE5D5] border border-[#0AE5D5]/40 shadow-sm">
          Auto Summed By Week
        </span>
      </div>

      {/* Aggregated Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-700/80 shadow-inner">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#071322]/90 text-slate-300 uppercase tracking-wider font-extrabold border-b border-slate-700">
              <th className="p-3.5 text-[#33CCFF]">Aggregated Week</th>
              <th className="p-3.5 text-slate-300">Platforms Included</th>
              <th className="p-3.5 text-white">Total Spend ($)</th>
              <th className="p-3.5 text-[#33CCFF]">Total Leads</th>
              <th className="p-3.5 text-[#0AE5D5]">Avg CPL ($)</th>
              <th className="p-3.5 text-slate-200">Total Accounts</th>
              <th className="p-3.5 text-sky-300">Total FTDs</th>
              <th className="p-3.5 text-[#0AE5D5]">Total Net Deposit ($)</th>
              <th className="p-3.5 text-[#33CCFF]">Total Lots</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60 bg-[#0C2038]/90">
            {aggregatedList.map((g, idx) => {
              const avgCpl = g.leads > 0 ? (g.spend / g.leads) : 0;
              return (
                <tr key={idx} className="hover:bg-[#1E375E]/50 transition">
                  <td className="p-3.5 font-black text-[#0AE5D5] font-mono text-sm">
                    {g.displayWeek}
                  </td>
                  <td className="p-3.5 text-slate-300">
                    <span className="text-[11px] px-2.5 py-1 rounded-lg bg-[#071322] border border-slate-700 font-mono font-medium text-slate-200">
                      {g.channels.length > 0 ? g.channels.join(' + ') : 'All Platforms'}
                    </span>
                  </td>
                  <td className="p-3.5 font-extrabold font-mono text-white text-sm">
                    ${g.spend.toLocaleString()}
                  </td>
                  <td className="p-3.5 font-extrabold font-mono text-[#33CCFF] text-sm">
                    {g.leads.toLocaleString()}
                  </td>
                  <td className="p-3.5 font-extrabold font-mono text-[#0AE5D5] text-sm">
                    ${avgCpl.toFixed(2)}
                  </td>
                  <td className="p-3.5 font-bold font-mono text-slate-200">
                    {g.accountOpened.toLocaleString()}
                  </td>
                  <td className="p-3.5 font-extrabold font-mono text-sky-300">
                    {g.ftd.toLocaleString()}
                  </td>
                  <td className="p-3.5 font-black font-mono text-[#0AE5D5] text-sm">
                    ${g.netDeposit.toLocaleString()}
                  </td>
                  <td className="p-3.5 font-extrabold font-mono text-[#33CCFF]">
                    {g.lots.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
