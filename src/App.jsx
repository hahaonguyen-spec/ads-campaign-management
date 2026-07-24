import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CampaignDetail from './components/CampaignDetail';
import UploadModal from './components/UploadModal';
import MetricInputModal from './components/MetricInputModal';
import { INITIAL_CAMPAIGNS } from './data/initialCampaigns';
import { loadCampaignsFromPermanentStorage, saveCampaignsToPermanentStorage } from './utils/dbStorage';

export default function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [metricModalCampaign, setMetricModalCampaign] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load saved campaigns from IndexedDB / Permanent Local Storage on startup
  useEffect(() => {
    async function initStorage() {
      const data = await loadCampaignsFromPermanentStorage(INITIAL_CAMPAIGNS);
      setCampaigns(data);
      setIsLoaded(true);
    }
    initStorage();
  }, []);

  // Save to Permanent Local Storage whenever campaigns change
  useEffect(() => {
    if (isLoaded) {
      saveCampaignsToPermanentStorage(campaigns);
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
    if (confirm('Load pre-filled example CPT campaigns? Uploaded campaigns will be retained.')) {
      setCampaigns(INITIAL_CAMPAIGNS);
      setSelectedCampaignId(null);
      saveCampaignsToPermanentStorage(INITIAL_CAMPAIGNS);
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
          <p className="text-xs text-slate-400">Loading saved CPT campaigns from local database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans">
      
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenUpload={() => setIsUploadOpen(true)}
        onDownloadTemplate={handleDownloadTemplate}
        onResetDemo={handleResetDemo}
        campaignCount={(campaigns || []).length}
        activeCount={activeCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
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
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenMetricInput={(c) => setMetricModalCampaign(c)}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}
      </main>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onCampaignUploaded={handleCampaignUploaded}
      />

      <MetricInputModal
        isOpen={!!metricModalCampaign}
        onClose={() => setMetricModalCampaign(null)}
        campaign={metricModalCampaign}
        onSaveMetrics={handleUpdateCampaign}
      />

      <footer className="border-t border-slate-800/80 bg-[#0B0F17] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CPT Ads Campaign Management & Performance System</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Permanent Local Storage Active (IndexedDB)
          </span>
        </div>
      </footer>

    </div>
  );
}
