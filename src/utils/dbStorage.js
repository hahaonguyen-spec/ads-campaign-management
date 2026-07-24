/**
 * Permanent Local Storage & IndexedDB Manager for CPT Campaign System
 */

const DB_NAME = 'CPTCampaignManagerDB';
const STORE_NAME = 'campaigns';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
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

  // 1. Save to LocalStorage as instant backup
  try {
    localStorage.setItem('cpt_ads_campaigns_permanent_v1', JSON.stringify(campaigns));
  } catch (e) {
    console.warn('LocalStorage limit reached, relying on IndexedDB:', e);
  }

  // 2. Save to IndexedDB for high capacity storage
  try {
    const db = await openDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    // clear and put all
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
 * Loads all saved campaigns from IndexedDB / LocalStorage
 */
export async function loadCampaignsFromPermanentStorage(defaultSeedData = []) {
  let loaded = null;

  // 1. Try loading from IndexedDB first
  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const allReq = store.getAll();
      loaded = await new Promise((res, rej) => {
        allReq.onsuccess = () => res(allReq.result);
        allReq.onerror = () => res(null);
      });
    }
  } catch (e) {
    console.warn('IndexedDB read failed:', e);
  }

  // 2. Fallback to LocalStorage if IndexedDB was empty or failed
  if (!loaded || loaded.length === 0) {
    try {
      const savedLs = localStorage.getItem('cpt_ads_campaigns_permanent_v1') || 
                      localStorage.getItem('cpt_ads_campaigns_v3') || 
                      localStorage.getItem('cpt_ads_campaigns_v2');
      if (savedLs) {
        const parsed = JSON.parse(savedLs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loaded = parsed;
        }
      }
    } catch (e) {
      console.warn('LocalStorage read failed:', e);
    }
  }

  // Return loaded campaigns or default seed data
  if (loaded && Array.isArray(loaded) && loaded.length > 0) {
    return loaded;
  }

  return defaultSeedData;
}
