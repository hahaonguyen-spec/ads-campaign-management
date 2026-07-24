import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, User, Globe, DollarSign, Target, Copy, Check, 
  ExternalLink, Layers, ShieldAlert, FileText, CheckCircle2, Clock, 
  Plus, Save, BarChart3, Rocket, CalendarClock, PlusCircle, Trash2, Edit3, Sparkles, TrendingUp, Zap, ShieldCheck
} from 'lucide-react';
import KPIChart from './KPIChart';
import AIInsights from './AIInsights';
import AdPluginModal from './AdPluginModal';

export default function CampaignDetail({ campaign, onBack, onUpdateCampaign, onOpenMetricInput }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [isAdPluginOpen, setIsAdPluginOpen] = useState(false);
  
  // Local state for KPI, Timeline & Deliverables editing
  const [kpiRows, setKpiRows] = useState(() => {
    if (campaign && campaign.kpiTracking && campaign.kpiTracking.length > 0) {
      return campaign.kpiTracking;
    }
    return [
      { week: 'Week 1', channel: 'Meta Ads Plugin', spend: 0, impressions: 0, clicks: 0, leads: 0, cpl: 0, accountOpened: 0, kyc: 0, ftd: 0, ftt: 0, grossDeposit: 0, netDeposit: 0, lots: 0, nmi: 0 },
      { week: 'Week 2', channel: 'Meta Ads Plugin', spend: 0, impressions: 0, clicks: 0, leads: 0, cpl: 0, accountOpened: 0, kyc: 0, ftd: 0, ftt: 0, grossDeposit: 0, netDeposit: 0, lots: 0, nmi: 0 },
      { week: 'Week 3', channel: 'Google Ads Plugin', spend: 0, impressions: 0, clicks: 0, leads: 0, cpl: 0, accountOpened: 0, kyc: 0, ftd: 0, ftt: 0, grossDeposit: 0, netDeposit: 0, lots: 0, nmi: 0 },
      { week: 'Week 4', channel: 'Google Ads Plugin', spend: 0, impressions: 0, clicks: 0, leads: 0, cpl: 0, accountOpened: 0, kyc: 0, ftd: 0, ftt: 0, grossDeposit: 0, netDeposit: 0, lots: 0, nmi: 0 }
    ];
  });

  const [deliverablesList, setDeliverablesList] = useState(campaign?.deliverables || []);
  const [timelineList, setTimelineList] = useState(campaign?.timeline || []);

  const { overview = {}, budget = [], webinarTracking } = campaign || {};

  const isPlanned = overview?.status === 'Planned';

  // Calculate actuals
  const totalSpend = kpiRows.reduce((a, b) => a + (Number(b.spend) || 0), 0);
  const totalLeads = kpiRows.reduce((a, b) => a + (Number(b.leads) || 0), 0);
  const totalFtd = kpiRows.reduce((a, b) => a + (Number(b.ftd) || 0), 0);
  const totalGrossDeposit = kpiRows.reduce((a, b) => a + (Number(b.grossDeposit) || 0), 0);
  const totalNetDeposit = kpiRows.reduce((a, b) => a + (Number(b.netDeposit) || 0), 0);
  const totalLots = kpiRows.reduce((a, b) => a + (Number(b.lots) || 0), 0);
  const avgCpl = totalLeads > 0 ? totalSpend / totalLeads : 0;

  // Expected Outcome targets
  const expected = overview?.expectedTargets || {
    targetBudget: overview?.totalBudget || 5000,
    targetLeads: Math.round((overview?.totalBudget || 5000) / 8.0),
    targetCpl: 8.00,
    targetFtd: 50,
    targetNetDeposit: 25000,
    targetLots: 500
  };

  const handleCopyLink = () => {
    if (overview?.trackingLink) {
      navigator.clipboard.writeText(overview.trackingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // KPI cell change
  const handleKpiCellChange = (index, field, value) => {
    const updated = [...kpiRows];
    const numVal = parseFloat(value) || 0;
    updated[index][field] = numVal;

    if (field === 'spend' || field === 'leads') {
      const sp = field === 'spend' ? numVal : updated[index].spend;
      const ld = field === 'leads' ? numVal : updated[index].leads;
      updated[index].cpl = ld > 0 ? Number((sp / ld).toFixed(2)) : 0;
    }

    setKpiRows(updated);

    const hasSpendOrLeads = updated.some(r => (r.spend || 0) > 0 || (r.leads || 0) > 0);
    onUpdateCampaign({
      ...campaign,
      overview: {
        ...campaign.overview,
        status: hasSpendOrLeads ? 'Launching' : campaign.overview.status
      },
      kpiTracking: updated
    });
  };

  const handlePopulateSampleKpi = () => {
    const sampleKpi = [
      { week: 'Week 1', campaign: overview.name, channel: 'Meta Ads Plugin', spend: 2500, impressions: 180000, clicks: 3900, leads: 340, cpl: 7.35, accountOpened: 180, kyc: 120, ftd: 48, ftt: 42, grossDeposit: 24000, netDeposit: 22000, lots: 520, nmi: 14000, syncedFromPlugin: true },
      { week: 'Week 2', campaign: overview.name, channel: 'Meta Ads Plugin', spend: 2800, impressions: 210000, clicks: 4500, leads: 410, cpl: 6.83, accountOpened: 220, kyc: 155, ftd: 62, ftt: 58, grossDeposit: 35000, netDeposit: 31000, lots: 740, nmi: 19000, syncedFromPlugin: true },
      { week: 'Week 3', campaign: overview.name, channel: 'Google Ads Plugin', spend: 3200, impressions: 95000, clicks: 3100, leads: 360, cpl: 8.89, accountOpened: 205, kyc: 140, ftd: 75, ftt: 68, grossDeposit: 52000, netDeposit: 48000, lots: 980, nmi: 26000, syncedFromPlugin: true },
      { week: 'Week 4', campaign: overview.name, channel: 'Google Ads Plugin', spend: 3000, impressions: 90000, clicks: 2900, leads: 330, cpl: 9.09, accountOpened: 190, kyc: 130, ftd: 68, ftt: 61, grossDeposit: 44000, netDeposit: 41000, lots: 860, nmi: 22000, syncedFromPlugin: true }
    ];
    setKpiRows(sampleKpi);
    onUpdateCampaign({
      ...campaign,
      overview: { ...campaign.overview, status: 'Launching' },
      kpiTracking: sampleKpi
    });
  };

  const handleAddKpiWeekRow = () => {
    const newWeekNum = kpiRows.length + 1;
    const newRow = {
      week: `Week ${newWeekNum}`,
      campaign: overview.name,
      channel: 'Meta Ads Plugin',
      spend: 0,
      impressions: 0,
      clicks: 0,
      leads: 0,
      cpl: 0,
      accountOpened: 0,
      kyc: 0,
      ftd: 0,
      ftt: 0,
      grossDeposit: 0,
      netDeposit: 0,
      lots: 0,
      nmi: 0
    };
    const updated = [...kpiRows, newRow];
    setKpiRows(updated);
    onUpdateCampaign({ ...campaign, kpiTracking: updated });
  };

  // Deliverables editing
  const handleDeliverableChange = (idx, field, value) => {
    const updated = [...deliverablesList];
    updated[idx] = { ...updated[idx], [field]: value };
    setDeliverablesList(updated);
    onUpdateCampaign({ ...campaign, deliverables: updated });
  };

  const handleAddDeliverable = () => {
    const newDeliv = {
      id: `deliv_${Date.now()}`,
      deliverable: 'New Asset Item',
      owner: overview.owner || 'Designer',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      link: '#'
    };
    const updated = [...deliverablesList, newDeliv];
    setDeliverablesList(updated);
    onUpdateCampaign({ ...campaign, deliverables: updated });
  };

  const handleDeleteDeliverable = (idx) => {
    const updated = deliverablesList.filter((_, i) => i !== idx);
    setDeliverablesList(updated);
    onUpdateCampaign({ ...campaign, deliverables: updated });
  };

  // Timeline editing
  const handleTimelineChange = (idx, field, value) => {
    const updated = [...timelineList];
    updated[idx] = { ...updated[idx], [field]: value };
    setTimelineList(updated);
    onUpdateCampaign({ ...campaign, timeline: updated });
  };

  const handleAddTimelineTask = () => {
    const newTask = {
      id: `task_${Date.now()}`,
      week: `Week ${timelineList.length + 1}`,
      task: 'New Execution Task',
      owner: overview.owner || 'Team Member',
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
      department: 'Marketing',
      status: 'In Progress'
    };
    const updated = [...timelineList, newTask];
    setTimelineList(updated);
    onUpdateCampaign({ ...campaign, timeline: updated });
  };

  const handleDeleteTimelineTask = (idx) => {
    const updated = timelineList.filter((_, i) => i !== idx);
    setTimelineList(updated);
    onUpdateCampaign({ ...campaign, timeline: updated });
  };

  const handleToggleStatus = () => {
    const newStatus = overview?.status === 'Planned' ? 'Launching' : 'Planned';
    onUpdateCampaign({
      ...campaign,
      overview: { ...campaign.overview, status: newStatus }
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-xl font-extrabold text-white">{overview?.name || 'Untitled Campaign'}</h2>
              
              <button
                onClick={handleToggleStatus}
                title="Click to toggle Planned / Launching status"
                className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border transition cursor-pointer flex items-center gap-1 ${
                  isPlanned 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' 
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                }`}
              >
                {isPlanned ? <CalendarClock className="w-3 h-3 text-amber-400" /> : <Rocket className="w-3 h-3 text-emerald-400" />}
                <span>{overview?.status || 'Planned'} (Click to toggle)</span>
              </button>

              <span className="text-[10px] font-medium text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
                {overview?.region || 'Global'}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
              <span>Owner: <strong className="text-slate-200 font-medium">{overview?.owner}</strong></span>
              <span>•</span>
              <span>Type: <strong className="text-slate-200 font-medium">{overview?.type}</strong></span>
              <span>•</span>
              <span>Duration: <strong className="text-slate-200 font-medium">{overview?.duration}</strong></span>
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          
          <button
            onClick={() => setIsAdPluginOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Sync Ad Plugin</span>
          </button>

          <button
            onClick={() => onOpenMetricInput(campaign)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold gradient-gold-bg text-dark-900 hover:brightness-110 transition shadow-md"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Fill CRM Verified Data</span>
          </button>

          {overview?.trackingLink && (
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-200 hover:border-amber-500/50 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Target vs Actual Comparison Gauge Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 bg-slate-900/80">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Expected Outcome Targets vs Current Results</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {isPlanned ? 'Status: Planned (Expected Outcome View)' : 'Status: Live Launching'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Budget ($)</span>
            <span className="text-xs font-bold font-mono text-white block">Actual: ${totalSpend.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block font-mono">Target: ${expected.targetBudget.toLocaleString()}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Leads</span>
            <span className="text-xs font-bold font-mono text-amber-400 block">Actual: {totalLeads.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block font-mono">Target: {expected.targetLeads.toLocaleString()}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">CPL ($)</span>
            <span className="text-xs font-bold font-mono text-emerald-400 block">Actual: ${avgCpl.toFixed(2)}</span>
            <span className="text-[10px] text-slate-400 block font-mono">Target: ${expected.targetCpl.toFixed(2)}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">FTDs</span>
            <span className="text-xs font-bold font-mono text-blue-400 block">Actual: {totalFtd.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block font-mono">Target: {expected.targetFtd.toLocaleString()}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Net Deposit ($)</span>
            <span className="text-xs font-bold font-mono text-purple-400 block">Actual: ${totalNetDeposit.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block font-mono">Target: ${expected.targetNetDeposit.toLocaleString()}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Lots (Volume)</span>
            <span className="text-xs font-bold font-mono text-rose-400 block">Actual: {totalLots.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block font-mono">Target: {expected.targetLots.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* AI Diagnostic Insights */}
      <AIInsights campaign={{ ...campaign, kpiTracking: kpiRows }} />

      {/* Tabs Header */}
      <div className="flex border-b border-slate-800 overflow-x-auto gap-2 text-xs font-semibold scrollbar-none">
        {[
          { id: 'overview', label: 'Brief & Strategy', icon: <FileText className="w-4 h-4" /> },
          { id: 'kpi', label: `KPI Performance Matrix (${kpiRows.length} Weeks)`, icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'timeline', label: `Execution Schedule (${timelineList.length})`, icon: <Clock className="w-4 h-4" /> },
          { id: 'deliverables', label: `Deliverables (${deliverablesList.length})`, icon: <CheckCircle2 className="w-4 h-4" /> },
          { id: 'budget', label: 'Budget Allocations', icon: <DollarSign className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-amber-400 text-amber-400 bg-amber-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}

      {/* TAB 1: OVERVIEW BRIEF */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Target className="w-4 h-4 text-amber-400" />
                Expected Target Outcome & Primary KPI
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                  <span className="text-amber-400 uppercase tracking-wider text-[10px] block font-bold">Target Leads & CPL</span>
                  <p className="text-white font-bold leading-relaxed">
                    {expected.targetLeads.toLocaleString()} Leads @ ${expected.targetCpl.toFixed(2)} Target CPL
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-1">
                  <span className="text-blue-400 uppercase tracking-wider text-[10px] block font-bold">Expected Traders (FTDs)</span>
                  <p className="text-white font-bold leading-relaxed">
                    {expected.targetFtd.toLocaleString()} FTDs & ${expected.targetNetDeposit.toLocaleString()} Expected Deposit
                  </p>
                </div>

                <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-semibold">Strategic Objective</span>
                  <p className="text-slate-200 leading-relaxed font-medium">{overview.objective}</p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Layers className="w-4 h-4 text-blue-400" />
                Campaign Mechanics & Conversion Funnel
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1 font-semibold">Campaign Mechanics:</span>
                  <p className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 leading-relaxed">
                    {overview.mechanics}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1 font-semibold">User Journey Steps:</span>
                  <p className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-amber-300 font-medium leading-relaxed">
                    {overview.userJourney}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Campaign Parameters</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Request Date</span>
                  <span className="font-semibold text-slate-200">{overview.requestDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Ad Platforms / Channels</span>
                  <span className="font-semibold text-slate-200">{overview.channels}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Total Allocated Budget</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">${overview.totalBudget?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KPI PERFORMANCE MATRIX (SEPARATED INTO PLUGIN AUTO-SYNC VS CRM VERIFICATION) */}
      {activeTab === 'kpi' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Trend Chart */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Weekly Performance Trend Visualizer
            </h3>
            <KPIChart data={kpiRows} type="weeklyTrend" />
          </div>

          {/* Matrix Controls & Plugin Banner */}
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Weekly KPI Tracking Matrix
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Ad Plugin + CRM Data
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Spend & click metrics are auto-synced via <strong>Meta / Google / TikTok plugins</strong>. You only need to verify CRM leads, accounts, and deposits!
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsAdPluginOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sync Meta/Google/TikTok Plugin</span>
              </button>

              <button
                onClick={handlePopulateSampleKpi}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Demo Values</span>
              </button>

              <button
                onClick={handleAddKpiWeekRow}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Add Week</span>
              </button>
            </div>
          </div>

          {/* KPI Table with Column Grouping */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                {/* Column Group Headers */}
                <tr className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-800">
                  <th colSpan={2} className="p-2 text-center border-r border-slate-800 text-slate-500">Period</th>
                  <th colSpan={3} className="p-2 text-center border-r border-slate-800 bg-emerald-500/5 text-emerald-400">
                    ⚡ Auto-Synced Ad Platform Metrics (Meta / Google / TikTok)
                  </th>
                  <th colSpan={5} className="p-2 text-center bg-amber-500/5 text-amber-400">
                    🛡️ CRM Verified Downstream Metrics (Fill Manually)
                  </th>
                </tr>

                <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                  <th className="p-3 w-28">Week</th>
                  <th className="p-3 w-36 border-r border-slate-800">Ad Plugin</th>
                  <th className="p-3 w-28 bg-slate-900/40">Spend ($)</th>
                  <th className="p-3 w-24 bg-slate-900/40">Impressions</th>
                  <th className="p-3 w-24 border-r border-slate-800 bg-slate-900/40">Clicks</th>
                  <th className="p-3 w-28 text-amber-400 bg-amber-500/10 font-bold">CRM Leads *</th>
                  <th className="p-3 w-24 text-amber-300">CPL ($)</th>
                  <th className="p-3 w-24 text-emerald-400 font-bold">Accounts *</th>
                  <th className="p-3 w-24 text-blue-400 font-bold">FTDs *</th>
                  <th className="p-3 w-32 text-purple-400 font-bold">Net Dep ($) *</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-800/80">
                {kpiRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    
                    {/* Week */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.week}
                        onChange={(e) => handleKpiCellChange(idx, 'week', e.target.value)}
                        className="w-full bg-slate-900/90 border border-slate-700/70 rounded px-2 py-1 text-xs font-bold text-white focus:border-amber-400"
                      />
                    </td>

                    {/* Plugin Channel */}
                    <td className="p-2 border-r border-slate-800">
                      <input
                        type="text"
                        value={row.channel}
                        onChange={(e) => handleKpiCellChange(idx, 'channel', e.target.value)}
                        className="w-full bg-slate-900/90 border border-slate-700/70 rounded px-2 py-1 text-[11px] text-emerald-400 font-medium focus:border-amber-400"
                      />
                    </td>

                    {/* Spend (Auto-Synced or Editable) */}
                    <td className="p-2 bg-slate-900/20">
                      <input
                        type="number"
                        step="any"
                        value={row.spend || ''}
                        onChange={(e) => handleKpiCellChange(idx, 'spend', e.target.value)}
                        placeholder="0"
                        className="w-full bg-slate-900/90 border border-slate-700/70 rounded px-2 py-1 text-xs font-mono font-bold text-white focus:border-amber-400"
                      />
                    </td>

                    {/* Impressions */}
                    <td className="p-2 bg-slate-900/20">
                      <input
                        type="number"
                        value={row.impressions || ''}
                        onChange={(e) => handleKpiCellChange(idx, 'impressions', e.target.value)}
                        placeholder="0"
                        className="w-full bg-slate-900/90 border border-slate-700/70 rounded px-2 py-1 text-xs font-mono text-slate-300 focus:border-amber-400"
                      />
                    </td>

                    {/* Clicks */}
                    <td className="p-2 border-r border-slate-800 bg-slate-900/20">
                      <input
                        type="number"
                        value={row.clicks || ''}
                        onChange={(e) => handleKpiCellChange(idx, 'clicks', e.target.value)}
                        placeholder="0"
                        className="w-full bg-slate-900/90 border border-slate-700/70 rounded px-2 py-1 text-xs font-mono text-slate-300 focus:border-amber-400"
                      />
                    </td>

                    {/* CRM Verified Leads (Manual Input) */}
                    <td className="p-2 bg-amber-500/5">
                      <input
                        type="number"
                        value={row.leads || ''}
                        onChange={(e) => handleKpiCellChange(idx, 'leads', e.target.value)}
                        placeholder="CRM Leads"
                        className="w-full bg-slate-950 border border-amber-500/60 rounded px-2 py-1 text-xs font-mono font-bold text-amber-400 focus:border-amber-400"
                      />
                    </td>

                    {/* CPL */}
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      ${row.cpl?.toFixed(2) || '0.00'}
                    </td>

                    {/* Accounts Opened (Manual Input) */}
                    <td className="p-2">
                      <input
                        type="number"
                        value={row.accountOpened || ''}
                        onChange={(e) => handleKpiCellChange(idx, 'accountOpened', e.target.value)}
                        placeholder="Accounts"
                        className="w-full bg-slate-950 border border-emerald-500/50 rounded px-2 py-1 text-xs font-mono text-slate-100 font-bold focus:border-amber-400"
                      />
                    </td>

                    {/* FTDs (Manual Input) */}
                    <td className="p-2">
                      <input
                        type="number"
                        value={row.ftd || ''}
                        onChange={(e) => handleKpiCellChange(idx, 'ftd', e.target.value)}
                        placeholder="FTDs"
                        className="w-full bg-slate-950 border border-blue-500/50 rounded px-2 py-1 text-xs font-mono font-bold text-blue-400 focus:border-amber-400"
                      />
                    </td>

                    {/* Net Deposit (Manual Input) */}
                    <td className="p-2">
                      <input
                        type="number"
                        step="any"
                        value={row.netDeposit || ''}
                        onChange={(e) => handleKpiCellChange(idx, 'netDeposit', e.target.value)}
                        placeholder="Deposit ($)"
                        className="w-full bg-slate-950 border border-purple-500/50 rounded px-2 py-1 text-xs font-mono font-bold text-purple-400 focus:border-amber-400"
                      />
                    </td>

                  </tr>
                ))}
              </tbody>

              <tfoot className="bg-slate-900/90 font-bold border-t-2 border-slate-700 text-slate-100">
                <tr>
                  <td className="p-3 text-amber-400">TOTAL / AVG</td>
                  <td className="p-3 text-slate-400 border-r border-slate-800">-</td>
                  <td className="p-3 font-mono text-slate-100">${totalSpend.toLocaleString()}</td>
                  <td className="p-3 font-mono text-slate-400">{kpiRows.reduce((a, b) => a + (Number(b.impressions) || 0), 0).toLocaleString()}</td>
                  <td className="p-3 font-mono text-slate-400 border-r border-slate-800">{kpiRows.reduce((a, b) => a + (Number(b.clicks) || 0), 0).toLocaleString()}</td>
                  <td className="p-3 font-mono text-amber-400">{totalLeads.toLocaleString()}</td>
                  <td className="p-3 font-mono text-emerald-400">${avgCpl.toFixed(2)}</td>
                  <td className="p-3 font-mono text-slate-300">{kpiRows.reduce((a, b) => a + (Number(b.accountOpened) || 0), 0).toLocaleString()}</td>
                  <td className="p-3 font-mono text-blue-400">{totalFtd.toLocaleString()}</td>
                  <td className="p-3 font-mono text-purple-400">${totalNetDeposit.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: EXECUTION TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Execution Schedule (Notion-Style Live Editing)
            </h3>
            <button
              onClick={handleAddTimelineTask}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                  <th className="p-3 w-28">Week</th>
                  <th className="p-3 min-w-[200px]">Task Name</th>
                  <th className="p-3 w-36">Owner</th>
                  <th className="p-3 w-32">Department</th>
                  <th className="p-3 w-32">Status</th>
                  <th className="p-3 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {timelineList.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={item.week || ''}
                        onChange={(e) => handleTimelineChange(idx, 'week', e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-700/60 rounded px-2 py-1 text-xs text-amber-400 font-bold"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={item.task || ''}
                        onChange={(e) => handleTimelineChange(idx, 'task', e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-700/60 rounded px-2.5 py-1 text-xs text-white font-medium"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={item.owner || ''}
                        onChange={(e) => handleTimelineChange(idx, 'owner', e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-700/60 rounded px-2 py-1 text-xs text-slate-300"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={item.department || ''}
                        onChange={(e) => handleTimelineChange(idx, 'department', e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-700/60 rounded px-2 py-1 text-xs text-slate-300"
                      />
                    </td>
                    <td className="p-2.5">
                      <select
                        value={item.status || 'In Progress'}
                        onChange={(e) => handleTimelineChange(idx, 'status', e.target.value)}
                        className="w-full border rounded px-2 py-1 text-xs font-bold bg-slate-800 text-slate-200 border-slate-700"
                      >
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Pending">Pending</option>
                        <option value="Delayed">Delayed</option>
                      </select>
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        onClick={() => handleDeleteTimelineTask(idx)}
                        className="p-1 text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DELIVERABLES MATRIX */}
      {activeTab === 'deliverables' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Asset Deliverables Checklist (Notion-Style Live Editing)
            </h3>
            <button
              onClick={handleAddDeliverable}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold gradient-gold-bg text-dark-900 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Deliverable</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                  <th className="p-3 min-w-[220px]">Deliverable Asset Item</th>
                  <th className="p-3 w-36">Owner</th>
                  <th className="p-3 w-32">Due Date</th>
                  <th className="p-3 w-36">Status</th>
                  <th className="p-3 min-w-[180px]">Asset / Doc Link</th>
                  <th className="p-3 w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {deliverablesList.map((d, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={d.deliverable || ''}
                        onChange={(e) => handleDeliverableChange(idx, 'deliverable', e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-700/60 rounded px-2.5 py-1 text-xs text-white font-bold"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={d.owner || ''}
                        onChange={(e) => handleDeliverableChange(idx, 'owner', e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-700/60 rounded px-2 py-1 text-xs text-slate-300"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="date"
                        value={d.dueDate || ''}
                        onChange={(e) => handleDeliverableChange(idx, 'dueDate', e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-700/60 rounded px-2 py-1 text-xs text-amber-400 font-mono"
                      />
                    </td>
                    <td className="p-2.5">
                      <select
                        value={d.status || 'Pending'}
                        onChange={(e) => handleDeliverableChange(idx, 'status', e.target.value)}
                        className="w-full border rounded px-2.5 py-1 text-xs font-bold bg-slate-800 text-slate-200 border-slate-700"
                      >
                        <option value="Completed">✓ Completed</option>
                        <option value="In Progress">⏳ In Progress</option>
                        <option value="Pending">🕒 Pending</option>
                        <option value="Delayed">⚠️ Delayed</option>
                      </select>
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={d.link || ''}
                        onChange={(e) => handleDeliverableChange(idx, 'link', e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-700/60 rounded px-2 py-1 text-[11px] text-amber-300 font-mono"
                      />
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        onClick={() => handleDeleteDeliverable(idx)}
                        className="p-1 text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: BUDGET */}
      {activeTab === 'budget' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Budget Breakdown
          </h3>
          <div className="space-y-3">
            {budget.map((b, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{b.item}</h4>
                  <p className="text-[11px] text-slate-400">{b.note}</p>
                </div>
                <span className="text-sm font-extrabold font-mono text-emerald-400">${b.usd?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ad Plugin Auto-Sync Modal */}
      <AdPluginModal
        isOpen={isAdPluginOpen}
        onClose={() => setIsAdPluginOpen(false)}
        campaign={campaign}
        onSyncPluginMetrics={onUpdateCampaign}
      />

    </div>
  );
}
