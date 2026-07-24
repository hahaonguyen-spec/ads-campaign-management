/**
 * Computes aggregated statistics for a list of campaign objects safely
 */
export function computeGlobalAnalytics(campaigns = []) {
  if (!campaigns || !Array.isArray(campaigns) || campaigns.length === 0) {
    return {
      totalCampaigns: 0,
      activeCampaigns: 0,
      totalBudget: 0,
      totalSpend: 0,
      totalLeads: 0,
      avgCpl: 0,
      totalAccountsOpened: 0,
      totalFtd: 0,
      totalGrossDeposit: 0,
      totalNetDeposit: 0,
      totalLots: 0,
      ftdConversionRate: 0,
      leadToAccountRate: 0,
      weeklyPerformanceTrend: [],
      channelBreakdown: [],
      regionBreakdown: []
    };
  }

  let totalBudget = 0;
  let totalSpend = 0;
  let totalLeads = 0;
  let totalAccountsOpened = 0;
  let totalFtd = 0;
  let totalGrossDeposit = 0;
  let totalNetDeposit = 0;
  let totalLots = 0;
  let activeCampaigns = 0;

  const channelMap = {};
  const regionMap = {};
  const weeklyMap = {};

  campaigns.forEach(c => {
    if (!c) return;
    totalBudget += Number(c.overview?.totalBudget) || 0;
    if (c.overview?.status === 'Launching' || c.overview?.status === 'Active') activeCampaigns++;

    const region = c.overview?.region || 'Global';
    if (!regionMap[region]) regionMap[region] = { spend: 0, leads: 0, ftd: 0 };

    if (c.kpiTracking && Array.isArray(c.kpiTracking)) {
      c.kpiTracking.forEach(row => {
        if (!row) return;
        const spend = Number(row.spend) || 0;
        const leads = Number(row.leads) || 0;
        const accountOpened = Number(row.accountOpened) || 0;
        const ftd = Number(row.ftd) || 0;
        const grossDeposit = Number(row.grossDeposit) || 0;
        const netDeposit = Number(row.netDeposit) || 0;
        const lots = Number(row.lots) || 0;

        totalSpend += spend;
        totalLeads += leads;
        totalAccountsOpened += accountOpened;
        totalFtd += ftd;
        totalGrossDeposit += grossDeposit;
        totalNetDeposit += netDeposit;
        totalLots += lots;

        regionMap[region].spend += spend;
        regionMap[region].leads += leads;
        regionMap[region].ftd += ftd;

        const ch = row.channel || 'Other';
        if (!channelMap[ch]) channelMap[ch] = { spend: 0, leads: 0, ftd: 0 };
        channelMap[ch].spend += spend;
        channelMap[ch].leads += leads;
        channelMap[ch].ftd += ftd;

        const wk = row.week || 'Week 1';
        if (!weeklyMap[wk]) weeklyMap[wk] = { week: wk, spend: 0, leads: 0, ftd: 0, cpl: 0 };
        weeklyMap[wk].spend += spend;
        weeklyMap[wk].leads += leads;
        weeklyMap[wk].ftd += ftd;
      });
    }
  });

  const avgCpl = totalLeads > 0 ? totalSpend / totalLeads : 0;
  const ftdConversionRate = totalLeads > 0 ? (totalFtd / totalLeads) * 100 : 0;
  const leadToAccountRate = totalLeads > 0 ? (totalAccountsOpened / totalLeads) * 100 : 0;

  const weeklyPerformanceTrend = Object.values(weeklyMap).map(w => ({
    ...w,
    cpl: w.leads > 0 ? Number((w.spend / w.leads).toFixed(2)) : 0
  }));

  const channelBreakdown = Object.keys(channelMap).map(key => ({
    channel: key,
    spend: channelMap[key].spend,
    leads: channelMap[key].leads,
    ftd: channelMap[key].ftd,
    cpl: channelMap[key].leads > 0 ? Number((channelMap[key].spend / channelMap[key].leads).toFixed(2)) : 0
  }));

  const regionBreakdown = Object.keys(regionMap).map(key => ({
    region: key,
    spend: regionMap[key].spend,
    leads: regionMap[key].leads,
    ftd: regionMap[key].ftd,
    cpl: regionMap[key].leads > 0 ? Number((regionMap[key].spend / regionMap[key].leads).toFixed(2)) : 0
  }));

  return {
    totalCampaigns: campaigns.length,
    activeCampaigns,
    totalBudget,
    totalSpend,
    totalLeads,
    avgCpl,
    totalAccountsOpened,
    totalFtd,
    totalGrossDeposit,
    totalNetDeposit,
    totalLots,
    ftdConversionRate,
    leadToAccountRate,
    weeklyPerformanceTrend,
    channelBreakdown,
    regionBreakdown
  };
}

/**
 * Generates automated intelligent diagnostic insights safely
 */
export function generateCampaignInsights(campaign) {
  if (!campaign) return [];
  const insights = [];

  const { overview = {}, kpiTracking = [], deliverables = [], timeline = [], budget = [] } = campaign;

  let totalSpend = 0;
  let totalLeads = 0;
  let totalFtd = 0;

  if (kpiTracking && Array.isArray(kpiTracking)) {
    totalSpend = kpiTracking.reduce((acc, curr) => acc + (Number(curr?.spend) || 0), 0);
    totalLeads = kpiTracking.reduce((acc, curr) => acc + (Number(curr?.leads) || 0), 0);
    totalFtd = kpiTracking.reduce((acc, curr) => acc + (Number(curr?.ftd) || 0), 0);
  }

  const allocatedBudget = Number(overview?.totalBudget) || 0;
  const budgetUtilization = allocatedBudget > 0 ? (totalSpend / allocatedBudget) * 100 : 0;

  if (budgetUtilization > 90) {
    insights.push({
      type: 'warning',
      category: 'Budget Alert',
      title: 'High Budget Utilization',
      message: `Campaign has spent ${budgetUtilization.toFixed(1)}% ($${totalSpend.toLocaleString()} / $${allocatedBudget.toLocaleString()}) of allocated budget.`
    });
  } else {
    insights.push({
      type: 'success',
      category: 'Budget Status',
      title: 'Budget On Track',
      message: `Current spend is $${totalSpend.toLocaleString()} out of $${allocatedBudget.toLocaleString()} allocated budget (${budgetUtilization.toFixed(1)}% utilized).`
    });
  }

  if (totalLeads > 0) {
    const avgCpl = totalSpend / totalLeads;
    if (avgCpl < 8.0) {
      insights.push({
        type: 'success',
        category: 'Lead Cost Efficiency',
        title: 'Strong CPL Performance',
        message: `Average Cost Per Lead is $${avgCpl.toFixed(2)}, which is below target benchmark.`
      });
    } else if (avgCpl > 15.0) {
      insights.push({
        type: 'warning',
        category: 'Cost Alert',
        title: 'Elevated Cost Per Lead',
        message: `Average CPL is $${avgCpl.toFixed(2)}. Recommend reviewing target audience or ad creative.`
      });
    }
  }

  if (totalLeads > 0 && totalFtd > 0) {
    const ftdRate = (totalFtd / totalLeads) * 100;
    const costPerFtd = totalSpend / totalFtd;
    insights.push({
      type: 'info',
      category: 'Trader Conversion',
      title: 'FTD Conversion Funnel',
      message: `${ftdRate.toFixed(1)}% of leads converted into First Time Depositors (${totalFtd} FTDs) at Cost/FTD of $${costPerFtd.toFixed(2)}.`
    });
  }

  return insights;
}
