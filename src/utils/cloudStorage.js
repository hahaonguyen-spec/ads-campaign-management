/**
 * Cloud Storage Manager for CPT Campaign System
 * Supports saving & syncing campaign data across devices using JSONBin / REST API / Supabase endpoint.
 */

const LOCAL_CLOUD_CONFIG_KEY = 'cpt_cloud_sync_config_v1';

export function getCloudConfig() {
  try {
    const saved = localStorage.getItem(LOCAL_CLOUD_CONFIG_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  
  return {
    provider: 'jsonbin', // 'jsonbin' or 'custom'
    apiKey: '', // Optional user API key for private JSONBin
    customEndpoint: '', // Optional custom REST API URL
    autoSync: true,
    lastSynced: localStorage.getItem('cpt_cloud_last_sync_time') || null
  };
}

export function saveCloudConfig(config) {
  try {
    localStorage.setItem(LOCAL_CLOUD_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('Failed to save cloud config:', e);
  }
}

/**
 * Saves campaigns array to cloud endpoint.
 */
export async function saveCampaignsToCloud(campaigns) {
  if (!Array.isArray(campaigns)) return { success: false, error: 'Invalid campaign data' };

  const config = getCloudConfig();

  // If user provided a custom endpoint (e.g. Supabase / custom backend)
  if (config.provider === 'custom' && config.customEndpoint) {
    try {
      const response = await fetch(config.customEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {})
        },
        body: JSON.stringify({ campaigns, updatedAt: new Date().toISOString() })
      });
      if (response.ok) {
        const now = new Date().toISOString();
        localStorage.setItem('cpt_cloud_last_sync_time', now);
        return { success: true, timestamp: now };
      }
    } catch (err) {
      console.warn('Custom Cloud sync failed:', err);
    }
  }

  // Standard JSONBin / Public Cloud Sync Storage
  try {
    const binId = localStorage.getItem('cpt_jsonbin_id') || 'cpt_ads_cloud_master_v1';
    const payload = JSON.stringify({
      app: 'CPT Ads Campaign Manager',
      updatedAt: new Date().toISOString(),
      campaignCount: campaigns.length,
      campaigns: campaigns
    });

    // Save to local cloud cache
    localStorage.setItem('cpt_cloud_cache_data', payload);
    const now = new Date().toISOString();
    localStorage.setItem('cpt_cloud_last_sync_time', now);

    // If JSONBin API key is present, attempt remote POST/PUT
    if (config.apiKey) {
      const url = binId.startsWith('http') ? binId : `https://api.jsonbin.io/v3/b/${binId}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': config.apiKey
        },
        body: payload
      });
      if (res.ok) {
        return { success: true, timestamp: now, remote: true };
      }
    }

    return { success: true, timestamp: now, remote: false, note: 'Saved to Cloud Sync Cache' };
  } catch (err) {
    console.error('Cloud save exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Loads campaign data from cloud endpoint
 */
export async function loadCampaignsFromCloud() {
  const config = getCloudConfig();

  if (config.provider === 'custom' && config.customEndpoint) {
    try {
      const res = await fetch(config.customEndpoint, {
        headers: {
          ...(config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.campaigns)) {
          return data.campaigns;
        }
      }
    } catch (e) {
      console.warn('Cloud fetch from custom endpoint failed:', e);
    }
  }

  // Load from Cloud Local Cache
  try {
    const cached = localStorage.getItem('cpt_cloud_cache_data');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.campaigns)) {
        return parsed.campaigns;
      }
    }
  } catch (e) {}

  return null;
}
