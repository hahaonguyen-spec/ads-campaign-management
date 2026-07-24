import React, { useState } from 'react';
import { Plus, Save, X, DollarSign, Users, Target, TrendingUp, BarChart2, Zap, ShieldCheck } from 'lucide-react';

export default function MetricInputModal({ isOpen, onClose, campaign, onSaveMetrics }) {
  if (!isOpen || !campaign) return null;

  const existingWeeks = campaign.kpiTracking?.length || 0;
  const nextWeekName = `Week ${existingWeeks + 1}`;

  const [formData, setFormData] = useState({
    week: nextWeekName,
    channel: 'Meta Ads Plugin',
    spend: '',
    impressions: '',
    clicks: '',
    leads: '',
    accountOpened: '',
    kyc: '',
    ftd: '',
    ftt: '',
    grossDeposit: '',
    netDeposit: '',
    lots: '',
    nmi: ''
  });

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const spend = parseFloat(formData.spend) || 0;
    const leads = parseFloat(formData.leads) || 0;
    const cpl = leads > 0 ? Number((spend / leads).toFixed(2)) : 0;

    const newKpiRow = {
      week: formData.week || nextWeekName,
      campaign: campaign.overview.name,
      channel: formData.channel,
      spend,
      impressions: parseFloat(formData.impressions) || 0,
      clicks: parseFloat(formData.clicks) || 0,
      leads,
      cpl,
      accountOpened: parseFloat(formData.accountOpened) || 0,
      kyc: parseFloat(formData.kyc) || 0,
      ftd: parseFloat(formData.ftd) || 0,
      ftt: parseFloat(formData.ftt) || 0,
      grossDeposit: parseFloat(formData.grossDeposit) || 0,
      netDeposit: parseFloat(formData.netDeposit) || 0,
      lots: parseFloat(formData.lots) || 0,
      nmi: parseFloat(formData.nmi) || 0
    };

    const updatedCampaign = {
      ...campaign,
      overview: {
        ...campaign.overview,
        status: 'Launching'
      },
      kpiTracking: [...(campaign.kpiTracking || []), newKpiRow]
    };

    onSaveMetrics(updatedCampaign);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel max-w-xl w-full rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-gold-bg text-dark-900 font-bold">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Fill Campaign Performance Metrics</h2>
              <p className="text-xs text-amber-400 font-medium">{campaign.overview?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Tracking Week Period</label>
              <input
                type="text"
                value={formData.week}
                onChange={(e) => handleChange('week', e.target.value)}
                placeholder="e.g. Week 1"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Ad Plugin Source</label>
              <select
                value={formData.channel}
                onChange={(e) => handleChange('channel', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-amber-400"
              >
                <option value="Meta Ads Plugin">Meta Ads Plugin (FB & IG)</option>
                <option value="Google Ads Plugin">Google Ads Plugin (Search & YT)</option>
                <option value="TikTok Ads Plugin">TikTok Ads Plugin</option>
              </select>
            </div>
          </div>

          {/* Section A: Auto-Synced Ad Platform Metrics */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Ad Network Metrics (Meta / Google / TikTok Plugin)
              </span>
              <span className="text-[10px] text-emerald-400">Auto-filled from Plugin</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Ad Spend ($)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.spend}
                  onChange={(e) => handleChange('spend', e.target.value)}
                  placeholder="e.g. 2500"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Impressions</label>
                <input
                  type="number"
                  value={formData.impressions}
                  onChange={(e) => handleChange('impressions', e.target.value)}
                  placeholder="150000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Clicks</label>
                <input
                  type="number"
                  value={formData.clicks}
                  onChange={(e) => handleChange('clicks', e.target.value)}
                  placeholder="3200"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section B: Manual CRM Verification Metrics */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                CRM & Downstream Verification Metrics (Fill Manually)
              </span>
              <span className="text-[10px] uppercase font-bold text-amber-400">Required Input</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-1">
                <label className="text-amber-300 font-bold block mb-1">CRM Verified Leads *</label>
                <input
                  type="number"
                  value={formData.leads}
                  onChange={(e) => handleChange('leads', e.target.value)}
                  placeholder="e.g. 300"
                  className="w-full bg-slate-950 border border-amber-500/50 rounded-lg px-3 py-1.5 text-amber-400 font-mono font-bold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Accounts Opened *</label>
                <input
                  type="number"
                  value={formData.accountOpened}
                  onChange={(e) => handleChange('accountOpened', e.target.value)}
                  placeholder="150"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-blue-300 font-bold block mb-1">First Time Depositors (FTD) *</label>
                <input
                  type="number"
                  value={formData.ftd}
                  onChange={(e) => handleChange('ftd', e.target.value)}
                  placeholder="45"
                  className="w-full bg-slate-950 border border-blue-500/40 rounded-lg px-3 py-1.5 text-blue-400 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-purple-300 font-bold block mb-1">Net Deposit ($) *</label>
                <input
                  type="number"
                  step="any"
                  value={formData.netDeposit}
                  onChange={(e) => handleChange('netDeposit', e.target.value)}
                  placeholder="25000"
                  className="w-full bg-slate-950 border border-purple-500/40 rounded-lg px-3 py-1.5 text-purple-400 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-rose-300 font-bold block mb-1">Traded Volume (Lots)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.lots}
                  onChange={(e) => handleChange('lots', e.target.value)}
                  placeholder="500"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-rose-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">KYC Verified</label>
                <input
                  type="number"
                  value={formData.kyc}
                  onChange={(e) => handleChange('kyc', e.target.value)}
                  placeholder="100"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold gradient-gold-bg text-dark-900 hover:brightness-110 shadow-lg shadow-amber-900/20"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Performance Report</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
