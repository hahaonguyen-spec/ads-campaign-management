/**
 * Ad Network Plugins & Automated Data Sync Engine for CPT Campaign System
 * Supports Meta Ads (Facebook/IG), Google Ads (Search/YT), and TikTok Ads
 */

export const AD_PLUGINS = [
  {
    id: 'meta_ads',
    name: 'Meta Ads Plugin',
    platform: 'Meta (Facebook & Instagram)',
    icon: 'meta',
    color: 'from-blue-600 to-indigo-600',
    description: 'Auto-sync Spend, Impressions, Clicks, and Lead Ad responses directly from Meta Business Manager.',
    metricsProvided: ['Spend', 'Impressions', 'Clicks', 'Ad Leads']
  },
  {
    id: 'google_ads',
    name: 'Google Ads Plugin',
    platform: 'Google Search, Display & YouTube',
    icon: 'google',
    color: 'from-amber-500 to-red-500',
    description: 'Auto-sync Google Search & YouTube ad spend, search queries, impressions, and click-through metrics.',
    metricsProvided: ['Spend', 'Impressions', 'Clicks', 'Ad Leads']
  },
  {
    id: 'tiktok_ads',
    name: 'TikTok Ads Plugin',
    platform: 'TikTok Video Ads',
    icon: 'tiktok',
    color: 'from-slate-800 to-rose-600',
    description: 'Auto-sync TikTok Spark Ads & Instant Form lead submissions, video views, and spend data.',
    metricsProvided: ['Spend', 'Impressions', 'Clicks', 'Ad Leads']
  }
];

/**
 * Simulates fetching automated live API metrics from selected Ad Plugin
 */
export function syncAdPluginMetrics(pluginId, weekName = 'Week 1', allocatedBudget = 3000) {
  const isMeta = pluginId === 'meta_ads';
  const isGoogle = pluginId === 'google_ads';
  
  const baseSpend = Math.round(allocatedBudget * (0.2 + Math.random() * 0.1));
  let impressions = 0;
  let clicks = 0;
  let adLeads = 0;

  if (isMeta) {
    impressions = Math.round(baseSpend * (60 + Math.random() * 20));
    clicks = Math.round(impressions * (0.02 + Math.random() * 0.01));
    adLeads = Math.round(clicks * (0.08 + Math.random() * 0.04));
  } else if (isGoogle) {
    impressions = Math.round(baseSpend * (30 + Math.random() * 15));
    clicks = Math.round(impressions * (0.035 + Math.random() * 0.015));
    adLeads = Math.round(clicks * (0.10 + Math.random() * 0.05));
  } else {
    // TikTok
    impressions = Math.round(baseSpend * (90 + Math.random() * 30));
    clicks = Math.round(impressions * (0.015 + Math.random() * 0.01));
    adLeads = Math.round(clicks * (0.06 + Math.random() * 0.03));
  }

  const cpl = adLeads > 0 ? Number((baseSpend / adLeads).toFixed(2)) : 0;

  return {
    week: weekName,
    channel: isMeta ? 'Meta Ads Plugin' : isGoogle ? 'Google Ads Plugin' : 'TikTok Ads Plugin',
    spend: baseSpend,
    impressions,
    clicks,
    leads: adLeads,
    cpl,
    syncedFromPlugin: true,
    pluginId,
    syncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

/**
 * Parses pasted or uploaded CSV exported from Meta Ads Manager, Google Ads, or TikTok Ads
 */
export function parseAdPlatformCsv(csvText, pluginId) {
  if (!csvText) return null;
  const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return null;

  const headers = lines[0].toLowerCase().split(/,|;/).map(h => h.replace(/"/g, '').trim());
  const dataRow = lines[1].split(/,|;/).map(v => v.replace(/"/g, '').trim());

  const findVal = (...keys) => {
    for (const key of keys) {
      const idx = headers.findIndex(h => h.includes(key));
      if (idx !== -1 && dataRow[idx]) {
        const num = parseFloat(dataRow[idx].replace(/[^0-9.]/g, ''));
        if (!isNaN(num)) return num;
      }
    }
    return 0;
  };

  const spend = findVal('amount spent', 'cost', 'spend');
  const impressions = findVal('impressions', 'views');
  const clicks = findVal('link clicks', 'clicks');
  const leads = findVal('results', 'leads', 'conversions');
  const cpl = leads > 0 ? Number((spend / leads).toFixed(2)) : 0;

  return {
    channel: pluginId === 'meta_ads' ? 'Meta Ads (CSV)' : pluginId === 'google_ads' ? 'Google Ads (CSV)' : 'TikTok Ads (CSV)',
    spend,
    impressions,
    clicks,
    leads,
    cpl,
    syncedFromPlugin: true
  };
}
