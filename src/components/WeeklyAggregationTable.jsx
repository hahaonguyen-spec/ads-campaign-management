import React from 'react';
import { Layers, Calculator, TrendingUp } from 'lucide-react';

export default function WeeklyAggregationTable({ kpiRows = [] }) {
  // Aggregate rows by week name (case-insensitive trim)
  const groupMap = {};

  kpiRows.forEach(row => {
    const rawWk = (row.week || 'Unspecified').trim();
    // Normalize key for grouping
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

  if (aggregatedList.length === 0) return null;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Automated Weekly Subtotal Summary</h3>
        </div>
        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
          Auto Summed by Week
        </span>
      </div>

      <p className="text-xs text-slate-300">
        Automatically sums up metrics across all ad platforms for each week (e.g. Total Week 1 Spend, Total Week 1 Accounts, Total Week 1 Deposits, etc.):
      </p>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <th className="p-3">Aggregated Week</th>
              <th className="p-3">Platforms Included</th>
              <th className="p-3">Total Spend ($)</th>
              <th className="p-3 text-amber-400">Total Leads</th>
              <th className="p-3 text-emerald-400">Avg CPL ($)</th>
              <th className="p-3 text-slate-200">Total Accounts</th>
              <th className="p-3 text-blue-400">Total FTDs</th>
              <th className="p-3 text-purple-400">Total Net Deposit ($)</th>
              <th className="p-3 text-rose-400">Total Lots</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 bg-slate-950/60">
            {aggregatedList.map((g, idx) => {
              const avgCpl = g.leads > 0 ? (g.spend / g.leads) : 0;
              return (
                <tr key={idx} className="hover:bg-slate-900/60 transition">
                  <td className="p-3 font-extrabold text-amber-400 font-mono">
                    {g.displayWeek}
                  </td>
                  <td className="p-3 text-slate-300">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono">
                      {g.channels.length > 0 ? g.channels.join(' + ') : 'All Platforms'}
                    </span>
                  </td>
                  <td className="p-3 font-bold font-mono text-white">
                    ${g.spend.toLocaleString()}
                  </td>
                  <td className="p-3 font-bold font-mono text-amber-400">
                    {g.leads.toLocaleString()}
                  </td>
                  <td className="p-3 font-bold font-mono text-emerald-400">
                    ${avgCpl.toFixed(2)}
                  </td>
                  <td className="p-3 font-bold font-mono text-slate-200">
                    {g.accountOpened.toLocaleString()}
                  </td>
                  <td className="p-3 font-bold font-mono text-blue-400">
                    {g.ftd.toLocaleString()}
                  </td>
                  <td className="p-3 font-extrabold font-mono text-purple-400">
                    ${g.netDeposit.toLocaleString()}
                  </td>
                  <td className="p-3 font-bold font-mono text-rose-400">
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
