import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CampaignDetail from './components/CampaignDetail';
import UploadModal from './components/UploadModal';
import MetricInputModal from './components/MetricInputModal';
import CloudSettingsModal from './components/CloudSettingsModal';
import MobileBottomNav from './components/MobileBottomNav';
import { loadCampaignsFromPermanentStorage, saveCampaignsToPermanentStorage } from './utils/dbStorage';
import { saveCampaignsToCloud, loadCampaignsFromCloud } from './utils/cloudStorage';

export default function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadModalTab, setUploadModalTab] = useState('ai_proposal');
  const [isCloudSettingsOpen, setIsCloudSettingsOpen] = useState(false);
  const [metricModalCampaign, setMetricModalCampaign] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenUpload = (tab = 'direct') => {
    setUploadModalTab(tab);
    setIsUploadOpen(true);
  };

  const handleOpenAiProposal = () => {
    setUploadModalTab('ai_proposal');
    setIsUploadOpen(true);
  };
  
  // Font Size Scale State ('normal' | 'large' | 'xl')
  const [textSizeScale, setTextSizeScale] = useState(() => {
    return localStorage.getItem('cpt_text_scale') || 'normal';
  });

  const handleTextSizeChange = (newScale) => {
    setTextSizeScale(newScale);
    localStorage.setItem('cpt_text_scale', newScale);
  };

  // Clear legacy sample data cache once
  useEffect(() => {
    if (!localStorage.getItem('cpt_sample_cleared_v1')) {
      localStorage.clear();
      localStorage.setItem('cpt_sample_cleared_v1', 'true');
    }
  }, []);

  // Load saved campaigns from IndexedDB / Local Storage & Cloud Storage on startup
  useEffect(() => {
    async function initStorage() {
      // 1. Try loading from permanent local storage
      let localData = await loadCampaignsFromPermanentStorage([]);
      
      // 2. Try loading from Cloud storage
      try {
        const cloudData = await loadCampaignsFromCloud();
        if (cloudData && Array.isArray(cloudData) && cloudData.length > 0) {
          localData = cloudData;
        }
      } catch (e) {
        console.warn('Cloud sync on load notice:', e);
      }

      setCampaigns(localData);
      setIsLoaded(true);
    }
    initStorage();
  }, []);

  // Save to Permanent Local Storage + Cloud Storage whenever campaigns change
  useEffect(() => {
    if (isLoaded) {
      saveCampaignsToPermanentStorage(campaigns);
      saveCampaignsToCloud(campaigns);
    }
  }, [campaigns, isLoaded]);

  const handleCampaignUploaded = (newCampaign) => {
    const updated = [newCampaign, ...campaigns];
    setCampaigns(updated);
    setSelectedCampaignId(newCampaign.id);
  };

  const handleUpdateCampaign = (updatedCampaign) => {
    setCampaigns(prev => prev.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
  };

  const handleDeleteCampaign = (id) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    if (selectedCampaignId === id) setSelectedCampaignId(null);
  };

  const handleResetDemo = () => {
    if (confirm('Clear all local & cloud campaigns and start fresh?')) {
      localStorage.clear();
      localStorage.setItem('cpt_sample_cleared_v1', 'true');
      setCampaigns([]);
      setSelectedCampaignId(null);
      saveCampaignsToPermanentStorage([]);
      saveCampaignsToCloud([]);
    }
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/template_download.tmp';
    link.download = 'CPT_Ads_Campaign_Form_Template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedCampaign = (campaigns || []).find(c => c.id === selectedCampaignId);
  const activeCount = (campaigns || []).filter(c => c.overview?.status === 'Launching' || (c.kpiTracking && c.kpiTracking.some(r => Number(r.spend) > 0))).length;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-6 text-slate-100 font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-300">Loading CPT Campaign System & Cloud Storage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans">
      
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenUpload={() => handleOpenUpload('direct')}
        onOpenAiProposal={handleOpenAiProposal}
        onOpenCloudSettings={() => setIsCloudSettingsOpen(true)}
        onDownloadTemplate={handleDownloadTemplate}
        onResetDemo={handleResetDemo}
        campaignCount={(campaigns || []).length}
        activeCount={activeCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-24 md:pb-8">
        {selectedCampaign ? (
          <CampaignDetail
            campaign={selectedCampaign}
            onBack={() => setSelectedCampaignId(null)}
            onUpdateCampaign={handleUpdateCampaign}
            onOpenMetricInput={(c) => setMetricModalCampaign(c)}
          />
        ) : (
          <Dashboard
            campaigns={campaigns || []}
            onSelectCampaign={(c) => setSelectedCampaignId(c.id)}
            onDeleteCampaign={handleDeleteCampaign}
            onOpenUpload={() => handleOpenUpload('direct')}
            onOpenAiProposal={handleOpenAiProposal}
            onOpenMetricInput={(c) => setMetricModalCampaign(c)}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}
      </main>

      <MobileBottomNav
        activeTab={selectedCampaignId ? 'detail' : 'dashboard'}
        onGoHome={() => setSelectedCampaignId(null)}
        onOpenUpload={() => handleOpenUpload('ai_proposal')}
        onOpenCloudSettings={() => setIsCloudSettingsOpen(true)}
        onToggleSearch={() => {
          setSelectedCampaignId(null);
          const el = document.getElementById('global-search-input');
          if (el) el.focus();
        }}
      />

      <UploadModal
        isOpen={isUploadOpen}
        initialTab={uploadModalTab}
        onClose={() => setIsUploadOpen(false)}
        onCampaignUploaded={handleCampaignUploaded}
      />

      <CloudSettingsModal
        isOpen={isCloudSettingsOpen}
        onClose={() => setIsCloudSettingsOpen(false)}
        campaigns={campaigns}
        onCloudDataLoaded={(loadedData) => setCampaigns(loadedData)}
      />

      <MetricInputModal
        isOpen={!!metricModalCampaign}
        onClose={() => setMetricModalCampaign(null)}
        campaign={metricModalCampaign}
        onSaveMetrics={handleUpdateCampaign}
      />

      <footer className="border-t border-slate-800/80 bg-[#0B0F17] py-6 text-center text-xs text-slate-500 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-slate-400">CPT Ads Campaign Management & Performance System (Mobile & Web App)</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Cloud Sync & Local DB Active
          </span>
        </div>
      </footer>

    </div>
  );
}

