import React from 'react';
import { 
  BarChart3, Upload, Download, RefreshCw, Search, Cloud, PlusCircle, Type 
} from 'lucide-react';

export default function Navbar({ 
  searchTerm, 
  setSearchTerm, 
  onOpenUpload, 
  onOpenCloudSettings,
  onDownloadTemplate, 
  onResetDemo,
  campaignCount = 0,
  activeCount = 0,
  textSizeScale = 'normal',
  onChangeTextSize
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#071322]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl gradient-cpt-brand flex items-center justify-center shadow-lg shadow-[#0AE5D5]/20 border border-[#0AE5D5]/40">
            <span className="font-black text-[#071322] text-sm tracking-wider">CPT</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
                Ads Campaign Manager
              </h1>
              <span className="text-[11px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#0AE5D5]/15 text-[#0AE5D5] border border-[#0AE5D5]/40 hidden sm:inline-block">
                Mobile Web Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block font-medium">
              Tracking & Automated Performance Analytics
            </p>
          </div>
        </div>

        {/* Global Search Input */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="global-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search campaigns by name, owner, region..."
              className="w-full bg-[#0C2038] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0AE5D5] transition"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          
          {/* Active Campaigns Counter Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0C2038] border border-slate-700 text-xs font-semibold text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0AE5D5] animate-pulse"></span>
            <span>{activeCount} / {campaignCount} Active</span>
          </div>



          {/* Cloud Storage Status & Settings Button */}
          <button
            onClick={onOpenCloudSettings}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition"
            title="Cloud Storage Status & Sync Settings"
          >
            <Cloud className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">Cloud Saved</span>
          </button>

          {/* Download Template Button */}
          <button
            onClick={onDownloadTemplate}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#0C2038] hover:bg-[#1E375E] text-slate-200 border border-slate-700 transition"
            title="Download CPT Campaign Excel Form (.xlsx)"
          >
            <Download className="w-4 h-4 text-[#33CCFF]" />
            <span>Form Template</span>
          </button>

          {/* Campaign Form Button (Direct Input or File Upload) */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black gradient-cpt-brand text-[#071322] hover:brightness-110 shadow-lg shadow-[#0AE5D5]/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden xs:inline">Form</span>
            <span className="hidden sm:inline">Input</span>
          </button>

          {/* Reset Action */}
          <button
            onClick={onResetDemo}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-[#0C2038] border border-slate-700 transition"
            title="Reset System Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
}

