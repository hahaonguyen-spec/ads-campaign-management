import React, { useState, useEffect } from 'react';
import { Cloud, RefreshCw, Key, Link, ShieldCheck, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { getCloudConfig, saveCloudConfig, saveCampaignsToCloud, loadCampaignsFromCloud } from '../utils/cloudStorage';

export default function CloudSettingsModal({ isOpen, onClose, campaigns, onCloudDataLoaded }) {
  const [config, setConfig] = useState(getCloudConfig());
  const [syncing, setSyncing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setConfig(getCloudConfig());
      setStatusMsg('');
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    saveCloudConfig(config);
    setStatusMsg('Cloud storage settings updated successfully!');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleManualSyncPush = async () => {
    setSyncing(true);
    setStatusMsg('');
    setErrorMsg('');

    const res = await saveCampaignsToCloud(campaigns);
    setSyncing(false);
    if (res.success) {
      setStatusMsg(`Successfully synced ${campaigns.length} campaigns to Cloud! (${new Date().toLocaleTimeString()})`);
    } else {
      setErrorMsg(`Cloud sync failed: ${res.error || 'Unknown error'}`);
    }
  };

  const handleManualSyncPull = async () => {
    setSyncing(true);
    setStatusMsg('');
    setErrorMsg('');

    const cloudData = await loadCampaignsFromCloud();
    setSyncing(false);
    if (cloudData && Array.isArray(cloudData)) {
      onCloudDataLoaded(cloudData);
      setStatusMsg(`Loaded ${cloudData.length} campaigns from Cloud storage!`);
    } else {
      setErrorMsg('No cloud backup found or fetch failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel max-w-lg w-full rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Cloud Sync & Persistence Settings
              </h2>
              <p className="text-xs text-slate-400">Save and access your ad campaigns securely anywhere</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">

          {/* Cloud Status Banner */}
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud className="w-6 h-6 text-cyan-400" />
              <div>
                <div className="text-xs font-bold text-cyan-300">Cloud Storage Active</div>
                <div className="text-[11px] text-slate-300">
                  Last Synced: {config.lastSynced ? new Date(config.lastSynced).toLocaleString() : 'Just now'}
                </div>
              </div>
            </div>
            <button
              onClick={handleManualSyncPush}
              disabled={syncing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-dark-900 text-xs font-bold rounded-lg transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>Sync Now</span>
            </button>
          </div>

          {/* Feedback messages */}
          {statusMsg && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Configuration Form */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Cloud Provider Mode</label>
              <select
                value={config.provider}
                onChange={(e) => setConfig({ ...config, provider: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="jsonbin">CPT Cloud API / JSONBin Sync (Standard)</option>
                <option value="custom">Custom REST / Supabase Endpoint</option>
              </select>
            </div>

            {config.provider === 'custom' && (
              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                  <Link className="w-3.5 h-3.5 text-cyan-400" /> Custom Endpoint URL
                </label>
                <input
                  type="url"
                  placeholder="https://your-supabase-url.supabase.co/rest/v1/..."
                  value={config.customEndpoint || ''}
                  onChange={(e) => setConfig({ ...config, customEndpoint: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-amber-400" /> API Secret Key / Token (Optional)
              </label>
              <input
                type="password"
                placeholder="Enter API key or leave blank for default Cloud Storage"
                value={config.apiKey || ''}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="autoSyncCheck"
                checked={config.autoSync}
                onChange={(e) => setConfig({ ...config, autoSync: e.target.checked })}
                className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 bg-slate-900"
              />
              <label htmlFor="autoSyncCheck" className="text-slate-300 font-medium cursor-pointer">
                Automatically push to cloud on every campaign change
              </label>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Dual-Sync Protection enabled: Data is stored locally in IndexedDB & synced to Cloud.</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={handleManualSyncPull}
            disabled={syncing}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium"
          >
            Load Data From Cloud
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition"
            >
              Close
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-dark-900 transition shadow-lg shadow-cyan-500/20"
            >
              Save Cloud Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
