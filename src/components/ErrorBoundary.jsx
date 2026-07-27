import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { clearAllLocalDatabases } from '../utils/dbStorage';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = async () => {
    await clearAllLocalDatabases();
    window.location.href = window.location.origin + window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#071322] flex items-center justify-center p-6 text-slate-100 font-sans">
          <div className="glass-panel max-w-lg w-full p-8 rounded-2xl border border-[#33CCFF]/30 text-center space-y-4 shadow-2xl bg-[#0C2038]">
            <div className="w-12 h-12 rounded-2xl bg-[#0AE5D5]/15 border border-[#0AE5D5]/40 flex items-center justify-center mx-auto text-[#0AE5D5]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-extrabold text-white">Application State Reset Required</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cached browser data from a previous version needs to be refreshed.
            </p>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-[#071322] border border-slate-700 text-left font-mono text-[11px] text-[#33CCFF] overflow-x-auto">
                {String(this.state.error?.message || this.state.error)}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black gradient-cpt-brand text-[#071322] shadow-lg hover:brightness-110 transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Click to Purge Cache & Restore System</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
