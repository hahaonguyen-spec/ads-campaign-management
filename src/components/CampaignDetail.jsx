import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, User, Globe, DollarSign, Target, Copy, Check, 
  ExternalLink, Layers, ShieldAlert, FileText, CheckCircle2, Clock, 
  Plus, Save, BarChart3, Rocket, CalendarClock, PlusCircle, Trash2, Edit3, Sparkles, TrendingUp, Zap, ShieldCheck, Video, Award, GripVertical
} from 'lucide-react';
import KPIChart from './KPIChart';
import AIInsights from './AIInsights';
import AdPluginModal from './AdPluginModal';
import WebinarTracker from './WebinarTracker';
import MonthlyReviewReport from './MonthlyReviewReport';
import WeeklyAggregationTable from './WeeklyAggregationTable';
import BudgetManager from './BudgetManager';

export default function CampaignDetail({ campaign, onBack, onUpdateCampaign, onOpenMetricInput }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [isAdPluginOpen, setIsAdPluginOpen] = useState(false);
  const [draggedRowIndex, setDraggedRowIndex] = useState(null);
  
  // Local state for KPI, Timeline & Deliverables editing
  const [kpiRows, setKpiRows] = useState(() => {
    if (campaign && campaign.kpiTracking && campaign.kpiTracking.length > 0) {
      return campaign.kpiTracking;
    }
    return [
      { week: '1', channel: 'Meta Ads', spend: 100, impressions: 0, clicks: 0, leads: 100, cpl: 1, accountOpened: 0, kyc: 0, ftd: 0, ftt: 0, grossDeposit: 0, netDeposit: 1000, lots: 0, nmi: 250 },
      { week: '1', channel: 'TikTok Ads', spend: 0, impressions: 0, clicks: 0, leads: 200, cpl: 0, accountOpened: 0, kyc: 0, ftd: 0, ftt: 0, grossDeposit: 0, netDeposit: 0, lots: 0, nmi: 0 },
      { week: '3', channel: 'Google Search', spend: 200, impressions: 0, clicks: 0, leads: 0, cpl: 0, accountOpened: 0, kyc: 0, ftd: 0, ftt: 0, grossDeposit: 0, netDeposit: 200, lots: 0, nmi: 50 },
      { week: '2', channel: 'Google Search', spend: 0, impressions: 0, clicks: 0, leads: 300, cpl: 0, accountOpened: 0, kyc: 0, ftd: 0, ftt: 0, grossDeposit: 0, netDeposit: 0, lots: 0, nmi: 0 }
    ];
  });

  const [deliverablesList, setDeliverablesList] = useState(campaign?.deliverables || []);
  const [timelineList, setTimelineList] = useState(campaign?.timeline || []);

  const { overview = {}, budget = [] } = campaign || {};

  const isPlanned = overview?.status === 'Planned';
  const isWebinarType = (overview?.type || '').toLowerCase().includes('webinar') || (overview?.mechanics || '').toLowerCase().includes('webinar') || campaign?.webinarTracking;

  // Calculate actuals
  const totalSpend = kpiRows.reduce((a, b) => a + (Number(b.spend) || 0), 0);
  const totalLeads = kpiRows.reduce((a, b) => a + (Number(b.leads) || 0), 0);
  const totalFtd = kpiRows.reduce((a, b) => a + (Number(b.ftd) || 0), 0);
  const totalGrossDeposit = kpiRows.reduce((a, b) => a + (Number(b.grossDeposit) || 0), 0);
  const totalNetDeposit = kpiRows.reduce((a, b) => a + (Number(b.netDeposit) || 0), 0);
  const totalLots = kpiRows.reduce((a, b) => a + (Number(b.lots) || 0), 0);
  const totalNmi = kpiRows.reduce((a, b) => a + (Number(b.nmi) || 0), 0) || Math.round(totalNetDeposit * 0.25);
  const avgCpl = totalLeads > 0 ? totalSpend / totalLeads : 0;

  // Expected Outcome targets
  const expected = overview?.expectedTargets || {
    targetBudget: overview?.totalBudget || 5000,
    targetLeads: Math.round((overview?.totalBudget || 5000) / 8.0),
    targetCpl: 8.00,
    targetFtd: 50,
    targetNetDeposit: 25000,
    targetLots: 500,
    targetNmi: 6250
  };

  const handleCopyLink = () => {
    if (overview?.trackingLink) {
      navigator.clipboard.writeText(overview.trackingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Drag and Drop reordering logic for KPI rows
  const handleDragStart = (e, index) => {
    setDraggedRowIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedRowIndex === null || draggedRowIndex === dropIndex) return;

    const updated = [...kpiRows];
    const [movedRow] = updated.splice(draggedRowIndex, 1);
    updated.splice(dropIndex, 0, movedRow);

    setKpiRows(updated);
    setDraggedRowIndex(null);

    onUpdateCampaign({
      ...campaign,
      kpiTracking: updated
    });
  };

  // KPI cell change
  const handleKpiCellChange = (index, field, value) => {
    const updated = [...kpiRows];
    if (field === 'week' || field === 'channel') {
      updated[index][field] = value;
    } else {
      const numVal = parseFloat(value) || 0;
      updated[index][field] = numVal;

      if (field === 'spend' || field === 'leads') {
        const sp = field === 'spend' ? numVal : updated[index].spend;
        const ld = field === 'leads' ? numVal : updated[index].leads;
        updated[index].cpl = ld > 0 ? Number((sp / ld).toFixed(2)) : 0;
      }
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
      { week: '1', campaign: overview.name, channel: 'Meta Ads', spend: 2500, impressions: 180000, clicks: 3900, leads: 340, cpl: 7.35, accountOpened: 180, kyc: 120, ftd: 48, ftt: 42, grossDeposit: 24000, netDeposit: 22000, lots: 520, nmi: 5500, syncedFromPlugin: true },
      { week: '1', campaign: overview.name, channel: 'TikTok Ads', spend: 2800, impressions: 210000, clicks: 4500, leads: 410, cpl: 6.83, accountOpened: 220, kyc: 155, ftd: 62, ftt: 58, grossDeposit: 35000, netDeposit: 31000, lots: 740, nmi: 7750, syncedFromPlugin: true },
      { week: '2', campaign: overview.name, channel: 'Google Search', spend: 3200, impressions: 95000, clicks: 3100, leads: 360, cpl: 8.89, accountOpened: 205, kyc: 140, ftd: 75, ftt: 68, grossDeposit: 52000, netDeposit: 48000, lots: 980, nmi: 12000, syncedFromPlugin: true },
      { week: '3', campaign: overview.name, channel: 'Google Search', spend: 3000, impressions: 90000, clicks: 2900, leads: 330, cpl: 9.09, accountOpened: 190, kyc: 130, ftd: 68, ftt: 61, grossDeposit: 44000, netDeposit: 41000, lots: 860, nmi: 10250, syncedFromPlugin: true }
    ];
    setKpiRows(sampleKpi);
    onUpdateCampaign({
      ...campaign,
      overview: { ...campaign.overview, status: 'Launching' },
      kpiTracking: sampleKpi
    });
  };

  const handleAddKpiWeekRow = () => {
    const newRow = {
      week: '1',
      campaign: overview.name,
      channel: 'Meta Ads',
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

  const handleDeleteKpiRow = (idx) => {
    const updated = kpiRows.filter((_, i) => i !== idx);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 rounded-xl bg-[#071322] border border-slate-700 text-slate-300 hover:text-white hover:bg-[#1E375E] transition shadow-sm"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-xl sm:text-2xl font-black text-white">{overview?.name || 'Untitled Campaign'}</h2>
              
              <button
                onClick={handleToggleStatus}
                title="Click to toggle Planned / Launching status"
                className={`text-xs font-bold uppercase px-3 py-1 rounded-full border transition cursor-pointer flex items-center gap-1.5 ${
                  isPlanned 
                    ? 'bg-[#33CCFF]/20 text-[#33CCFF] border-[#33CCFF]/40 hover:bg-[#33CCFF]/30' 
                    : 'bg-[#0AE5D5]/20 text-[#0AE5D5] border-[#0AE5D5]/40 hover:bg-[#0AE5D5]/30'
                }`}
              >
                {isPlanned ? <CalendarClock className="w-3.5 h-3.5 text-[#33CCFF]" /> : <Rocket className="w-3.5 h-3.5 text-[#0AE5D5]" />}
                <span>{overview?.status || 'Planned'} (Toggle)</span>
              </button>

              <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 hidden sm:inline-block">
                CPT-I Approved Standard
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-3 flex-wrap font-medium">
              <span>Duration: <strong className="text-slate-200">{overview?.duration}</strong></span>
              <span>•</span>
              <span>Target Audience: <strong className="text-slate-200">{overview?.targetAudience}</strong></span>
              <span>•</span>
              <span>Feasibility: <strong className="text-[#0AE5D5]">{overview?.paidTeamFeasibility || 'Feasible & Approved'}</strong></span>
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAdPluginOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#0AE5D5]/15 text-[#0AE5D5] border border-[#0AE5D5]/40 hover:bg-[#0AE5D5]/25 transition"
          >
            <Zap className="w-4 h-4 text-[#0AE5D5]" />
            <span>Sync Ad Plugin</span>
          </button>

          <button
            onClick={() => onOpenMetricInput(campaign)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black gradient-cpt-brand text-[#071322] hover:brightness-110 transition shadow-md"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Fill CRM Verified Data</span>
          </button>

          {overview?.trackingLink && (
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#071322] border border-slate-700 text-slate-200 hover:border-[#33CCFF] transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#33CCFF]" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          )}
        </div>
      </div>

      {/* MANDATED KEY METRICS HIGHLIGHTS (CPT-I: Leads, FTD, NMI) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-[#33CCFF]/30 bg-[#0C2038] space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#33CCFF] font-bold uppercase text-xs tracking-wider">Key Metric 1: Leads</span>
            <span className="text-slate-400 font-mono text-xs">Target: {expected.targetLeads?.toLocaleString()}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">{totalLeads.toLocaleString()}</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-[#33CCFF]">${avgCpl.toFixed(2)} Avg CPL</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-sky-500/30 bg-[#0C2038] space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-sky-300 font-bold uppercase text-xs tracking-wider">Key Metric 2: FTD</span>
            <span className="text-slate-400 font-mono text-xs">Target: {expected.targetFtd?.toLocaleString()}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black font-mono text-sky-200 tracking-tight">{totalFtd.toLocaleString()}</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-sky-300">${totalFtd > 0 ? (totalSpend / totalFtd).toFixed(2) : '0.00'} /FTD</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#0AE5D5]/30 bg-[#0C2038] space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#0AE5D5] font-bold uppercase text-xs tracking-wider">Key Metric 3: NMI (Net Margin)</span>
            <span className="text-slate-400 font-mono text-xs">Target: ${expected.targetNmi?.toLocaleString()}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#0AE5D5] tracking-tight">${totalNmi.toLocaleString()}</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-[#0AE5D5]">Dep: ${totalNetDeposit.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* AI Diagnostic Insights */}
      <AIInsights campaign={{ ...campaign, kpiTracking: kpiRows }} />

      {/* Tabs Header - Touch Swappable */}
      <div className="flex border-b border-slate-800 overflow-x-auto gap-2 text-xs sm:text-sm font-bold scrollbar-none py-1">
        {[
          { id: 'overview', label: 'Brief & Strategy', icon: <FileText className="w-4.5 h-4.5" /> },
          { id: 'kpi', label: `KPI Matrix (${kpiRows.length})`, icon: <BarChart3 className="w-4.5 h-4.5" /> },
          { id: 'report', label: 'Monthly Report', icon: <Award className="w-4.5 h-4.5" /> },
          { id: 'timeline', label: `Schedule (${timelineList.length})`, icon: <Clock className="w-4.5 h-4.5" /> },
          { id: 'deliverables', label: `Deliverables (${deliverablesList.length})`, icon: <CheckCircle2 className="w-4.5 h-4.5" /> },
          { id: 'budget', label: 'Budget Allocations', icon: <DollarSign className="w-4.5 h-4.5" /> },
          ...(isWebinarType ? [{ id: 'webinar', label: 'Webinar 2-Tier', icon: <Video className="w-4.5 h-4.5" /> }] : [])
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#0AE5D5] text-[#0AE5D5] bg-[#0AE5D5]/10 rounded-t-xl font-black'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0C2038]'
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
                CPT-I Condensed Approval Brief & Parameters
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-semibold">Campaign Duration</span>
                  <p className="text-white font-bold">{overview.duration}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-semibold">Target Audience & Segment</span>
                  <p className="text-amber-400 font-bold">{overview.targetAudience}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-semibold">Distribution Channels</span>
                  <p className="text-slate-200 font-medium">{overview.channels}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-semibold">Paid Team Feasibility Sign-off</span>
                  <p className="text-emerald-400 font-bold">{overview.paidTeamFeasibility || 'Feasible & Practical'}</p>
                </div>

                <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-semibold">Strategic Objective</span>
                  <p className="text-slate-200 leading-relaxed font-medium">{overview.objective}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Approval Financial Parameters</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Marketing Spend Budget</span>
                  <span className="font-semibold text-slate-200">${(overview.marketingSpend || overview.totalBudget || 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Credit Bonus Budget</span>
                  <span className="font-semibold text-amber-400">${(overview.creditBonusCost || 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Total Campaign Cost</span>
                  <span className="font-bold text-rose-400 font-mono text-sm">${(overview.totalCampaignCost || overview.totalBudget || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KPI PERFORMANCE MATRIX (RAW INPUT + AUTOMATED WEEKLY SUBTOTAL AGGREGATION SUMMARY) */}
      {activeTab === 'kpi' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Weekly Performance Trend Visualizer
            </h3>
            <KPIChart data={kpiRows} type="weeklyTrend" />
          </div>

          {/* AUTOMATED WEEKLY SUBTOTAL AGGREGATION SUMMARY CARD */}
          <WeeklyAggregationTable kpiRows={kpiRows} />

          <div className="flex justify-between items-center flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Weekly KPI Tracking Matrix (Raw Multi-Platform Entries)
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Editable Week • Platform Select • Drag to Reorder
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Type week freely, choose platform (Meta, TikTok, Google, Other), and drag <GripVertical className="w-3 h-3 inline text-amber-400" /> handles to reorder rows!
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsAdPluginOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sync Ad Plugin</span>
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
                <span>Add Row</span>
              </button>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-800">
                  <th colSpan={3} className="p-2 text-center border-r border-slate-800 text-slate-500">Period</th>
                  <th colSpan={3} className="p-2 text-center border-r border-slate-800 bg-emerald-500/5 text-emerald-400">
                    ⚡ Auto-Synced Ad Platform Metrics (Meta / Google / TikTok)
                  </th>
                  <th colSpan={5} className="p-2 text-center bg-amber-500/5 text-amber-400">
                    🛡️ CRM Verified Downstream Metrics (Leads, FTD, NMI)
                  </th>
                  <th className="p-2 w-10"></th>
                </tr>

                <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                  <th className="p-3 w-8 text-center">⋮⋮</th>
                  <th className="p-3 w-28">Week</th>
                  <th className="p-3 w-44 border-r border-slate-800">Platform</th>
                  <th className="p-3 w-28 bg-slate-900/40">Spend ($)</th>
                  <th className="p-3 w-24 bg-slate-900/40">Impressions</th>
                  <th className="p-3 w-24 border-r border-slate-800 bg-slate-900/40">Clicks</th>
                  <th className="p-3 w-28 text-amber-400 bg-amber-500/10 font-bold">CRM Leads *</th>
                  <th className="p-3 w-24 text-amber-300">CPL ($)</th>
                  <th className="p-3 w-24 text-emerald-400 font-bold">Accounts *</th>
                  <th className="p-3 w-24 text-blue-400 font-bold">FTDs *</th>
                  <th className="p-3 w-32 text-purple-400 font-bold">Net Dep ($) *</th>
                  <th className="p-3 w-10 text-center">Action</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-800/80">
                {kpiRows.map((row, idx) => {
                  const standardPlatforms = ['Meta Ads', 'Google Ads', 'TikTok Ads'];
                  const currentChannel = row.channel || 'Meta Ads';
                  const isCustomPlatform = !standardPlatforms.includes(currentChannel) && currentChannel !== '';

                  return (
                    <tr
                      key={idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, idx)}
                      className={`hover:bg-slate-800/60 transition ${draggedRowIndex === idx ? 'opacity-40 bg-amber-500/10' : ''}`}
                    >
                      <td className="p-2 text-center cursor-grab active:cursor-grabbing text-slate-500 hover:text-amber-400">
                        <GripVertical className="w-4 h-4 mx-auto" />
                      </td>

                      <td className="p-2">
                        <input
                          type="text"
                          value={row.week || ''}
                          onChange={(e) => handleKpiCellChange(idx, 'week', e.target.value)}
                          placeholder="e.g. 1"
                          className="w-full bg-slate-900/90 border border-slate-700/70 rounded px-2.5 py-1 text-xs font-bold text-white focus:border-amber-400"
                        />
                      </td>

                      <td className="p-2 border-r border-slate-800 space-y-1">
                        <select
                          value={isCustomPlatform ? 'Other' : currentChannel}
                          onChange={(e) => {
                            const selected = e.target.value;
                            if (selected === 'Other') {
                              handleKpiCellChange(idx, 'channel', 'Custom Channel');
                            } else {
                              handleKpiCellChange(idx, 'channel', selected);
                            }
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-emerald-400 font-bold focus:border-amber-400"
                        >
                          <option value="Meta Ads">Meta Ads (Facebook/IG)</option>
                          <option value="Google Ads">Google Ads (Search/YT)</option>
                          <option value="TikTok Ads">TikTok Ads</option>
                          <option value="Other">Other (Custom Type...)</option>
                        </select>

                        {isCustomPlatform && (
                          <input
                            type="text"
                            value={currentChannel}
                            onChange={(e) => handleKpiCellChange(idx, 'channel', e.target.value)}
                            placeholder="Type custom platform..."
                            className="w-full bg-slate-950 border border-emerald-500/50 rounded px-2 py-0.5 text-[11px] text-emerald-300 font-mono"
                          />
                        )}
                      </td>

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

                      <td className="p-2 bg-slate-900/20">
                        <input
                          type="number"
                          value={row.impressions || ''}
                          onChange={(e) => handleKpiCellChange(idx, 'impressions', e.target.value)}
                          placeholder="0"
                          className="w-full bg-slate-900/90 border border-slate-700/70 rounded px-2 py-1 text-xs font-mono text-slate-300 focus:border-amber-400"
                        />
                      </td>

                      <td className="p-2 border-r border-slate-800 bg-slate-900/20">
                        <input
                          type="number"
                          value={row.clicks || ''}
                          onChange={(e) => handleKpiCellChange(idx, 'clicks', e.target.value)}
                          placeholder="0"
                          className="w-full bg-slate-900/90 border border-slate-700/70 rounded px-2 py-1 text-xs font-mono text-slate-300 focus:border-amber-400"
                        />
                      </td>

                      <td className="p-2 bg-amber-500/5">
                        <input
                          type="number"
                          value={row.leads || ''}
                          onChange={(e) => handleKpiCellChange(idx, 'leads', e.target.value)}
                          placeholder="CRM Leads"
                          className="w-full bg-slate-950 border border-amber-500/60 rounded px-2 py-1 text-xs font-mono font-bold text-amber-400 focus:border-amber-400"
                        />
                      </td>

                      <td className="p-3 font-mono font-bold text-emerald-400">
                        ${row.cpl?.toFixed(2) || '0.00'}
                      </td>

                      <td className="p-2">
                        <input
                          type="number"
                          value={row.accountOpened || ''}
                          onChange={(e) => handleKpiCellChange(idx, 'accountOpened', e.target.value)}
                          placeholder="Accounts"
                          className="w-full bg-slate-950 border border-emerald-500/50 rounded px-2 py-1 text-xs font-mono text-slate-100 font-bold focus:border-amber-400"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          type="number"
                          value={row.ftd || ''}
                          onChange={(e) => handleKpiCellChange(idx, 'ftd', e.target.value)}
                          placeholder="FTDs"
                          className="w-full bg-slate-950 border border-blue-500/50 rounded px-2 py-1 text-xs font-mono font-bold text-blue-400 focus:border-amber-400"
                        />
                      </td>

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

                      <td className="p-2 text-center">
                        <button
                          onClick={() => handleDeleteKpiRow(idx)}
                          className="p-1 text-slate-500 hover:text-red-400 rounded hover:bg-slate-800"
                          title="Delete Row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              <tfoot className="bg-slate-900/90 font-bold border-t-2 border-slate-700 text-slate-100">
                <tr>
                  <td className="p-3 text-center text-slate-500">-</td>
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
                  <td className="p-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MONTHLY & END OF CAMPAIGN REVIEW REPORT */}
      {activeTab === 'report' && (
        <MonthlyReviewReport campaign={{ ...campaign, kpiTracking: kpiRows }} />
      )}

      {/* TAB 4: WEBINAR 2-TIER TRACKING */}
      {activeTab === 'webinar' && isWebinarType && (
        <WebinarTracker campaign={campaign} onUpdateWebinar={onUpdateCampaign} />
      )}

      {/* TAB 5: EXECUTION TIMELINE */}
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

      {/* TAB 6: DELIVERABLES MATRIX */}
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

      {/* TAB 7: EDITABLE BUDGET ALLOCATION WITH AUDIT LOG */}
      {activeTab === 'budget' && (
        <BudgetManager campaign={campaign} onUpdateCampaign={onUpdateCampaign} />
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
