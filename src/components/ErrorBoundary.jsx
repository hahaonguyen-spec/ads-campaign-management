import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-6 text-slate-100 font-sans">
          <div className="glass-panel max-w-lg w-full p-8 rounded-2xl border border-slate-800 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-extrabold text-white">Application State Reset Required</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cached browser state from a previous test run needs to be refreshed.
            </p>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-left font-mono text-[11px] text-rose-400 overflow-x-auto">
                {String(this.state.error?.message || this.state.error)}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold gradient-gold-bg text-dark-900 shadow-lg hover:brightness-110 transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Click to Restore Clean Demo Data</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
