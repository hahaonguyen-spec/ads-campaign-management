import React from 'react';
import { 
  BarChart3, Upload, Download, RefreshCw, Search, Shield, Zap, Sparkles 
} from 'lucide-react';

export default function Navbar({ 
  searchTerm, 
  setSearchTerm, 
  onOpenUpload, 
  onDownloadTemplate, 
  onResetDemo,
  campaignCount = 0,
  activeCount = 0
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#071322]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-cpt-brand flex items-center justify-center shadow-lg shadow-[#0AE5D5]/20 border border-[#0AE5D5]/40">
            <span className="font-black text-[#071322] text-xs tracking-wider">CPT</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white tracking-tight">Ads Campaign Manager</h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#0AE5D5]/15 text-[#0AE5D5] border border-[#0AE5D5]/40">
                CPT Official System
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block font-medium">
              Tracking & Automated Template Analysis
            </p>
          </div>
        </div>

        {/* Global Search Input */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search campaigns by name, owner, region, channel..."
              className="w-full bg-[#0C2038] border border-slate-700/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#0AE5D5] transition"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          
          {/* Active Campaigns Counter Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0C2038] border border-slate-700 text-xs font-semibold text-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#0AE5D5] animate-pulse"></span>
            <span>{activeCount} / {campaignCount} Active</span>
          </div>

          {/* Download Template Button */}
          <button
            onClick={onDownloadTemplate}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0C2038] hover:bg-[#1E375E] text-slate-200 border border-slate-700 transition"
            title="Download CPT Campaign Excel Form (.xlsx)"
          >
            <Download className="w-3.5 h-3.5 text-[#33CCFF]" />
            <span>Form Template</span>
          </button>

          {/* Upload Campaign Form */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black gradient-cpt-brand text-[#071322] hover:brightness-110 shadow-lg shadow-[#0AE5D5]/20 transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Campaign Form</span>
          </button>

          {/* Reset Action */}
          <button
            onClick={onResetDemo}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-[#0C2038] border border-slate-700 transition"
            title="Reset System Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </header>
  );
}
