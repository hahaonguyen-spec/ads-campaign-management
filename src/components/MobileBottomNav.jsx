import React from 'react';
import { 
  LayoutDashboard, PlusCircle, Search, Cloud
} from 'lucide-react';

export default function MobileBottomNav({
  activeTab,
  onGoHome,
  onOpenUpload,
  onOpenCloudSettings,
  onToggleSearch
}) {
  return (
    <nav 
      aria-label="Mobile Navigation" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#071322]/95 backdrop-blur-xl border-t border-slate-800 shadow-2xl px-4 py-2 flex justify-around items-center"
    >
      {/* 1. Dashboard Tab */}
      <button
        onClick={onGoHome}
        className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition ${
          activeTab === 'dashboard'
            ? 'text-[#0AE5D5] bg-[#0AE5D5]/10 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <LayoutDashboard className="w-5.5 h-5.5 mb-0.5" />
        <span className="text-xs font-medium tracking-tight">Home</span>
      </button>

      {/* 2. Add / Upload Form Tab */}
      <button
        onClick={onOpenUpload}
        className="flex flex-col items-center justify-center w-16 py-1 rounded-xl text-[#0AE5D5] transition hover:opacity-90 active:scale-95"
      >
        <div className="w-8 h-8 rounded-full gradient-cpt-brand flex items-center justify-center text-[#071322] shadow-md shadow-[#0AE5D5]/30">
          <PlusCircle className="w-5 h-5 font-black" />
        </div>
        <span className="text-xs font-extrabold text-slate-200 mt-0.5">Form</span>
      </button>

      {/* 3. Mobile Search Toggle */}
      <button
        onClick={onToggleSearch}
        className="flex flex-col items-center justify-center w-16 py-1 rounded-xl text-slate-400 hover:text-slate-200 transition"
      >
        <Search className="w-5.5 h-5.5 mb-0.5 text-sky-400" />
        <span className="text-xs font-medium tracking-tight">Search</span>
      </button>

      {/* 4. Cloud Storage Tab */}
      <button
        onClick={onOpenCloudSettings}
        className="flex flex-col items-center justify-center w-16 py-1 rounded-xl text-slate-400 hover:text-[#33CCFF] transition"
      >
        <Cloud className="w-5.5 h-5.5 mb-0.5 text-cyan-400 animate-pulse" />
        <span className="text-xs font-medium tracking-tight">Cloud</span>
      </button>

    </nav>
  );
}
