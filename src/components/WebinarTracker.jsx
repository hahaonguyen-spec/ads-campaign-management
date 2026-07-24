import React, { useState } from 'react';
import { Video, RefreshCw, ExternalLink, CheckCircle2, ShieldAlert, Sparkles, Copy, Check, Users, DollarSign, Target } from 'lucide-react';

export default function WebinarTracker({ campaign, onUpdateWebinar }) {
  const [copied, setCopied] = useState(false);
  const [sessionUrl, setSessionUrl] = useState(
    campaign.overview?.trackingLink ? `${campaign.overview.trackingLink}&session_refresh=live` : 'https://cptcorp.com/webinar?utm_source=live_session_refresh'
  );

  const webinarData = campaign.webinarTracking && campaign.webinarTracking.length > 0
    ? campaign.webinarTracking[0]
    : {
        week: 'Session 1',
        registration: 500,
        attendance: 240,
        attendanceRate: '48.0%',
        openAccount: 140,
        kyc: 95,
        ftd: 38,
        ftt: 32,
        grossDeposit: 28000,
        netDeposit: 25000,
        lots: 480,
        nmi: 6250
      };

  const totalSpend = campaign.kpiTracking?.reduce((a, b) => a + (Number(b.spend) || 0), 0) || campaign.overview?.totalBudget || 3000;
  const costPerRegistration = webinarData.registration > 0 ? (totalSpend / webinarData.registration) : 0;
  const costPerAttendee = webinarData.attendance > 0 ? (totalSpend / webinarData.attendance) : 0;
  const costPerFtd = webinarData.ftd > 0 ? (totalSpend / webinarData.ftd) : 0;

  const handleCopyRefreshLink = () => {
    navigator.clipboard.writeText(sessionUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateRefreshLink = () => {
    const timestamp = Date.now();
    const newUrl = `${campaign.overview?.trackingLink || 'https://cptcorp.com/webinar'}?utm_source=webinar_live&refresh_token=${timestamp}`;
    setSessionUrl(newUrl);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Alert: 2-Tier Explanation & Pixel Expiry Warning */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/40 space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">2-Tier Webinar Tracking & Live Session Pixel Refresh</h3>
              <p className="text-xs text-slate-400">CPT-I Online Standard for External Registration Pages & Webinars</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Special 2-Tier Measurement
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Because webinar clients initially register on external pages (e.g. Zoom/Landing Forms) without visiting the main site to open an account immediately, browser attribution pixels can expire. We measure performance under <strong>2 Tiers</strong> and re-establish tracking via a <strong>live session link refresh</strong> during the webinar.
        </p>

        {/* Live Session Link Generator */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" />
              Live Webinar Link Refresh (Re-establish Pixel Attribution):
            </span>
            <span className="font-mono text-slate-300 break-all block">{sessionUrl}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleGenerateRefreshLink}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700"
            >
              Generate Fresh Token
            </button>
            <button
              onClick={handleCopyRefreshLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg gradient-gold-bg text-dark-900 font-bold text-xs shadow"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Link' : 'Copy Refresh Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* TIER 1 & TIER 2 CARDS */}

      {/* TIER 1: WEBINAR SUCCESS RATE */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-mono font-bold">1</span>
            Tier 1: Webinar Success Rate (Registrations & Attendance VS Spend)
          </h4>
          <span className="text-xs text-slate-400 font-mono">Total Spend: ${totalSpend.toLocaleString()}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Registrations</span>
            <span className="text-base font-extrabold font-mono text-white block mt-0.5">{webinarData.registration?.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 font-mono block">${costPerRegistration.toFixed(2)} / Reg</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Live Attendees</span>
            <span className="text-base font-extrabold font-mono text-amber-400 block mt-0.5">{webinarData.attendance?.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 font-mono block">${costPerAttendee.toFixed(2)} / Attendee</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
            <span className="text-base font-extrabold font-mono text-emerald-400 block mt-0.5">{webinarData.attendanceRate || '0%'}</span>
            <span className="text-[10px] text-emerald-500/80 block">Benchmark &gt; 40%</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Cost Per Attendee</span>
            <span className="text-base font-extrabold font-mono text-purple-400 block mt-0.5">${costPerAttendee.toFixed(2)}</span>
            <span className="text-[10px] text-slate-500 block">Spend / Attendees</span>
          </div>
        </div>
      </div>

      {/* TIER 2: ACCOUNT CONVERSION FUNNEL */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-mono font-bold">2</span>
            Tier 2: Total Account Conversion Funnel (Leads &gt; KYC &gt; FTD &gt; FTT &gt; Deposits &gt; Lots VS Spend)
          </h4>
          <span className="text-xs text-blue-400 font-mono font-bold">Cost/FTD: ${costPerFtd.toFixed(2)}</span>
        </div>

        {/* Funnel Flow Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">1. Leads</span>
            <span className="font-bold font-mono text-amber-400 block text-sm">{webinarData.openAccount?.toLocaleString() || webinarData.registration}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">2. KYC Verified</span>
            <span className="font-bold font-mono text-slate-200 block text-sm">{webinarData.kyc?.toLocaleString()}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-blue-500/30 bg-blue-500/5">
            <span className="text-[10px] text-blue-400 block uppercase font-bold">3. FTD *</span>
            <span className="font-bold font-mono text-blue-300 block text-sm">{webinarData.ftd?.toLocaleString()}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">4. FTT</span>
            <span className="font-bold font-mono text-slate-200 block text-sm">{webinarData.ftt?.toLocaleString()}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">5. Gross Dep ($)</span>
            <span className="font-bold font-mono text-slate-300 block text-sm">${webinarData.grossDeposit?.toLocaleString()}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-purple-500/30 bg-purple-500/5">
            <span className="text-[10px] text-purple-400 block uppercase font-bold">6. Net Dep ($)</span>
            <span className="font-bold font-mono text-purple-300 block text-sm">${webinarData.netDeposit?.toLocaleString()}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-rose-500/30 bg-rose-500/5">
            <span className="text-[10px] text-rose-400 block uppercase font-bold">7. Lots (Volume)</span>
            <span className="font-bold font-mono text-rose-300 block text-sm">{webinarData.lots?.toLocaleString()}</span>
          </div>
        </div>

        {/* NMI Return */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-300 font-semibold">Webinar NMI (Net Margin Income) Return:</span>
          <span className="text-sm font-extrabold font-mono text-emerald-400">${(webinarData.nmi || Math.round(webinarData.netDeposit * 0.25)).toLocaleString()}</span>
        </div>
      </div>

    </div>
  );
}
