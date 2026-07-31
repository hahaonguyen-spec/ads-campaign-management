import React, { useState } from 'react';
import { 
  Sparkles, AlertTriangle, CheckCircle2, Info, ArrowRight, RefreshCw, Zap, Wand2 
} from 'lucide-react';
import { generateCampaignInsights } from '../utils/analytics';
import { 
  generateContinuousAiRecommendations, 
  applyAiRecommendationToCampaign 
} from '../utils/aiProposalParser';

export default function AIInsights({ campaign, onUpdateCampaign }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [appliedRecs, setAppliedRecs] = useState({});

  const diagnosticInsights = generateCampaignInsights(campaign) || [];
  const continuousRecommendations = generateContinuousAiRecommendations(campaign) || [];

  const handleApplyRecommendation = (rec) => {
    if (!onUpdateCampaign || !rec.actionPayload) return;
    const updatedCampaign = applyAiRecommendationToCampaign(campaign, rec.actionPayload);
    onUpdateCampaign(updatedCampaign);
    setAppliedRecs(prev => ({ ...prev, [rec.id]: true }));
  };

  const handleRefreshAiAnalysis = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  if (!campaign) return null;

  const iconMap = {
    warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
    danger: <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-400 shrink-0" />
  };

  const bgMap = {
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    danger: 'bg-red-500/10 border-red-500/30 text-red-300',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-300'
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-5 bg-[#0C2038]/90">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl gradient-cpt-brand text-[#071322] font-black shadow">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Continuous AI Optimization & Diagnostic Engine
              <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#0AE5D5]/15 text-[#0AE5D5] border border-[#0AE5D5]/30">
                Live Monitoring Active
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Phân tích hiệu quả liên tục & đưa ra đề xuất hành động tối ưu cho chiến dịch</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefreshAiAnalysis}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#071322] hover:bg-slate-800 text-slate-200 border border-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#0AE5D5] ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Cập nhật Phân tích AI</span>
        </button>
      </div>

      {/* CONTINUOUS AI STRATEGIC RECOMMENDATIONS (1-CLICK ACTIONABLE) */}
      {continuousRecommendations.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-[#0AE5D5] uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Đề xuất Chiến lược AI Tối ưu hóa Thực tế (Actionable Recommendations)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {continuousRecommendations.map((rec) => (
              <div 
                key={rec.id} 
                className={`p-4 rounded-xl border ${bgMap[rec.type]} space-y-2 flex flex-col justify-between transition hover:brightness-105`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {iconMap[rec.type]}
                      <span className="text-xs font-bold leading-snug">{rec.title}</span>
                    </div>
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-black/40 text-slate-200 shrink-0">
                      {rec.category}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-90 leading-relaxed pl-5">{rec.description}</p>
                </div>

                {onUpdateCampaign && rec.actionLabel && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      disabled={appliedRecs[rec.id]}
                      onClick={() => handleApplyRecommendation(rec)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                        appliedRecs[rec.id]
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : 'bg-[#0AE5D5] text-[#071322] hover:brightness-110 shadow'
                      }`}
                    >
                      {appliedRecs[rec.id] ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đã áp dụng đề xuất</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-3.5 h-3.5" />
                          <span>{rec.actionLabel}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DIAGNOSTIC OVERVIEW INSIGHTS */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Chẩn đoán Chỉ số Hiệu suất (Diagnostic Performance Alerts)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {diagnosticInsights.map((item, idx) => (
            <div key={idx} className={`p-3 rounded-xl border ${bgMap[item.type]} flex items-start gap-2.5`}>
              {iconMap[item.type]}
              <div className="space-y-0.5">
                <span className="text-xs font-bold block">{item.title}</span>
                <p className="text-[11px] opacity-85 leading-relaxed">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
