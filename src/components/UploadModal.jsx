import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X, Sparkles, PlusCircle, FormInput, Download, Globe, DollarSign, Target, Layers } from 'lucide-react';
import { parseCampaignExcel } from '../utils/excelParser';

export default function UploadModal({ isOpen, onClose, onCampaignUploaded }) {
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' or 'upload'
  
  // Upload tab state
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState('');
  const [previewData, setPreviewData] = useState(null);

  // Direct Input tab state
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    region: 'Vietnam (VN)',
    type: 'Lead Gen',
    status: 'Launching',
    totalBudget: 10000,
    targetLeads: 500,
    targetCpl: 20,
    targetFtd: 100,
    targetVolume: 50000,
    channels: ['Meta Ads', 'Google Search'],
    // Initial Week 1 Data
    week1Spend: 2500,
    week1Leads: 120,
    week1AccountOpened: 80,
    week1Kyc: 60,
    week1Ftd: 25,
    week1GrossDeposit: 12000,
    // Optional Webinar details
    webinarTopic: '',
    webinarDate: ''
  });

  if (!isOpen) return null;

  // Handle Excel File Parsing
  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.name.match(/\.(xlsx|xls)$/i)) {
      setError('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setFile(selectedFile);
    setError('');
    setParsing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target.result;
        const parsedCampaign = parseCampaignExcel(buffer);
        if (parsedCampaign.overview.name === 'Untitled Campaign' || parsedCampaign.overview.name === 'New CPT Campaign') {
          parsedCampaign.overview.name = selectedFile.name.replace(/\.[^/.]+$/, "");
        }
        setPreviewData(parsedCampaign);
        setParsing(false);
      } catch (err) {
        console.error('Parse error:', err);
        setError('Failed to parse Excel file. Please ensure it follows the CPT Campaign template format.');
        setParsing(false);
      }
    };

    reader.onerror = () => {
      setError('Error reading file. Please try again.');
      setParsing(false);
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (previewData) {
      onCampaignUploaded(previewData);
      onClose();
      setFile(null);
      setPreviewData(null);
    }
  };

  // Handle Direct Form Submission
  const handleDirectFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please enter a campaign name.');
      return;
    }

    const campaignId = 'cpt-' + Date.now();
    const newCampaign = {
      id: campaignId,
      overview: {
        id: campaignId,
        name: formData.name,
        owner: formData.owner || 'Marketing Manager',
        region: formData.region === 'Custom' ? (formData.regionCustom || 'Vietnam (VN)') : formData.region,
        type: formData.type,
        status: formData.status,
        totalBudget: Number(formData.totalBudget) || 10000,
        startDate: new Date().toISOString().split('T')[0],
        channels: formData.channels
      },
      kpiTargets: {
        leads: Number(formData.targetLeads) || 500,
        cpl: Number(formData.targetCpl) || 20,
        ftd: Number(formData.targetFtd) || 100,
        volume: Number(formData.targetVolume) || 50000
      },
      timeline: [
        { task: 'Campaign Setup & Ad Assets', owner: formData.owner || 'Team', status: 'Completed', deadline: 'Week 1' },
        { task: 'Launch Meta & Google Ads', owner: formData.owner || 'Team', status: 'In Progress', deadline: 'Week 1' },
        { task: 'Optimize Conversion Funnel', owner: formData.owner || 'Team', status: 'Pending', deadline: 'Week 2' }
      ],
      deliverables: [
        { name: 'Ad Creatives & Video Banners', status: 'Ready', link: '#' },
        { name: 'Landing Page & Lead Form', status: 'Live', link: '#' }
      ],
      budget: [
        { channel: 'Meta Ads', allocated: Math.round(formData.totalBudget * 0.6), spent: Number(formData.week1Spend) },
        { channel: 'Google Search', allocated: Math.round(formData.totalBudget * 0.4), spent: 0 }
      ],
      kpiTracking: [
        {
          week: '1',
          dateRange: 'Week 1',
          channel: formData.channels[0] || 'Meta Ads',
          spend: Number(formData.week1Spend) || 0,
          impressions: (Number(formData.week1Leads) || 1) * 80,
          clicks: (Number(formData.week1Leads) || 1) * 12,
          leads: Number(formData.week1Leads) || 0,
          cpl: Number(formData.week1Leads) > 0 ? (Number(formData.week1Spend) / Number(formData.week1Leads)).toFixed(2) : 0,
          accountOpened: Number(formData.week1AccountOpened) || 0,
          kyc: Number(formData.week1Kyc) || 0,
          ftd: Number(formData.week1Ftd) || 0,
          ftt: Math.round((Number(formData.week1Ftd) || 0) * 0.8),
          grossDeposit: Number(formData.week1GrossDeposit) || 0,
          netDeposit: Number(formData.week1GrossDeposit) || 0,
          lots: Math.round((Number(formData.week1GrossDeposit) || 0) / 500),
          nmi: Number(formData.week1GrossDeposit) || 0
        }
      ],
      webinarTracking: formData.type === 'Webinar' ? [
        {
          topic: formData.webinarTopic || 'CPT Market Insights Webinar',
          date: formData.webinarDate || new Date().toISOString().split('T')[0],
          registrations: (Number(formData.week1Leads) || 100),
          attendees: Math.round((Number(formData.week1Leads) || 100) * 0.5),
          ftdCount: Number(formData.week1Ftd) || 10,
          totalDeposit: Number(formData.week1GrossDeposit) || 5000
        }
      ] : null
    };

    onCampaignUploaded(newCampaign);
    onClose();
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/template_download.tmp';
    link.download = 'CPT_Ads_Campaign_Form_Template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel max-w-3xl w-full rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl gradient-gold-bg text-dark-900 font-bold">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                New Campaign Input Form
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Cloud Storage Sync
                </span>
              </h2>
              <p className="text-xs text-slate-400">Input campaign details directly or upload an Excel form</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('direct')}
            className={`pb-3 px-2 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'direct'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FormInput className="w-4 h-4" />
            <span>Direct Input Form</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 px-2 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'upload'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Excel / CSV Form File</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">

          {/* TAB 1: DIRECT INPUT FORM */}
          {activeTab === 'direct' && (
            <form onSubmit={handleDirectFormSubmit} className="space-y-4 text-xs">
              
              {/* Campaign Overview Section */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Campaign Overview
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Campaign Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Q3 SEA Meta & Google Acquisition"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Campaign Owner</label>
                    <input
                      type="text"
                      placeholder="e.g. Nguyen Hao Ha"
                      value={formData.owner}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Region / Country (Ads Account)</label>
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full bg-[#071322] border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#0AE5D5]"
                    >
                      <optgroup label="Southeast Asia (SEA)">
                        <option value="Vietnam (VN)">🇻🇳 Vietnam (VN)</option>
                        <option value="Thailand (TH)">🇹🇭 Thailand (TH)</option>
                        <option value="Malaysia (MY)">🇲🇾 Malaysia (MY)</option>
                        <option value="Indonesia (ID)">🇮🇩 Indonesia (ID)</option>
                        <option value="Philippines (PH)">🇵🇭 Philippines (PH)</option>
                        <option value="Singapore (SG)">🇸🇬 Singapore (SG)</option>
                        <option value="SEA Regional">🌏 SEA Regional (Multi-country)</option>
                      </optgroup>
                      <optgroup label="East Asia & Pacific">
                        <option value="Taiwan (TW)">🇹🇼 Taiwan (TW)</option>
                        <option value="Hong Kong (HK)">🇭🇰 Hong Kong (HK)</option>
                        <option value="Korea (KR)">🇰🇷 Korea (KR)</option>
                        <option value="Japan (JP)">🇯🇵 Japan (JP)</option>
                      </optgroup>
                      <optgroup label="South Asia & Middle East">
                        <option value="India (IN)">🇮🇳 India (IN)</option>
                        <option value="UAE / Dubai (AE)">🇦🇪 UAE / Dubai (AE)</option>
                        <option value="Saudi Arabia (KSA)">🇸🇦 Saudi Arabia (KSA)</option>
                        <option value="MENA Regional">🕌 MENA Regional</option>
                      </optgroup>
                      <optgroup label="Americas & Europe">
                        <option value="Brazil (BR)">🇧🇷 Brazil (BR)</option>
                        <option value="Mexico (MX)">🇲🇽 Mexico (MX)</option>
                        <option value="LatAm Regional">💃 LatAm Regional</option>
                        <option value="UK & Europe">🇪🇺 UK & Europe</option>
                      </optgroup>
                      <optgroup label="Global & Custom">
                        <option value="Global">🌍 Global (Multi-Region)</option>
                        <option value="Custom">✏️ Custom Country / Ad Account...</option>
                      </optgroup>
                    </select>

                    {formData.region === 'Custom' && (
                      <input
                        type="text"
                        placeholder="Enter specific country or ad account (e.g. VN Meta Ads #2)..."
                        onChange={(e) => setFormData({ ...formData, regionCustom: e.target.value })}
                        className="w-full bg-[#071322] border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#0AE5D5] mt-2 animate-fadeIn"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Campaign Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                    >
                      <option value="Lead Gen">Lead Gen Campaign</option>
                      <option value="Webinar">Webinar Campaign</option>
                      <option value="Brand Campaign">Brand Awareness</option>
                      <option value="CPA Performance">CPA Performance</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Budget & KPI Targets Section */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> Budget & KPI Targets
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Total Budget ($)</label>
                    <input
                      type="number"
                      value={formData.totalBudget}
                      onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Target Leads</label>
                    <input
                      type="number"
                      value={formData.targetLeads}
                      onChange={(e) => setFormData({ ...formData, targetLeads: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Target CPL ($)</label>
                    <input
                      type="number"
                      value={formData.targetCpl}
                      onChange={(e) => setFormData({ ...formData, targetCpl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Target FTDs</label>
                    <input
                      type="number"
                      value={formData.targetFtd}
                      onChange={(e) => setFormData({ ...formData, targetFtd: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Initial Week 1 Performance Input */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" /> Initial Week 1 Performance (Optional)
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Week 1 Spend ($)</label>
                    <input
                      type="number"
                      value={formData.week1Spend}
                      onChange={(e) => setFormData({ ...formData, week1Spend: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Week 1 Leads</label>
                    <input
                      type="number"
                      value={formData.week1Leads}
                      onChange={(e) => setFormData({ ...formData, week1Leads: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Week 1 FTDs</label>
                    <input
                      type="number"
                      value={formData.week1Ftd}
                      onChange={(e) => setFormData({ ...formData, week1Ftd: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Gross Deposit ($)</label>
                    <input
                      type="number"
                      value={formData.week1GrossDeposit}
                      onChange={(e) => setFormData({ ...formData, week1GrossDeposit: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Webinar optional details */}
              {formData.type === 'Webinar' && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    Webinar Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Webinar Topic</label>
                      <input
                        type="text"
                        placeholder="e.g. Master Gold & Forex Trading 2026"
                        value={formData.webinarTopic}
                        onChange={(e) => setFormData({ ...formData, webinarTopic: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Webinar Date</label>
                      <input
                        type="date"
                        value={formData.webinarDate}
                        onChange={(e) => setFormData({ ...formData, webinarDate: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold gradient-gold-bg text-dark-900 hover:brightness-110 transition shadow-lg shadow-amber-900/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Campaign & Sync to Cloud</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: EXCEL FILE UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-5">
              
              {/* Dropzone */}
              {!previewData && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer flex flex-col items-center justify-center gap-3 ${
                    isDragging 
                      ? 'border-amber-400 bg-amber-500/10' 
                      : 'border-slate-700/80 hover:border-amber-500/50 bg-slate-900/40 hover:bg-slate-900/70'
                  }`}
                >
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                    className="hidden"
                    id="file-upload-input"
                  />
                  <label htmlFor="file-upload-input" className="cursor-pointer flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 mb-2 shadow-inner">
                      <FileSpreadsheet className="w-7 h-7" />
                    </div>
                    <span className="text-sm font-semibold text-slate-200 mb-1">
                      Click to browse or drop CPT Excel Form here
                    </span>
                    <span className="text-xs text-slate-400 mb-3">
                      Supports standard CPT template files (.xlsx, .xls)
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); handleDownloadTemplate(); }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition"
                    >
                      <Download className="w-3.5 h-3.5" /> Download CPT Excel Template
                    </button>
                  </label>
                </div>
              )}

              {/* Parsing Loading Indicator */}
              {parsing && (
                <div className="p-6 text-center space-y-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-slate-300 font-medium">Parsing campaign overview, timeline, deliverables, budget & KPI sheets...</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Preview Parsed Campaign Data */}
              {previewData && !parsing && (
                <div className="space-y-4 animate-fadeIn text-xs">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-semibold">Successfully Extracted CPT Form Data!</span>
                    </div>
                    <button 
                      onClick={() => { setPreviewData(null); setFile(null); }}
                      className="text-slate-400 hover:text-white underline text-[11px]"
                    >
                      Upload different file
                    </button>
                  </div>

                  {/* Extracted Details Box */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Campaign Name:</span>
                      <span className="font-bold text-amber-400">{previewData.overview.name}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 block">Owner:</span>
                        <span className="text-slate-200 font-medium">{previewData.overview.owner}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Region / Type:</span>
                        <span className="text-slate-200 font-medium">{previewData.overview.region} • {previewData.overview.type}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Total Budget:</span>
                        <span className="text-emerald-400 font-mono font-bold">${previewData.overview.totalBudget?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">KPI Weeks Extracted:</span>
                        <span className="text-slate-200 font-mono">{previewData.kpiTracking?.length || 0} Weeks</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      disabled={!previewData || parsing}
                      onClick={handleConfirmImport}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold gradient-gold-bg text-dark-900 hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none transition shadow-lg shadow-amber-900/20"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Confirm & Import to Cloud System</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
