import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, Users, Target, Rocket, CalendarClock, 
  Search, Plus, LayoutGrid, List, ChevronRight, Eye, Trash2, ArrowUpRight, Zap
} from 'lucide-react';
import CampaignCard from './CampaignCard';
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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (box) or 'list'

  const analytics = calculateOverallAnalytics(campaigns);

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
      
      {/* EXECUTIVE KPI OVERVIEW CARDS (CPT Emerald Gradient Theme) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Spend */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 glass-panel-hover space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Total Spends</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">${analytics.totalSpend?.toLocaleString()}</span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">Active Ads</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Across {analytics.activeCount} live campaigns
          </div>
        </div>

        {/* Card 2: Total CRM Leads */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 glass-panel-hover space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Total CRM Leads</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-amber-400">{analytics.totalLeads?.toLocaleString()}</span>
            <span className="text-[11px] font-mono font-bold text-emerald-400">${analytics.overallCpl?.toFixed(2)} Avg CPL</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Verified in CRM
          </div>
        </div>

        {/* Card 3: First Time Depositors (FTD) */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 glass-panel-hover space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Total FTDs (Traders)</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-blue-300">{analytics.totalFtd?.toLocaleString()}</span>
            <span className="text-[11px] font-mono font-bold text-blue-400">${analytics.overallCostPerFtd?.toFixed(2)} Cost/FTD</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Conversion: {analytics.ftdConversionRate}%
          </div>
        </div>

        {/* Card 4: Net Margin Income (NMI) */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 glass-panel-hover space-y-2 relative overflow-hidden bg-gradient-to-b from-emerald-950/30 to-slate-900/60">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-emerald-400">NMI Net Revenue</span>
            <div className="p-2 rounded-xl gradient-emerald-bg text-white shadow">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-emerald-400">${analytics.totalNmi?.toLocaleString()}</span>
            <span className="text-[11px] font-mono font-bold text-purple-300">Dep: ${analytics.totalNetDeposit?.toLocaleString()}</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono font-semibold">
            CPT Margin Revenue
          </div>
        </div>

      </div>

      {/* FILTER TABS & TOP-RIGHT VIEW MODE SWITCHER */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              statusFilter === 'All'
                ? 'gradient-emerald-bg text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>All Campaigns</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 text-white font-mono">
              {campaigns.length}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('Launching')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              statusFilter === 'Launching'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-emerald-400" />
            <span>Launching (Live Results)</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/30 text-emerald-300 font-mono">
              {campaigns.filter(c => c.overview?.status === 'Launching' || (c.kpiTracking && c.kpiTracking.some(r => Number(r.spend) > 0))).length}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('Planned')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              statusFilter === 'Planned'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <CalendarClock className="w-3.5 h-3.5 text-amber-400" />
            <span>Planned (Expected Target)</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/30 text-amber-300 font-mono">
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
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Regions</option>
            {regionsList.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* VIEW SWITCHER: BOX GRID VS LIST VIEW */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              title="Box / Grid View"
              className={`p-1.5 rounded-lg transition flex items-center gap-1 text-xs font-semibold ${
                viewMode === 'grid'
                  ? 'gradient-emerald-bg text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Box</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              title="List View"
              className={`p-1.5 rounded-lg transition flex items-center gap-1 text-xs font-semibold ${
                viewMode === 'list'
                  ? 'gradient-emerald-bg text-white shadow'
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold gradient-emerald-bg text-white hover:brightness-110 shadow-lg shadow-emerald-900/20"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Form</span>
          </button>

        </div>

      </div>

      {/* CAMPAIGNS CONTENT (RENDER BOX GRID OR LIST VIEW) */}
      {filteredCampaigns.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-4">
          <div className="p-4 rounded-full bg-slate-900 text-slate-500 w-16 h-16 mx-auto flex items-center justify-center border border-slate-800">
            <Search className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No CPT Campaigns Found</h3>
            <p className="text-xs text-slate-400 mt-1">Upload your CPT Ads Campaign form (.xlsx) or adjust filters to view live data.</p>
          </div>
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold gradient-emerald-bg text-white shadow-lg"
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
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                  <th className="p-4 min-w-[240px]">Campaign Name</th>
                  <th className="p-4 w-32">Status</th>
                  <th className="p-4 w-36">Region / Audience</th>
                  <th className="p-4 w-28">Spend ($)</th>
                  <th className="p-4 w-24 text-amber-400">Leads</th>
                  <th className="p-4 w-24 text-emerald-400">CPL ($)</th>
                  <th className="p-4 w-24 text-blue-400">FTD</th>
                  <th className="p-4 w-28 text-purple-400">Net Dep ($)</th>
                  <th className="p-4 w-28 text-center">Progress %</th>
                  <th className="p-4 w-28 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
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
                    <tr key={campaign.id} className="hover:bg-slate-800/40 transition">
                      
                      {/* Campaign Name */}
                      <td className="p-4">
                        <div
                          onClick={() => onSelectCampaign(campaign)}
                          className="font-bold text-white text-sm hover:text-emerald-400 cursor-pointer flex items-center gap-1.5 group"
                        >
                          <span>{overview.name || 'Untitled Campaign'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {overview.type} • {overview.owner}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border flex items-center gap-1 w-fit ${
                          isLive 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}>
                          {isLive ? <Rocket className="w-3 h-3 text-emerald-400" /> : <CalendarClock className="w-3 h-3 text-amber-400" />}
                          <span>{isLive ? 'Launching' : 'Planned'}</span>
                        </span>
                      </td>

                      {/* Region */}
                      <td className="p-4">
                        <span className="text-slate-300 font-medium block">{overview.region || 'Global'}</span>
                        <span className="text-[10px] text-slate-500 block">{overview.targetAudience}</span>
                      </td>

                      {/* Spend */}
                      <td className="p-4 font-mono font-bold text-white">
                        ${totalSpend.toLocaleString()}
                      </td>

                      {/* Leads */}
                      <td className="p-4 font-mono font-bold text-amber-400">
                        {totalLeads.toLocaleString()}
                      </td>

                      {/* CPL */}
                      <td className="p-4 font-mono font-bold text-emerald-400">
                        ${avgCpl.toFixed(2)}
                      </td>

                      {/* FTD */}
                      <td className="p-4 font-mono font-bold text-blue-400">
                        {totalFtd.toLocaleString()}
                      </td>

                      {/* Net Deposit */}
                      <td className="p-4 font-mono font-bold text-purple-400">
                        ${totalNetDeposit.toLocaleString()}
                      </td>

                      {/* Progress % */}
                      <td className="p-4 text-center">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full gradient-emerald-bg rounded-full" style={{ width: `${progressPct}%` }}></div>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-emerald-400">{progressPct}%</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onSelectCampaign(campaign)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                            title="View Campaign Workspace"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          </button>
                          <button
                            onClick={() => onDeleteCampaign(campaign.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 border border-slate-700 transition"
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
