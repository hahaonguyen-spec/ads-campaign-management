import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X, Sparkles, FileText } from 'lucide-react';
import { parseCampaignExcel } from '../utils/excelParser';

export default function UploadModal({ isOpen, onClose, onCampaignUploaded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState('');
  const [previewData, setPreviewData] = useState(null);

  if (!isOpen) return null;

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
        // use uploaded file name if campaign name is default
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
      // reset local state
      setFile(null);
      setPreviewData(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel max-w-2xl w-full rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl gradient-gold-bg text-dark-900 font-bold">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Upload New Ads Campaign
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  CPT Form Parser
                </span>
              </h2>
              <p className="text-xs text-slate-400">System will automatically analyze all 6 sheets from your Excel template</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
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
                <span className="text-xs text-slate-400">
                  Supports standard CPT template files (.xlsx, .xls)
                </span>
              </label>
            </div>
          )}

          {/* Loading Indicator */}
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
            <div className="space-y-4 animate-fadeIn">
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
                    <span className="text-emerald-400 font-mono font-bold">${previewData.overview.totalBudget.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">KPI Weeks Extracted:</span>
                    <span className="text-slate-200 font-mono">{previewData.kpiTracking?.length || 0} Weeks</span>
                  </div>
                </div>

                {/* Sheets checklist indicator */}
                <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">✓ Overview Brief</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">✓ {previewData.timeline?.length || 0} Timeline Tasks</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">✓ {previewData.deliverables?.length || 0} Deliverables</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">✓ {previewData.budget?.length || 0} Budget Lines</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">✓ Weekly KPI Matrix</span>
                  {previewData.webinarTracking && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-medium">✓ Webinar Tracking Included</span>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition"
          >
            Cancel
          </button>

          <button
            disabled={!previewData || parsing}
            onClick={handleConfirmImport}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold gradient-gold-bg text-dark-900 hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none transition shadow-lg shadow-amber-900/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Confirm & Add to System</span>
          </button>
        </div>

      </div>
    </div>
  );
}
