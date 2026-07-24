import React from 'react';
import { Upload, Download, Search, RefreshCw, BarChart2, CheckCircle2, TrendingUp } from 'lucide-react';

export default function Navbar({ 
  searchTerm, 
  setSearchTerm, 
  onOpenUpload, 
  onDownloadTemplate,
  onResetDemo,
  campaignCount,
  activeCount
}) {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 bg-[#0B0F17]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-xl gradient-gold-bg flex items-center justify-center shadow-lg shadow-amber-900/30">
            <span className="font-extrabold text-xl text-dark-900 tracking-wider">CPT</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-tight flex items-center gap-2">
              Ads Campaign Manager
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Local System
              </span>
            </h1>
            <p className="text-xs text-slate-400">Tracking & Automated Template Analysis</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search campaigns by name, owner, region, or channel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Active Campaigns Counter */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">{activeCount} / {campaignCount} Active</span>
          </div>

          {/* Download Template */}
          <button
            onClick={onDownloadTemplate}
            title="Download CPT Campaign Form Template (.xlsx)"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Form Template</span>
          </button>

          {/* Upload Campaign */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold gradient-gold-bg text-dark-900 hover:brightness-110 transition shadow-lg shadow-amber-900/20 active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Campaign Form</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={onResetDemo}
            title="Reset Sample Data"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
