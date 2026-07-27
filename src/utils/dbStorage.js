/**
 * Permanent Local Storage & IndexedDB Manager for CPT Campaign System
 */

const DB_NAME = 'CPTCampaignManagerDB';
const STORE_NAME = 'campaigns';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => {
      console.warn('IndexedDB failed to open, falling back to LocalStorage:', e);
      resolve(null);
    };
  });
}

/**
 * Completely purges all local databases & local storage
 */
export async function clearAllLocalDatabases() {
  try {
    localStorage.clear();
  } catch (e) {}

  try {
    if (window.indexedDB) {
      window.indexedDB.deleteDatabase(DB_NAME);
    }
  } catch (e) {}
}

/**
 * Sanitizes campaign object data structure to prevent any runtime string/number type errors
 */
export function sanitizeCampaignData(campaign) {
  if (!campaign || typeof campaign !== 'object') return campaign;

  const kpiTracking = (campaign.kpiTracking || []).map(row => {
    if (!row) return row;
    return {
      ...row,
      week: String(row.week !== undefined && row.week !== null && row.week !== '' ? row.week : '1'),
      channel: String(row.channel || 'Meta Ads'),
      spend: Number(row.spend) || 0,
      impressions: Number(row.impressions) || 0,
      clicks: Number(row.clicks) || 0,
      leads: Number(row.leads) || 0,
      cpl: Number(row.cpl) || 0,
      accountOpened: Number(row.accountOpened) || 0,
      kyc: Number(row.kyc) || 0,
      ftd: Number(row.ftd) || 0,
      ftt: Number(row.ftt) || 0,
      grossDeposit: Number(row.grossDeposit) || 0,
      netDeposit: Number(row.netDeposit) || 0,
      lots: Number(row.lots) || 0,
      nmi: Number(row.nmi) || 0
    };
  });

  return {
    ...campaign,
    kpiTracking
  };
}

/**
 * Saves all campaigns permanently to IndexedDB + LocalStorage
 */
export async function saveCampaignsToPermanentStorage(campaigns) {
  if (!Array.isArray(campaigns)) return;
  const sanitized = campaigns.map(sanitizeCampaignData);

  // 1. Save to LocalStorage
  try {
    localStorage.setItem('cpt_ads_campaigns_user_v2', JSON.stringify(sanitized));
  } catch (e) {
    console.warn('LocalStorage save warning:', e);
  }

  // 2. Save to IndexedDB
  try {
    const db = await openDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    await new Promise((res, rej) => {
      const clearReq = store.clear();
      clearReq.onsuccess = () => res();
      clearReq.onerror = () => rej(clearReq.error);
    });

    sanitized.forEach(c => {
      store.put(c);
    });
  } catch (err) {
    console.error('Failed to save to IndexedDB:', err);
  }
}

/**
 * Loads all user campaigns from IndexedDB / LocalStorage
 */
export async function loadCampaignsFromPermanentStorage(defaultSeedData = []) {
  let loaded = null;

  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const allReq = store.getAll();
      loaded = await new Promise((res) => {
        allReq.onsuccess = () => res(allReq.result);
        allReq.onerror = () => res(null);
      });
    }
  } catch (e) {
    console.warn('IndexedDB read failed:', e);
  }

  if (loaded && Array.isArray(loaded)) {
    return loaded.map(sanitizeCampaignData);
  }

  try {
    const savedLs = localStorage.getItem('cpt_ads_campaigns_user_v2') || localStorage.getItem('cpt_ads_campaigns_user_v1');
    if (savedLs) {
      const parsed = JSON.parse(savedLs);
      if (Array.isArray(parsed)) {
        return parsed.map(sanitizeCampaignData);
      }
    }
  } catch (e) {
    console.warn('LocalStorage read failed:', e);
  }

  return defaultSeedData.map(sanitizeCampaignData);
}
