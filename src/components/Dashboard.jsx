import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, Users, Target, Rocket, CalendarClock, 
  Search, Plus, LayoutGrid, List, ChevronRight, Eye, Trash2, ArrowUpRight, Zap, Calculator
} from 'lucide-react';
import CampaignCard from './CampaignCard';
import WeeklyAggregationTable from './WeeklyAggregationTable';
import { calculateOverallAnalytics } from '../utils/analytics';

export default function Dashboard({ 
  campaigns = [], 
  onSelectCampaign, 
  onDeleteCampaign, 
  onOpenUpload, 
  onOpenMetricInput, 
  searchTerm, 
  setSearchTerm 
}) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

  const analytics = calculateOverallAnalytics(campaigns);

  // Combine all KPI rows across all campaigns for global weekly aggregation on main dashboard
  const allKpiRows = (campaigns || []).flatMap(c => c.kpiTracking || []);

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(c => {
    const statusMatch = statusFilter === 'All' ? true : 
                        statusFilter === 'Launching' ? (c.overview?.status === 'Launching' || (c.kpiTracking && c.kpiTracking.some(r => Number(r.spend) > 0))) :
                        c.overview?.status === statusFilter;

    const regionMatch = regionFilter === 'All' ? true : 
                        (c.overview?.region || '').toLowerCase().includes(regionFilter.toLowerCase());

    const searchMatch = !searchTerm ? true : 
                        (c.overview?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (c.overview?.owner || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (c.overview?.region || '').toLowerCase().includes(searchTerm.toLowerCase());

    return statusMatch && regionMatch && searchMatch;
  });

  const regionsList = Array.from(new Set(campaigns.map(c => c.overview?.region).filter(Boolean)));

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* MOBILE SEARCH BAR (< md screens) */}
      <div className="block md:hidden">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search campaigns by name, region..."
            className="w-full bg-[#0C2038] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0AE5D5]"
          />
        </div>
      </div>

      {/* EXECUTIVE KPI OVERVIEW CARDS (Brand Cyan/Turquoise & Deep Navy Theme) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Spend */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-[#33CCFF]/30 glass-panel-hover space-y-2.5 relative overflow-hidden bg-gradient-to-b from-[#112037] to-[#0C2038]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#33CCFF]/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold uppercase tracking-wider text-xs text-slate-200">Total Spends</span>
            <div className="p-2.5 rounded-xl bg-[#33CCFF]/15 text-[#33CCFF] border border-[#33CCFF]/30">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">${analytics.totalSpend?.toLocaleString()}</span>
            <span className="text-xs sm:text-sm font-mono text-[#0AE5D5] font-extrabold bg-[#0AE5D5]/10 px-2 py-0.5 rounded-md border border-[#0AE5D5]/30">Active Ads</span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Across <strong className="text-slate-200">{analytics.activeCount}</strong> live campaigns
          </div>
        </div>

        {/* Card 2: Total CRM Leads */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-[#0AE5D5]/30 glass-panel-hover space-y-2.5 relative overflow-hidden bg-gradient-to-b from-[#112037] to-[#0C2038]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#0AE5D5]/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold uppercase tracking-wider text-xs text-slate-200">Total CRM Leads</span>
            <div className="p-2.5 rounded-xl bg-[#0AE5D5]/15 text-[#0AE5D5] border border-[#0AE5D5]/30">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#33CCFF] tracking-tight">{analytics.totalLeads?.toLocaleString()}</span>
            <span className="text-xs sm:text-sm font-mono font-extrabold text-[#0AE5D5] bg-[#0AE5D5]/10 px-2 py-0.5 rounded-md border border-[#0AE5D5]/30">${analytics.overallCpl?.toFixed(2)} CPL</span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Verified leads in CRM
          </div>
        </div>

        {/* Card 3: First Time Depositors (FTD) */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-sky-500/30 glass-panel-hover space-y-2.5 relative overflow-hidden bg-gradient-to-b from-[#112037] to-[#0C2038]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold uppercase tracking-wider text-xs text-slate-200">Total FTDs (Traders)</span>
            <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-300 border border-sky-500/30">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <span className="text-2xl sm:text-3xl font-black font-mono text-sky-200 tracking-tight">{analytics.totalFtd?.toLocaleString()}</span>
            <span className="text-xs sm:text-sm font-mono font-extrabold text-[#33CCFF] bg-[#33CCFF]/10 px-2 py-0.5 rounded-md border border-[#33CCFF]/30">${analytics.overallCostPerFtd?.toFixed(2)} /FTD</span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Conversion: <strong className="text-sky-300">{analytics.ftdConversionRate}%</strong>
          </div>
        </div>

        {/* Card 4: Net Margin Income (NMI) */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-[#0AE5D5]/40 glass-panel-hover space-y-2.5 relative overflow-hidden bg-gradient-to-b from-[#112037] to-[#0C2038] cpt-glow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#0AE5D5]/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-black uppercase tracking-wider text-xs text-[#0AE5D5]">NMI Net Revenue</span>
            <div className="p-2.5 rounded-xl gradient-cpt-brand text-[#071322] shadow font-black">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#0AE5D5] tracking-tight">${analytics.totalNmi?.toLocaleString()}</span>
            <span className="text-xs sm:text-sm font-mono font-extrabold text-[#33CCFF]">Dep: ${analytics.totalNetDeposit?.toLocaleString()}</span>
          </div>
          <div className="text-xs text-[#0AE5D5] font-mono font-bold">
            CPT Net Revenue Return
          </div>
        </div>

      </div>

      {/* AUTOMATED WEEKLY SUBTOTAL SUMMARY TABLE ON MAIN DASHBOARD */}
      {allKpiRows.length > 0 && (
        <WeeklyAggregationTable kpiRows={allKpiRows} />
      )}

      {/* FILTER TABS & TOP-RIGHT VIEW MODE SWITCHER */}
      <div className="glass-panel p-4 rounded-2xl border border-[#33CCFF]/20 bg-[#0C2038]/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              statusFilter === 'All'
                ? 'gradient-cpt-brand text-[#071322] font-black shadow-md'
                : 'bg-[#071322] text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <span>All Campaigns</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/40 text-white font-mono">
              {campaigns.length}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('Launching')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              statusFilter === 'Launching'
                ? 'bg-[#0AE5D5]/20 text-[#0AE5D5] border border-[#0AE5D5]/40 shadow-sm'
                : 'bg-[#071322] text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-[#0AE5D5]" />
            <span>Launching (Live Results)</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-[#0AE5D5]/30 text-[#0AE5D5] font-mono">
              {campaigns.filter(c => c.overview?.status === 'Launching' || (c.kpiTracking && c.kpiTracking.some(r => Number(r.spend) > 0))).length}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('Planned')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              statusFilter === 'Planned'
                ? 'bg-[#33CCFF]/20 text-[#33CCFF] border border-[#33CCFF]/40 shadow-sm'
                : 'bg-[#071322] text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <CalendarClock className="w-3.5 h-3.5 text-[#33CCFF]" />
            <span>Planned (Expected Target)</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-[#33CCFF]/30 text-[#33CCFF] font-mono">
              {campaigns.filter(c => c.overview?.status === 'Planned' && (!c.kpiTracking || !c.kpiTracking.some(r => Number(r.spend) > 0))).length}
            </span>
          </button>
        </div>

        {/* TOP-RIGHT CONTROLS: Region Filter & Box/List View Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Region Dropdown */}
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-[#071322] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-[#0AE5D5]"
          >
            <option value="All">All Regions</option>
            {regionsList.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* VIEW SWITCHER: BOX GRID VS LIST VIEW */}
          <div className="flex items-center p-1 rounded-xl bg-[#071322] border border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              title="Box / Grid View"
              className={`p-1.5 rounded-lg transition flex items-center gap-1 text-xs font-bold ${
                viewMode === 'grid'
                  ? 'gradient-cpt-brand text-[#071322] shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Box</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              title="List View"
              className={`p-1.5 rounded-lg transition flex items-center gap-1 text-xs font-bold ${
                viewMode === 'list'
                  ? 'gradient-cpt-brand text-[#071322] shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          {/* Upload Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black gradient-cpt-brand text-[#071322] hover:brightness-110 shadow-lg shadow-[#0AE5D5]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Form</span>
          </button>

        </div>

      </div>

      {/* CAMPAIGNS CONTENT (RENDER BOX GRID OR LIST VIEW) */}
      {filteredCampaigns.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-4 bg-[#0C2038]/80">
          <div className="p-4 rounded-full bg-[#071322] text-[#0AE5D5] w-16 h-16 mx-auto flex items-center justify-center border border-slate-700">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No CPT Campaigns Found</h3>
            <p className="text-xs text-slate-400 mt-1">Upload your CPT Ads Campaign form (.xlsx) or adjust filters to view live data.</p>
          </div>
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black gradient-cpt-brand text-[#071322] shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Campaign Form</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* 1. DẠNG BOX (GRID VIEW) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {filteredCampaigns.map(campaign => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onSelect={() => onSelectCampaign(campaign)}
              onDelete={() => onDeleteCampaign(campaign.id)}
              onOpenMetricInput={() => onOpenMetricInput(campaign)}
            />
          ))}
        </div>

      ) : (

        /* 2. DẠNG LIST (LIST VIEW) */
        <div className="glass-panel rounded-2xl border border-slate-700 overflow-hidden animate-fadeIn bg-[#0C2038]/90">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#071322]/90 text-slate-300 border-b border-slate-700 uppercase tracking-wider font-extrabold">
                  <th className="p-4 min-w-[240px]">Campaign Name</th>
                  <th className="p-4 w-32">Status</th>
                  <th className="p-4 w-36">Region / Audience</th>
                  <th className="p-4 w-28">Spend ($)</th>
                  <th className="p-4 w-24 text-[#33CCFF]">Leads</th>
                  <th className="p-4 w-24 text-[#0AE5D5]">CPL ($)</th>
                  <th className="p-4 w-24 text-sky-300">FTD</th>
                  <th className="p-4 w-28 text-[#0AE5D5]">Net Dep ($)</th>
                  <th className="p-4 w-28 text-center">Progress %</th>
                  <th className="p-4 w-28 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredCampaigns.map(campaign => {
                  const { overview = {}, kpiTracking = [] } = campaign;
                  const totalSpend = kpiTracking.reduce((a, b) => a + (Number(b.spend) || 0), 0);
                  const totalLeads = kpiTracking.reduce((a, b) => a + (Number(b.leads) || 0), 0);
                  const totalFtd = kpiTracking.reduce((a, b) => a + (Number(b.ftd) || 0), 0);
                  const totalNetDeposit = kpiTracking.reduce((a, b) => a + (Number(b.netDeposit) || 0), 0);
                  const avgCpl = totalLeads > 0 ? totalSpend / totalLeads : 0;
                  const targetLeads = overview.expectedTargets?.targetLeads || 1000;
                  const progressPct = targetLeads > 0 ? Math.min(100, Math.round((totalLeads / targetLeads) * 100)) : 0;

                  const isLive = overview.status === 'Launching' || totalSpend > 0;

                  return (
                    <tr key={campaign.id} className="hover:bg-[#1E375E]/50 transition">
                      
                      {/* Campaign Name */}
                      <td className="p-4">
                        <div
                          onClick={() => onSelectCampaign(campaign)}
                          className="font-extrabold text-white text-sm hover:text-[#0AE5D5] cursor-pointer flex items-center gap-1.5 group"
                        >
                          <span>{overview.name || 'Untitled Campaign'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#0AE5D5] transition" />
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {overview.type} • {overview.owner}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border flex items-center gap-1 w-fit ${
                          isLive 
                            ? 'bg-[#0AE5D5]/20 text-[#0AE5D5] border-[#0AE5D5]/40' 
                            : 'bg-[#33CCFF]/20 text-[#33CCFF] border-[#33CCFF]/40'
                        }`}>
                          {isLive ? <Rocket className="w-3 h-3 text-[#0AE5D5]" /> : <CalendarClock className="w-3 h-3 text-[#33CCFF]" />}
                          <span>{isLive ? 'Launching' : 'Planned'}</span>
                        </span>
                      </td>

                      {/* Region */}
                      <td className="p-4">
                        <span className="text-slate-200 font-medium block">{overview.region || 'Global'}</span>
                        <span className="text-[10px] text-slate-400 block">{overview.targetAudience}</span>
                      </td>

                      {/* Spend */}
                      <td className="p-4 font-mono font-extrabold text-white">
                        ${totalSpend.toLocaleString()}
                      </td>

                      {/* Leads */}
                      <td className="p-4 font-mono font-extrabold text-[#33CCFF]">
                        {totalLeads.toLocaleString()}
                      </td>

                      {/* CPL */}
                      <td className="p-4 font-mono font-extrabold text-[#0AE5D5]">
                        ${avgCpl.toFixed(2)}
                      </td>

                      {/* FTD */}
                      <td className="p-4 font-mono font-extrabold text-sky-300">
                        {totalFtd.toLocaleString()}
                      </td>

                      {/* Net Deposit */}
                      <td className="p-4 font-mono font-black text-[#0AE5D5]">
                        ${totalNetDeposit.toLocaleString()}
                      </td>

                      {/* Progress % */}
                      <td className="p-4 text-center">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-[#071322] rounded-full h-1.5 overflow-hidden border border-slate-700">
                            <div className="h-full gradient-cpt-brand rounded-full" style={{ width: `${progressPct}%` }}></div>
                          </div>
                          <span className="text-[11px] font-mono font-extrabold text-[#0AE5D5]">{progressPct}%</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onSelectCampaign(campaign)}
                            className="p-1.5 rounded-lg bg-[#071322] hover:bg-[#1E375E] text-slate-200 border border-slate-700 transition"
                            title="View Campaign Workspace"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#0AE5D5]" />
                          </button>
                          <button
                            onClick={() => onDeleteCampaign(campaign.id)}
                            className="p-1.5 rounded-lg bg-[#071322] hover:bg-[#1E375E] text-slate-400 hover:text-red-400 border border-slate-700 transition"
                            title="Delete Campaign"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      )}

    </div>
  );
}
