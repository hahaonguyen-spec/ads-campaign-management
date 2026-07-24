import React, { useState } from 'react';
import { 
  DollarSign, Users, Target, TrendingUp, Layers, Globe, Filter, Plus, 
  Rocket, CalendarClock, PlusCircle, BarChart2, CheckCircle2
} from 'lucide-react';
import CampaignCard from './CampaignCard';
import KPIChart from './KPIChart';
import { computeGlobalAnalytics } from '../utils/analytics';

export default function Dashboard({ 
  campaigns = [], 
  onSelectCampaign, 
  onDeleteCampaign,
  onOpenUpload,
  onOpenMetricInput,
  searchTerm,
  setSearchTerm
}) {
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Launching', 'Planned'
  const [regionFilter, setRegionFilter] = useState('All');

  // Compute global aggregated statistics
  const analytics = computeGlobalAnalytics(campaigns);

  // Categorize campaigns
  const launchingCampaigns = campaigns.filter(c => c.overview?.status === 'Launching' || (c.kpiTracking && c.kpiTracking.length > 0));
  const plannedCampaigns = campaigns.filter(c => c.overview?.status === 'Planned' && (!c.kpiTracking || c.kpiTracking.length === 0));

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = !searchTerm || 
      c.overview?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.overview?.owner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.overview?.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.overview?.channels?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === 'Launching') {
      matchesStatus = c.overview?.status === 'Launching' || (c.kpiTracking && c.kpiTracking.length > 0);
    } else if (statusFilter === 'Planned') {
      matchesStatus = c.overview?.status === 'Planned' && (!c.kpiTracking || c.kpiTracking.length === 0);
    }

    const matchesRegion = regionFilter === 'All' || c.overview?.region?.includes(regionFilter);

    return matchesSearch && matchesStatus && matchesRegion;
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-slate-900 via-dark-800 to-amber-950/40 border border-slate-800 shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
              <Rocket className="w-3.5 h-3.5 text-emerald-400" />
              {launchingCampaigns.length} Launching Campaigns
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
              <CalendarClock className="w-3.5 h-3.5 text-amber-400" />
              {plannedCampaigns.length} Planned Campaigns
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            CPT <span className="gradient-gold-text">Campaign Tracking</span> & Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Review expected outcomes for <strong>Planned</strong> campaigns and track live results for <strong>Launching</strong> campaigns. Log metrics weekly to update actual performance.
          </p>
        </div>
      </div>

      {/* Global Executive KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Spend & Budget */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Total Campaign Spend</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black font-mono text-white">
              ${analytics.totalSpend.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              / ${analytics.totalBudget.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full gradient-gold-bg rounded-full" 
              style={{ width: `${analytics.totalBudget > 0 ? Math.min(100, (analytics.totalSpend / analytics.totalBudget) * 100) : 0}%` }}
            ></div>
          </div>
        </div>

        {/* Total Leads & CPL */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Acquired Leads & CPL</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black font-mono text-amber-400">
              {analytics.totalLeads.toLocaleString()}
            </span>
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              CPL: ${analytics.avgCpl.toFixed(2)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {analytics.totalAccountsOpened.toLocaleString()} Accounts Opened
          </p>
        </div>

        {/* FTDs & Cost Per FTD */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>First Time Depositors (FTD)</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black font-mono text-blue-400">
              {analytics.totalFtd.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-300">
              {analytics.ftdConversionRate.toFixed(1)}% Conversion
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Cost/FTD: ${analytics.totalFtd > 0 ? (analytics.totalSpend / analytics.totalFtd).toFixed(2) : '0.00'}
          </p>
        </div>

        {/* Total Net Deposit & Lots */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Net Deposit & Traded Lots</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black font-mono text-purple-400">
              ${analytics.totalNetDeposit.toLocaleString()}
            </span>
            <span className="text-xs font-mono font-bold text-rose-400">
              {analytics.totalLots.toLocaleString()} Lots
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Gross Deposit: ${analytics.totalGrossDeposit.toLocaleString()}
          </p>
        </div>

      </div>

      {/* Global Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-amber-400" />
            Live Performance Trend (Weekly Results)
          </h3>
          <KPIChart data={analytics.weeklyPerformanceTrend} type="weeklyTrend" />
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            Channel Breakdown (Spend vs Leads)
          </h3>
          <KPIChart data={analytics.channelBreakdown} type="channelBreakdown" />
        </div>
      </div>

      {/* Campaign Library Section with Status Tabs */}
      <div className="space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                statusFilter === 'All'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>All Campaigns</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 text-[10px]">
                {campaigns.length}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('Launching')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                statusFilter === 'Launching'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <Rocket className="w-3.5 h-3.5 text-emerald-400" />
              <span>Launching (Live Results)</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px]">
                {launchingCampaigns.length}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('Planned')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                statusFilter === 'Planned'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <CalendarClock className="w-3.5 h-3.5 text-amber-400" />
              <span>Planned (Expected Target)</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 text-[10px]">
                {plannedCampaigns.length}
              </span>
            </button>
          </div>

          {/* Region & Actions */}
          <div className="flex items-center gap-3">
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500/50"
            >
              <option value="All">All Regions</option>
              <option value="SEA">SEA</option>
              <option value="LatAm">LatAm</option>
              <option value="Global">Global</option>
            </select>

            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold gradient-gold-bg text-dark-900 hover:brightness-110 transition shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Campaign Form</span>
            </button>
          </div>

        </div>

        {/* Campaign Cards Grid */}
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCampaigns.map(c => (
              <CampaignCard
                key={c.id}
                campaign={c}
                onSelect={onSelectCampaign}
                onDelete={onDeleteCampaign}
                onOpenMetricInput={onOpenMetricInput}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-3">
            <CalendarClock className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="text-base font-bold text-white">No {statusFilter} Campaigns Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Upload a campaign Excel brief to add new planned or launching campaigns.
            </p>
            <button
              onClick={onOpenUpload}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold gradient-gold-bg text-dark-900 hover:brightness-110 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Excel Form</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
