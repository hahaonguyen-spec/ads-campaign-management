import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Zap, FileSpreadsheet, RefreshCw, Layers } from 'lucide-react';
import { AD_PLUGINS, syncAdPluginMetrics, parseAdPlatformCsv } from '../utils/adPlugins';

export default function AdPluginModal({ isOpen, onClose, campaign, onSyncPluginMetrics }) {
  const [selectedPlugin, setSelectedPlugin] = useState('meta_ads');
  const [targetWeek, setTargetWeek] = useState('Week 1');
  const [csvText, setCsvText] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  if (!isOpen || !campaign) return null;

  const handleAutoSyncAPI = () => {
    setSyncing(true);
    setTimeout(() => {
      const budget = campaign.overview?.totalBudget || 5000;
      const result = syncAdPluginMetrics(selectedPlugin, targetWeek, budget);
      setSyncResult(result);
      setSyncing(false);
    }, 600);
  };

  const handleParseCsv = () => {
    if (!csvText) return;
    const parsed = parseAdPlatformCsv(csvText, selectedPlugin);
    if (parsed) {
      setSyncResult({
        ...parsed,
        week: targetWeek
      });
    }
  };

  const handleConfirmApply = () => {
    if (!syncResult) return;
    
    // Check if row for targetWeek exists in campaign.kpiTracking
    const existingKpis = [...(campaign.kpiTracking || [])];
    const weekIdx = existingKpis.findIndex(r => r.week === targetWeek);

    if (weekIdx !== -1) {
      // Merge auto-synced ad metrics with existing CRM fields
      existingKpis[weekIdx] = {
        ...existingKpis[weekIdx],
        channel: syncResult.channel,
        spend: syncResult.spend,
        impressions: syncResult.impressions,
        clicks: syncResult.clicks,
        // Calculate CPL based on CRM leads if CRM leads exist, else use Ad Leads
        cpl: existingKpis[weekIdx].leads > 0 ? Number((syncResult.spend / existingKpis[weekIdx].leads).toFixed(2)) : syncResult.cpl,
        syncedFromPlugin: true
      };
    } else {
      // Add new row with auto-synced ad metrics
      existingKpis.push({
        week: targetWeek,
        campaign: campaign.overview?.name || '',
        channel: syncResult.channel,
        spend: syncResult.spend,
        impressions: syncResult.impressions,
        clicks: syncResult.clicks,
        leads: syncResult.leads,
        cpl: syncResult.cpl,
        accountOpened: 0,
        kyc: 0,
        ftd: 0,
        ftt: 0,
        grossDeposit: 0,
        netDeposit: 0,
        lots: 0,
        nmi: 0,
        syncedFromPlugin: true
      });
    }

    onSyncPluginMetrics({
      ...campaign,
      overview: {
        ...campaign.overview,
        status: 'Launching'
      },
      kpiTracking: existingKpis
    });

    onClose();
    setSyncResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel max-w-2xl w-full rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-gold-bg text-dark-900 font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Ad Network Auto-Sync Plugins
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Meta • Google • TikTok
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Auto-sync Spend, Impressions & Clicks so you only need to fill CRM verified leads & deposits!
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* Target Week Select */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <span className="text-slate-300 font-semibold">Select Week to Auto-Sync Metrics:</span>
            <select
              value={targetWeek}
              onChange={(e) => setTargetWeek(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-bold"
            >
              <option value="Week 1">Week 1</option>
              <option value="Week 2">Week 2</option>
              <option value="Week 3">Week 3</option>
              <option value="Week 4">Week 4</option>
              <option value="Week 5">Week 5</option>
            </select>
          </div>

          {/* Plugin Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {AD_PLUGINS.map(plugin => (
              <div
                key={plugin.id}
                onClick={() => { setSelectedPlugin(plugin.id); setSyncResult(null); }}
                className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                  selectedPlugin === plugin.id
                    ? 'border-amber-400 bg-amber-500/10 shadow-lg'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{plugin.name}</span>
                    {selectedPlugin === plugin.id && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">{plugin.platform}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[9px] text-slate-400 space-y-0.5">
                  <span className="block font-semibold text-slate-300">Auto-Syncs:</span>
                  <span className="text-emerald-400 block font-mono">✓ Spend ($)</span>
                  <span className="text-amber-400 block font-mono">✓ Impressions & Clicks</span>
                </div>
              </div>
            ))}
          </div>

          {/* Sync Action Options */}
          <div className="space-y-3 pt-2">
            
            {/* Option 1: Live API Auto-Sync */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Live API Auto-Sync ({AD_PLUGINS.find(p => p.id === selectedPlugin)?.name})
                </h4>
                <p className="text-[11px] text-slate-400">
                  Connects to ad platform account and retrieves exact spend, impressions, and clicks for {targetWeek}.
                </p>
              </div>

              <button
                disabled={syncing}
                onClick={handleAutoSyncAPI}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold gradient-gold-bg text-dark-900 hover:brightness-110 shadow-md shrink-0"
              >
                {syncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{syncing ? 'Syncing...' : 'Sync Live Metrics'}</span>
              </button>
            </div>

            {/* Option 2: Paste Ads Manager CSV Report */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                Or Paste Ad Report CSV Line (Optional)
              </h4>
              <p className="text-[11px] text-slate-400">
                Paste raw CSV line exported from Facebook Ads Manager, Google Ads Editor, or TikTok Ads Manager:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder='e.g. "Campaign Name", "Amount Spent", "Impressions", "Clicks"'
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
                />
                <button
                  onClick={handleParseCsv}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700"
                >
                  Parse CSV
                </button>
              </div>
            </div>

          </div>

          {/* Sync Result Preview */}
          {syncResult && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-fadeIn text-xs">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Auto-Synced Metrics Preview for {syncResult.week}:
                </span>
                <span className="font-mono text-[10px] text-slate-400">{syncResult.channel}</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded bg-black/40">
                  <span className="text-[10px] text-slate-400 block">Spend ($)</span>
                  <span className="font-bold font-mono text-white">${syncResult.spend.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded bg-black/40">
                  <span className="text-[10px] text-slate-400 block">Impressions</span>
                  <span className="font-bold font-mono text-slate-200">{syncResult.impressions.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded bg-black/40">
                  <span className="text-[10px] text-slate-400 block">Clicks</span>
                  <span className="font-bold font-mono text-slate-200">{syncResult.clicks.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded bg-black/40">
                  <span className="text-[10px] text-slate-400 block">Platform Leads</span>
                  <span className="font-bold font-mono text-amber-400">{syncResult.leads.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-[11px] text-emerald-300 italic">
                ✓ Top-of-funnel spend & click metrics auto-filled! You now only need to enter CRM verified leads, accounts opened, & deposits in the KPI table.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800">
            Cancel
          </button>
          <button
            disabled={!syncResult}
            onClick={handleConfirmApply}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold gradient-gold-bg text-dark-900 hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-amber-900/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply Metrics to Campaign</span>
          </button>
        </div>

      </div>
    </div>
  );
}
