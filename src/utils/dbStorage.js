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
 * Saves all campaigns permanently to IndexedDB + LocalStorage
 */
export async function saveCampaignsToPermanentStorage(campaigns) {
  if (!Array.isArray(campaigns)) return;

  // 1. Save to LocalStorage
  try {
    localStorage.setItem('cpt_ads_campaigns_user_v1', JSON.stringify(campaigns));
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

    campaigns.forEach(campaign => {
      store.put(campaign);
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
    return loaded;
  }

  try {
    const savedLs = localStorage.getItem('cpt_ads_campaigns_user_v1');
    if (savedLs) {
      const parsed = JSON.parse(savedLs);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('LocalStorage read failed:', e);
  }

  return defaultSeedData;
}
