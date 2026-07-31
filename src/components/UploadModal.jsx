import React, { useState, useEffect } from 'react';
import { 
  Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X, Sparkles, PlusCircle, 
  FormInput, Download, Globe, DollarSign, Target, Layers, FileText, Send, 
  RefreshCw, Key, Trash2, Edit3, Wand2, Calendar, HelpCircle, ChevronRight 
} from 'lucide-react';
import { parseCampaignExcel } from '../utils/excelParser';
import { 
  parseProposalWithAI, 
  SAMPLE_PROPOSALS, 
  fineTuneCampaignWithPrompt,
  extractTextFromProposalFile 
} from '../utils/aiProposalParser';

export default function UploadModal({ isOpen, onClose, onCampaignUploaded, initialTab = 'ai_proposal' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'ai_proposal', 'direct', or 'upload'
  
  // Excel Upload tab state
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
    week1Spend: 2500,
    week1Leads: 120,
    week1AccountOpened: 80,
    week1Kyc: 60,
    week1Ftd: 25,
    week1GrossDeposit: 12000,
    webinarTopic: '',
    webinarDate: ''
  });

  // AI Proposal Tab State
  const [proposalText, setProposalText] = useState(SAMPLE_PROPOSALS[0].text);
  const [proposalFileName, setProposalFileName] = useState('');
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('cpt_gemini_api_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiError, setAiError] = useState('');
  const [generatedCampaign, setGeneratedCampaign] = useState(null);
  const [fineTunePrompt, setFineTunePrompt] = useState('');

  // Keep API Key updated in localStorage
  useEffect(() => {
    if (geminiApiKey) {
      localStorage.setItem('cpt_gemini_api_key', geminiApiKey);
    }
  }, [geminiApiKey]);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

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

  // Handle AI Proposal Processing
  const handleAnalyzeProposal = async () => {
    if (!proposalText || !proposalText.trim()) {
      setAiError('Vui lòng nhập nội dung proposal hoặc chọn một bản mẫu bên dưới.');
      return;
    }

    setAiError('');
    setIsAiAnalyzing(true);
    try {
      const result = await parseProposalWithAI(proposalText, {
        apiKey: geminiApiKey
      });
      setGeneratedCampaign(result);
    } catch (err) {
      console.error('AI proposal analysis failed:', err);
      setAiError(err.message || 'Phân tích proposal thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // Handle Text File Upload for Proposal
  const handleProposalFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (text) {
        setProposalText(String(text));
        setAiError('');
      }
    };
    reader.readAsText(uploadedFile);
  };

  // Handle Fine-tuning with AI prompt
  const handleApplyFineTune = () => {
    if (!fineTunePrompt.trim() || !generatedCampaign) return;
    const updated = fineTuneCampaignWithPrompt(generatedCampaign, fineTunePrompt);
    setGeneratedCampaign(updated);
    setFineTunePrompt('');
  };

  // Handle Final Submission of Generated AI Campaign
  const handleSaveAiCampaign = () => {
    if (!generatedCampaign) return;
    onCampaignUploaded(generatedCampaign);
    onClose();
    setGeneratedCampaign(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel max-w-4xl w-full rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#071322] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl gradient-cpt-brand text-[#071322] font-black shadow-md shadow-[#0AE5D5]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                Create & Input Ads Campaign
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#0AE5D5]/10 text-[#0AE5D5] border border-[#0AE5D5]/30">
                  AI Engine Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">Generate campaigns from AI Proposals, direct forms, or Excel files</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-800 bg-[#0A192F] px-4 sm:px-6 pt-3 gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ai_proposal')}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition shrink-0 ${
              activeTab === 'ai_proposal'
                ? 'border-[#0AE5D5] text-[#0AE5D5]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>✨ AI Proposal Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('direct')}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition shrink-0 ${
              activeTab === 'direct'
                ? 'border-[#0AE5D5] text-[#0AE5D5]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FormInput className="w-4 h-4" />
            <span>Direct Input Form</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition shrink-0 ${
              activeTab === 'upload'
                ? 'border-[#0AE5D5] text-[#0AE5D5]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Excel File</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 bg-[#071322]">

          {/* ==================== TAB 1: AI PROPOSAL GENERATOR ==================== */}
          {activeTab === 'ai_proposal' && (
            <div className="space-y-5 text-xs">
              
              {!generatedCampaign ? (
                // PROPOSAL INPUT VIEW
                <div className="space-y-4">
                  
                  {/* Preset Selector & Gemini API Key Box */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                        <Wand2 className="w-4 h-4" /> Chọn Proposal Mẫu (Sample Presets):
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                        className="text-xs text-[#0AE5D5] hover:underline flex items-center gap-1 font-bold"
                      >
                        <Key className="w-3.5 h-3.5" />
                        {geminiApiKey ? '🔑 Gemini API Key Active (Đã lưu)' : '⚙️ Kết nối Gemini API Key của bạn'}
                      </button>
                    </div>

                    {/* Extended Gemini API Key Guide Box */}
                    {showApiKeyInput && (
                      <div className="p-4 rounded-xl bg-[#030914] border border-[#0AE5D5]/40 space-y-3 animate-fadeIn text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <Key className="w-4 h-4 text-amber-400" /> Hướng dẫn Kết nối Tài khoản Google Gemini:
                          </span>
                          <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-lg bg-[#0AE5D5] text-[#071322] font-extrabold hover:brightness-110 transition flex items-center gap-1 text-[11px]"
                          >
                            <span>🔗 Lấy Gemini API Key Miễn Phí (Google AI Studio)</span>
                          </a>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          Để kết nối tài khoản Gemini của bạn: Bấm nút trên ↗ để mở Google AI Studio (đăng nhập bằng Google account), ấn <strong>"Create API Key"</strong>, sau đó dán mã API Key bắt đầu bằng <code>AIzaSy...</code> vào ô bên dưới:
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            placeholder="Dán Gemini API Key (ví dụ: AIzaSy...)"
                            value={geminiApiKey}
                            onChange={(e) => setGeminiApiKey(e.target.value)}
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#0AE5D5]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (geminiApiKey) localStorage.setItem('cpt_gemini_api_key', geminiApiKey);
                              setShowApiKeyInput(false);
                            }}
                            className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 hover:bg-emerald-500/30"
                          >
                            Lưu API Key
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {SAMPLE_PROPOSALS.map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setProposalText(preset.text);
                            setProposalFileName('');
                            setAiError('');
                          }}
                          className={`p-2.5 rounded-xl text-left border transition flex flex-col justify-between ${
                            proposalText === preset.text
                              ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                              : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="font-bold text-xs line-clamp-1">{preset.title}</span>
                          <span className="text-[10px] text-slate-400 mt-1">Bấm để tải proposal mẫu</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PROPOSAL FILE DROPZONE & TEXTAREA */}
                  <div className="space-y-3">
                    {/* Drag-and-drop file upload zone */}
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={async (e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          const dropFile = e.dataTransfer.files[0];
                          setProposalFileName(dropFile.name);
                          setIsReadingFile(true);
                          try {
                            const text = await extractTextFromProposalFile(dropFile);
                            setProposalText(text);
                            setAiError('');
                          } catch (err) {
                            setAiError('Không thể đọc nội dung file. Vui lòng kiểm tra lại file.');
                          } finally {
                            setIsReadingFile(false);
                          }
                        }
                      }}
                      className="border-2 border-dashed border-[#0AE5D5]/40 hover:border-[#0AE5D5] bg-[#030914] hover:bg-[#071322] rounded-xl p-3.5 text-center transition cursor-pointer flex flex-col items-center justify-center gap-1.5"
                    >
                      <input
                        type="file"
                        accept=".xlsx,.xls,.pdf,.docx,.doc,.csv,.txt,.md,.json"
                        onChange={handleProposalFileUpload}
                        className="hidden"
                        id="ai-proposal-file-input"
                      />
                      <label htmlFor="ai-proposal-file-input" className="cursor-pointer w-full flex flex-col items-center">
                        <div className="flex items-center gap-2">
                          <Upload className="w-4 h-4 text-[#0AE5D5]" />
                          <span className="text-xs font-bold text-slate-100">
                            {isReadingFile ? 'Đang đọc nội dung file...' : 'Tải File Proposal từ Máy Tính (Kéo & Thả hoặc Bấm vào đây)'}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 mt-0.5">
                          Hỗ trợ định dạng: <strong>Excel (.xlsx, .xls), PDF (.pdf), Word (.docx), CSV, TXT, Markdown</strong>
                        </span>
                        {proposalFileName && (
                          <span className="mt-1.5 text-xs font-extrabold px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            📄 Đã tải file: {proposalFileName}
                          </span>
                        )}
                      </label>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold flex items-center gap-2 text-[11px]">
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        Nội dung Proposal đã trích xuất (Có thể xem và chỉnh sửa trực tiếp):
                      </label>
                      <textarea
                        rows={8}
                        value={proposalText}
                        onChange={(e) => setProposalText(e.target.value)}
                        placeholder="Dán hoặc thả nội dung đề xuất chiến dịch (proposal PDF, Word, Excel, TXT...) của bạn tại đây..."
                        className="w-full bg-[#030914] border border-slate-700/80 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-500 font-mono leading-relaxed focus:outline-none focus:border-[#0AE5D5] transition shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Error Notification */}
                  {aiError && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{aiError}</span>
                    </div>
                  )}

                  {/* Action Submit */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      disabled={isAiAnalyzing}
                      onClick={handleAnalyzeProposal}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black gradient-cpt-brand text-[#071322] hover:brightness-110 disabled:opacity-50 transition shadow-lg shadow-[#0AE5D5]/20"
                    >
                      {isAiAnalyzing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#071322] border-t-transparent rounded-full animate-spin"></div>
                          <span>AI đang phân tích Proposal & tạo Form Campaign...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>⚡ Phân tích Proposal bằng AI & Đưa vào Form</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                // GENERATED EDITABLE CAMPAIGN FORM VIEW
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* AI Strategic Diagnostics Header Banner */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-amber-500/10 border border-[#0AE5D5]/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <h3 className="font-bold text-white text-sm">
                          AI Proposal Analysis Complete ({generatedCampaign.aiAnalysis?.confidenceScore || 95}% Match)
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setGeneratedCampaign(null)}
                        className="text-xs text-slate-400 hover:text-white underline"
                      >
                        Đổi Proposal khác
                      </button>
                    </div>

                    <p className="text-xs text-emerald-300 font-medium">
                      🎯 <strong className="text-white">Chiến lược đề xuất:</strong> {generatedCampaign.overview?.objective}
                    </p>

                    {generatedCampaign.aiAnalysis?.recommendations && (
                      <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-800">
                        {generatedCampaign.aiAnalysis.recommendations.map((rec, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* FORM SECTION 1: OVERVIEW */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                      <Globe className="w-4 h-4" /> 1. Thông tin Tổng quan Chiến dịch (Editable)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Tên chiến dịch *</label>
                        <input
                          type="text"
                          value={generatedCampaign.overview.name}
                          onChange={(e) => setGeneratedCampaign({
                            ...generatedCampaign,
                            overview: { ...generatedCampaign.overview, name: e.target.value }
                          })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-[#0AE5D5]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Người phụ trách (Owner)</label>
                        <input
                          type="text"
                          value={generatedCampaign.overview.owner}
                          onChange={(e) => setGeneratedCampaign({
                            ...generatedCampaign,
                            overview: { ...generatedCampaign.overview, owner: e.target.value }
                          })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-[#0AE5D5]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Khu vực / Quốc gia</label>
                        <input
                          type="text"
                          value={generatedCampaign.overview.region}
                          onChange={(e) => setGeneratedCampaign({
                            ...generatedCampaign,
                            overview: { ...generatedCampaign.overview, region: e.target.value }
                          })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-[#0AE5D5]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Loại hình Campaign</label>
                        <select
                          value={generatedCampaign.overview.type}
                          onChange={(e) => setGeneratedCampaign({
                            ...generatedCampaign,
                            overview: { ...generatedCampaign.overview, type: e.target.value }
                          })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-[#0AE5D5]"
                        >
                          <option value="Lead Gen">Lead Gen Campaign</option>
                          <option value="Webinar">Webinar Campaign</option>
                          <option value="Brand Campaign">Brand Awareness</option>
                          <option value="CPA Performance">CPA Performance</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* FORM SECTION 2: BUDGET & TARGET KPIS */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                      <Target className="w-4 h-4" /> 2. Ngân sách & Chỉ tiêu KPI Mục tiêu
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Tổng ngân sách ($)</label>
                        <input
                          type="number"
                          value={generatedCampaign.overview.totalBudget}
                          onChange={(e) => {
                            const newB = Number(e.target.value) || 0;
                            setGeneratedCampaign({
                              ...generatedCampaign,
                              overview: { ...generatedCampaign.overview, totalBudget: newB }
                            });
                          }}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Target Leads</label>
                        <input
                          type="number"
                          value={generatedCampaign.kpiTargets.leads}
                          onChange={(e) => setGeneratedCampaign({
                            ...generatedCampaign,
                            kpiTargets: { ...generatedCampaign.kpiTargets, leads: Number(e.target.value) || 0 }
                          })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Target CPL ($)</label>
                        <input
                          type="number"
                          value={generatedCampaign.kpiTargets.cpl}
                          onChange={(e) => setGeneratedCampaign({
                            ...generatedCampaign,
                            kpiTargets: { ...generatedCampaign.kpiTargets, cpl: Number(e.target.value) || 0 }
                          })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Target FTDs</label>
                        <input
                          type="number"
                          value={generatedCampaign.kpiTargets.ftd}
                          onChange={(e) => setGeneratedCampaign({
                            ...generatedCampaign,
                            kpiTargets: { ...generatedCampaign.kpiTargets, ftd: Number(e.target.value) || 0 }
                          })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* FORM SECTION 3: TIMELINE & DELIVERABLES */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Timeline */}
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-xs">Lịch thực thi (Timeline)</h4>
                        <button
                          type="button"
                          onClick={() => setGeneratedCampaign({
                            ...generatedCampaign,
                            timeline: [...generatedCampaign.timeline, { task: 'New Task', owner: generatedCampaign.overview.owner, status: 'Pending', deadline: 'Week 2' }]
                          })}
                          className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <PlusCircle className="w-3 h-3" /> Thêm task
                        </button>
                      </div>

                      <div className="space-y-2">
                        {generatedCampaign.timeline.map((t, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 text-[11px]">
                            <input
                              type="text"
                              value={t.task}
                              onChange={(e) => {
                                const newT = [...generatedCampaign.timeline];
                                newT[idx].task = e.target.value;
                                setGeneratedCampaign({ ...generatedCampaign, timeline: newT });
                              }}
                              className="flex-1 bg-transparent text-slate-200 focus:outline-none font-medium"
                            />
                            <span className="text-slate-500 font-mono">{t.deadline}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newT = generatedCampaign.timeline.filter((_, i) => i !== idx);
                                setGeneratedCampaign({ ...generatedCampaign, timeline: newT });
                              }}
                              className="text-slate-500 hover:text-red-400 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-amber-400 uppercase tracking-wider text-xs">Hạng mục Bàn giao (Deliverables)</h4>
                        <button
                          type="button"
                          onClick={() => setGeneratedCampaign({
                            ...generatedCampaign,
                            deliverables: [...generatedCampaign.deliverables, { name: 'New Deliverable', status: 'Ready', link: '#' }]
                          })}
                          className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <PlusCircle className="w-3 h-3" /> Thêm bàn giao
                        </button>
                      </div>

                      <div className="space-y-2">
                        {generatedCampaign.deliverables.map((d, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 text-[11px]">
                            <input
                              type="text"
                              value={d.name}
                              onChange={(e) => {
                                const newD = [...generatedCampaign.deliverables];
                                newD[idx].name = e.target.value;
                                setGeneratedCampaign({ ...generatedCampaign, deliverables: newD });
                              }}
                              className="flex-1 bg-transparent text-slate-200 focus:outline-none font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newD = generatedCampaign.deliverables.filter((_, i) => i !== idx);
                                setGeneratedCampaign({ ...generatedCampaign, deliverables: newD });
                              }}
                              className="text-slate-500 hover:text-red-400 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* FINE-TUNE WITH AI PROMPT BOX */}
                  <div className="p-3.5 rounded-xl bg-[#030914] border border-[#0AE5D5]/40 space-y-2">
                    <label className="text-[11px] font-bold text-[#0AE5D5] flex items-center gap-1.5">
                      <Wand2 className="w-3.5 h-3.5" /> Thêm yêu cầu chỉnh sửa nhanh bằng AI Prompt:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={fineTunePrompt}
                        onChange={(e) => setFineTunePrompt(e.target.value)}
                        placeholder="Ví dụ: Tăng ngân sách lên 20k, giao cho Nguyen Hao Ha và phân bổ 60% Meta Ads..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#0AE5D5]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyFineTune}
                        className="px-4 py-1.5 rounded-xl bg-[#0AE5D5] text-[#071322] font-bold text-xs hover:brightness-110 transition shrink-0 flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" /> Apply
                      </button>
                    </div>
                  </div>

                  {/* FINAL ACTION BUTTONS */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setGeneratedCampaign(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      Làm lại (Re-analyze)
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveAiCampaign}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black gradient-cpt-brand text-[#071322] hover:brightness-110 transition shadow-lg shadow-[#0AE5D5]/20"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>✨ Xác nhận & Tạo Campaign vào Hệ Thống</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ==================== TAB 2: DIRECT INPUT FORM ==================== */}
          {activeTab === 'direct' && (
            <form onSubmit={handleDirectFormSubmit} className="space-y-4 text-xs">
              
              {/* Overview */}
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
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#0AE5D5]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Campaign Owner</label>
                    <input
                      type="text"
                      placeholder="e.g. Nguyen Hao Ha"
                      value={formData.owner}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#0AE5D5]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Region / Country</label>
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#0AE5D5]"
                    >
                      <option value="Vietnam (VN)">🇻🇳 Vietnam (VN)</option>
                      <option value="Thailand (TH)">🇹🇭 Thailand (TH)</option>
                      <option value="Malaysia (MY)">🇲🇾 Malaysia (MY)</option>
                      <option value="SEA Regional">🌏 SEA Regional</option>
                      <option value="Global">🌍 Global</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Campaign Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#0AE5D5]"
                    >
                      <option value="Lead Gen">Lead Gen Campaign</option>
                      <option value="Webinar">Webinar Campaign</option>
                      <option value="Brand Campaign">Brand Awareness</option>
                      <option value="CPA Performance">CPA Performance</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Budget & KPI Targets */}
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
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Target Leads</label>
                    <input
                      type="number"
                      value={formData.targetLeads}
                      onChange={(e) => setFormData({ ...formData, targetLeads: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Target CPL ($)</label>
                    <input
                      type="number"
                      value={formData.targetCpl}
                      onChange={(e) => setFormData({ ...formData, targetCpl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Target FTDs</label>
                    <input
                      type="number"
                      value={formData.targetFtd}
                      onChange={(e) => setFormData({ ...formData, targetFtd: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold gradient-cpt-brand text-[#071322] hover:brightness-110 transition shadow-lg shadow-[#0AE5D5]/20"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Campaign</span>
                </button>
              </div>
            </form>
          )}

          {/* ==================== TAB 3: EXCEL FILE UPLOAD ==================== */}
          {activeTab === 'upload' && (
            <div className="space-y-5">
              {!previewData && (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
                  }}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer flex flex-col items-center justify-center gap-3 ${
                    isDragging 
                      ? 'border-[#0AE5D5] bg-[#0AE5D5]/10' 
                      : 'border-slate-700/80 hover:border-[#0AE5D5]/50 bg-slate-900/40 hover:bg-slate-900/70'
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
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#0AE5D5] mb-2 shadow-inner">
                      <FileSpreadsheet className="w-7 h-7" />
                    </div>
                    <span className="text-sm font-semibold text-slate-200 mb-1">
                      Click to browse or drop CPT Excel Form here
                    </span>
                    <span className="text-xs text-slate-400">
                      Supports standard CPT template files (.xlsx, .xls)
                    </span>
                  </label>
                </div>
              )}

              {parsing && (
                <div className="p-6 text-center space-y-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <div className="w-8 h-8 border-3 border-[#0AE5D5] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-slate-300 font-medium">Parsing campaign sheets...</p>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {previewData && !parsing && (
                <div className="space-y-4 animate-fadeIn text-xs">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-semibold">Extracted CPT Form Data Successfully!</span>
                    </div>
                    <button 
                      onClick={() => { setPreviewData(null); setFile(null); }}
                      className="text-slate-400 hover:text-white underline text-[11px]"
                    >
                      Upload different file
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Campaign Name:</span>
                      <span className="font-bold text-[#0AE5D5]">{previewData.overview.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Budget:</span>
                      <span className="text-emerald-400 font-mono font-bold">${previewData.overview.totalBudget?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleConfirmImport}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold gradient-cpt-brand text-[#071322] hover:brightness-110 transition shadow-lg shadow-[#0AE5D5]/20"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Confirm & Import Campaign</span>
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
