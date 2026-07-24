import * as XLSX from 'xlsx';

/**
 * Parses an uploaded CPT Ads Campaign template (.xlsx file) according to CPT-I Online Specs
 */
export function parseCampaignExcel(dataBuffer) {
  const workbook = XLSX.read(dataBuffer, { type: 'array', cellDates: true, cellFormulas: true });
  
  const getSheetByName = (namePattern) => {
    const foundKey = workbook.SheetNames.find(s => 
      s.toLowerCase().trim().includes(namePattern.toLowerCase().trim())
    );
    return foundKey ? workbook.Sheets[foundKey] : null;
  };

  // 1. Parse Overview & Approval Sheet
  const overviewSheet = getSheetByName('Overview') || workbook.Sheets[workbook.SheetNames[0]];
  const overview = parseOverviewSheet(overviewSheet);

  // 2. Parse Execution Timeline
  const timelineSheet = getSheetByName('Execution') || getSheetByName('Timeline');
  const timeline = parseTimelineSheet(timelineSheet);

  // 3. Parse Deliverables
  const deliverablesSheet = getSheetByName('Deliverable');
  const deliverables = parseDeliverablesSheet(deliverablesSheet);

  // 4. Parse Budget & Costs
  const budgetSheet = getSheetByName('Budget');
  const budget = parseBudgetSheet(budgetSheet);

  // 5. Parse KPI Tracking (Weekly & Monthly)
  const kpiSheet = getSheetByName('KPI');
  const kpiTracking = parseKpiSheet(kpiSheet, overview.name);

  // 6. Parse Webinar Tracking (2-Tier Structure)
  const webinarSheet = getSheetByName('Webinar');
  const webinarTracking = parseWebinarSheet(webinarSheet);

  const campaignId = 'cpt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

  return {
    id: campaignId,
    importedAt: new Date().toISOString(),
    overview,
    timeline,
    deliverables,
    budget,
    kpiTracking,
    webinarTracking: webinarTracking || null
  };
}

function parseOverviewSheet(sheet) {
  if (!sheet) return getDefaultOverview();
  
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  const map = {};

  rows.forEach(row => {
    if (row && row[0]) {
      const label = String(row[0]).trim();
      const val = (row[1] !== undefined && row[1] !== '') ? row[1] : 
                  (row[2] !== undefined && row[2] !== '') ? row[2] : row[3] || '';
      map[label.toLowerCase()] = val;
    }
  });

  const findVal = (...keys) => {
    for (const k of keys) {
      for (const mapKey of Object.keys(map)) {
        if (mapKey.includes(k.toLowerCase())) {
          return map[mapKey];
        }
      }
    }
    return '';
  };

  const name = findVal('campaign name', 'name') || 'Untitled CPT Campaign';
  const type = findVal('campaign type', 'type') || 'Performance & Promotion';
  const region = findVal('region', 'countries') || 'Global';
  const targetAudience = findVal('target audience', 'audience', 'segment') || 'IBs & Retail Traders (Age 24-48)';
  const owner = findVal('campaign owner', 'owner', 'paid team') || 'Campaign Lead';
  const requestDate = findVal('request date', 'date') || new Date().toISOString().split('T')[0];
  const duration = findVal('duration') || '1 Month';
  const objective = findVal('objective') || 'Acquire active traders, drive FTDs and maximize NMI';
  const primaryKpi = findVal('primary kpi', 'key metrics') || 'Leads, FTD, NMI';
  const mechanics = findVal('mechanics') || 'Paid Channels + Credit Bonus + High-converting LP';
  const userJourney = findVal('user journey', 'journey') || 'Ad Click -> LP Sign up -> KYC -> FTD -> FTT -> Trade Execution';
  const channels = findVal('channels', 'distribution') || 'Meta Ads, Google Search, TikTok, Influencers';
  const budgetVal = parseFloat(String(findVal('total budget', 'budget')).replace(/[^0-9.]/g, '')) || 5000;
  const creditBonusCost = parseFloat(String(findVal('credit bonus', 'bonus cost') || 0).replace(/[^0-9.]/g, '')) || Math.round(budgetVal * 0.2);
  
  const expectedCpm = parseFloat(String(findVal('expected cpm', 'cpm') || 0).replace(/[^0-9.]/g, '')) || 12.50;
  const expectedCpa = parseFloat(String(findVal('expected cpa', 'cpa') || 0).replace(/[^0-9.]/g, '')) || 45.00;

  const trackingLink = findVal('tracking link', 'link') || 'https://cptcorp.com/promo?utm_source=paid_media';
  const riskMitigation = findVal('risk', 'mitigation') || 'Monitor daily CPL and pixel attribution expiry';
  const paidTeamFeasibility = findVal('feasibility', 'paid team review') || 'Feasible & Practical (Approved by Paid Media Team)';
  const note = findVal('note') || '';

  const rawStatus = findVal('status') || '';
  let status = 'Launching';
  if (rawStatus.toLowerCase().includes('plan') || rawStatus.toLowerCase().includes('draft') || rawStatus.toLowerCase().includes('pending')) {
    status = 'Planned';
  } else if (rawStatus.toLowerCase().includes('complete')) {
    status = 'Completed';
  }

  const targetLeads = parseFloat(String(findVal('expected lead', 'target lead', 'target leads') || 0).replace(/[^0-9.]/g, '')) || Math.round(budgetVal / 8.0);
  const targetCpl = parseFloat(String(findVal('expected cpl', 'target cpl') || 0).replace(/[^0-9.]/g, '')) || 8.0;
  const targetFtd = parseFloat(String(findVal('expected ftd', 'target ftd') || 0).replace(/[^0-9.]/g, '')) || Math.round(targetLeads * 0.15);
  const targetNetDeposit = parseFloat(String(findVal('expected deposit', 'target deposit') || 0).replace(/[^0-9.]/g, '')) || (targetFtd * 500);
  const targetLots = parseFloat(String(findVal('expected lots', 'target lots') || 0).replace(/[^0-9.]/g, '')) || (targetFtd * 10);
  const targetNmi = parseFloat(String(findVal('expected nmi', 'target nmi') || 0).replace(/[^0-9.]/g, '')) || (targetNetDeposit * 0.25);

  return {
    name,
    type,
    region,
    targetAudience,
    owner,
    requestDate: formatDate(requestDate),
    duration,
    objective,
    primaryKpi,
    mechanics,
    userJourney,
    channels,
    totalBudget: budgetVal,
    marketingSpend: budgetVal,
    creditBonusCost,
    totalCampaignCost: budgetVal + creditBonusCost,
    paidTeamFeasibility,
    cpmTarget: expectedCpm,
    cpaTarget: expectedCpa,
    expectedTargets: {
      targetBudget: budgetVal,
      targetLeads,
      targetCpl,
      targetFtd,
      targetNetDeposit,
      targetLots,
      targetNmi
    },
    trackingLink,
    riskMitigation,
    note,
    status
  };
}

function parseTimelineSheet(sheet) {
  if (!sheet) return getSampleTimeline();
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  if (!rows || rows.length === 0) return getSampleTimeline();

  return rows.map((r, i) => ({
    id: `task_${i + 1}`,
    week: r['Week'] || r['week'] || `Week ${Math.ceil((i + 1) / 2)}`,
    task: r['Task'] || r['task'] || r['Deliverable'] || `Task ${i + 1}`,
    owner: r['Owner'] || r['owner'] || 'Unassigned',
    start: formatDate(r['Start'] || r['start'] || r['Start Date']),
    end: formatDate(r['End'] || r['end'] || r['End Date']),
    department: r['Department'] || r['department'] || 'Marketing',
    status: r['Status'] || r['status'] || 'In Progress'
  }));
}

function parseDeliverablesSheet(sheet) {
  if (!sheet) return getSampleDeliverables();
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  if (!rows || rows.length === 0) return getSampleDeliverables();

  return rows.map((r, i) => ({
    id: `deliv_${i + 1}`,
    deliverable: r['Deliverable'] || r['deliverable'] || r['Item'] || `Deliverable ${i + 1}`,
    owner: r['Owner'] || r['owner'] || 'Designer',
    dueDate: formatDate(r['Due Date'] || r['due date'] || r['Due']),
    status: r['Status'] || r['status'] || 'Pending',
    link: r['Link'] || r['link'] || '#'
  }));
}

function parseBudgetSheet(sheet) {
  if (!sheet) return getSampleBudget();
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  if (!rows || rows.length === 0) return getSampleBudget();

  return rows.map((r, i) => ({
    id: `item_${i + 1}`,
    item: r['Item'] || r['item'] || `Budget Line ${i + 1}`,
    usd: parseFloat(String(r['USD'] || r['usd'] || r['Amount'] || 0).replace(/[^0-9.]/g, '')) || 0,
    note: r['Note'] || r['note'] || ''
  }));
}

function parseKpiSheet(sheet, campaignName = '') {
  const defaultWeeks = [
    { week: 'Week 1', channel: 'Meta Ads Plugin', spend: 0, impressions: 0, clicks: 0, leads: 0, cpl: 0, accountOpened: 0, kyc: 0, ftd: 0, ftt: 0, grossDeposit: 0, netDeposit: 0, lots: 0, nmi: 0 },
    { week: 'Week 2', channel: 'Meta Ads Plugin', spend: 0, impressions: 0, clicks: 0, leads: 0, cpl: 0, accountOpened: 0, kyc: 0, ftd: 0, ftt: 0, grossDeposit: 0, netDeposit: 0, lots: 0, nmi: 0 },
    { week: 'Week 3', channel: 'Google Ads Plugin', spend: 0, impressions: 0, clicks: 0, leads: 0, cpl: 0, accountOpened: 0, kyc: 0, ftd: 0, ftt: 0, grossDeposit: 0, netDeposit: 0, lots: 0, nmi: 0 },
    { week: 'Week 4', channel: 'Google Ads Plugin', spend: 0, impressions: 0, clicks: 0, leads: 0, cpl: 0, accountOpened: 0, kyc: 0, ftd: 0, ftt: 0, grossDeposit: 0, netDeposit: 0, lots: 0, nmi: 0 }
  ];

  if (!sheet) return defaultWeeks;
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  if (!rows || rows.length === 0) return defaultWeeks;

  const parsed = rows.map((r, i) => {
    const rawWeek = r['Week'] || r['week'] || (i + 1);
    const weekStr = String(rawWeek).toLowerCase().includes('week') ? String(rawWeek) : `Week ${rawWeek}`;
    const spend = num(r['Spend'] || r['spend']);
    const leads = num(r['Leads'] || r['leads']);
    const calculatedCpl = leads > 0 ? Number((spend / leads).toFixed(2)) : 0;

    return {
      week: weekStr,
      campaign: r['Campaign'] || r['campaign'] || campaignName,
      channel: r['Channel'] || r['channel'] || (i < 2 ? 'Meta Ads Plugin' : 'Google Ads Plugin'),
      spend,
      impressions: num(r['Impressions'] || r['impressions']),
      clicks: num(r['Clicks'] || r['clicks']),
      leads,
      cpl: num(r['CPL'] || r['cpl']) || calculatedCpl,
      accountOpened: num(r['Account Opened'] || r['account opened'] || r['Accounts']),
      kyc: num(r['KYC'] || r['kyc']),
      ftd: num(r['FTD'] || r['ftd']),
      ftt: num(r['FTT'] || r['ftt']),
      grossDeposit: num(r['Gross Deposit'] || r['gross deposit']),
      netDeposit: num(r['Net Deposit'] || r['net deposit']),
      lots: num(r['Lots'] || r['lots']),
      nmi: num(r['NMI'] || r['nmi'])
    };
  });

  return parsed.length > 0 ? parsed : defaultWeeks;
}

function parseWebinarSheet(sheet) {
  if (!sheet) return null;
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  if (!rows || rows.length === 0) return null;

  return rows.map((r, i) => ({
    week: r['Week'] || r['Item'] || `Session ${i + 1}`,
    registration: num(r['Registration'] || r['registration']),
    attendance: num(r['Attendance'] || r['attendance']),
    attendanceRate: r['Attendance Rate'] || (num(r['Attendance']) && num(r['Registration']) ? 
      ((num(r['Attendance']) / num(r['Registration'])) * 100).toFixed(1) + '%' : '0%'),
    openAccount: num(r['Open Account'] || r['open account']),
    kyc: num(r['KYC'] || r['kyc']),
    ftd: num(r['FTD'] || r['ftd']),
    ftt: num(r['FTT'] || r['ftt']),
    grossDeposit: num(r['Gross Deposit'] || r['gross deposit']),
    netDeposit: num(r['Net Deposit'] || r['net deposit']),
    lots: num(r['Lots'] || r['lots']),
    nmi: num(r['NMI'] || r['nmi'])
  }));
}

function num(val) {
  if (val === undefined || val === null || val === '') return 0;
  const clean = String(val).replace(/[^0-9.-]/g, '');
  return parseFloat(clean) || 0;
}

function formatDate(val) {
  if (!val) return new Date().toISOString().split('T')[0];
  if (val instanceof Date) return val.toISOString().split('T')[0];
  return String(val);
}

function getDefaultOverview() {
  return {
    name: 'New CPT Promotion Campaign',
    type: 'Performance & Promotion (CPT-I)',
    region: 'SEA & LatAm (Retail Traders & IBs)',
    targetAudience: 'Retail Forex Traders & Introducing Brokers (Age 24-48)',
    owner: 'Paid Media Team Lead',
    requestDate: new Date().toISOString().split('T')[0],
    duration: '1 Month (30 Days)',
    objective: 'Maximize Verified Leads, FTDs, and Net Margin Income (NMI)',
    primaryKpi: 'Leads, FTD, NMI',
    mechanics: 'Paid Channels + Landing Page + $100 Credit Bonus Incentive',
    userJourney: 'Ad Click -> LP Sign up -> KYC Verification -> FTD Deposit -> FTT -> Trade Execution',
    channels: 'Meta Ads, Google Search, TikTok Video Ads',
    totalBudget: 10000,
    marketingSpend: 8000,
    creditBonusCost: 2000,
    totalCampaignCost: 10000,
    paidTeamFeasibility: 'Feasible & Practical (Assessed by Paid Team)',
    cpmTarget: 12.50,
    cpaTarget: 45.00,
    expectedTargets: {
      targetBudget: 10000,
      targetLeads: 1250,
      targetCpl: 8.00,
      targetFtd: 180,
      targetNetDeposit: 90000,
      targetLots: 1800,
      targetNmi: 22500
    },
    trackingLink: 'https://cptcorp.com/promo-cpti?utm_source=paid_media',
    riskMitigation: 'Monitor daily spend vs NMI return; refresh tracking links during webinars',
    note: 'CPT-I Online Approval Standard',
    status: 'Planned'
  };
}

function getSampleTimeline() {
  return [
    { id: 't1', week: 'Week 1', task: 'Paid Team Feasibility & Practicality Assessment', owner: 'Paid Media Lead', start: '2026-08-01', end: '2026-08-03', department: 'Paid Media', status: 'Completed' },
    { id: 't2', week: 'Week 1', task: 'Ad Creative Design & Copywriting Brief', owner: 'Creative Team', start: '2026-08-03', end: '2026-08-07', department: 'Design', status: 'Completed' },
    { id: 't3', week: 'Week 2', task: 'Launch Meta & Google Search Campaigns', owner: 'Ads Specialist', start: '2026-08-08', end: '2026-08-15', department: 'Media Buying', status: 'In Progress' }
  ];
}

function getSampleDeliverables() {
  return [
    { id: 'd1', deliverable: 'Campaign Approval Brief (CPT-I)', owner: 'Marketing Lead', dueDate: '2026-08-03', status: 'Completed', link: 'https://cpt.com/docs/approval-brief' },
    { id: 'd2', deliverable: 'Visual Banners & Video Assets', owner: 'Graphic Designer', dueDate: '2026-08-05', status: 'Completed', link: 'https://cpt.com/assets/visuals' },
    { id: 'd3', deliverable: 'Landing Page & Pixel Conversion Tracking', owner: 'Web Developer', dueDate: '2026-08-07', status: 'Completed', link: 'https://cptcorp.com/landing' }
  ];
}

function getSampleBudget() {
  return [
    { id: 'b1', item: 'Marketing Spend (Meta, Google, TikTok Ads)', usd: 8000, note: 'Paid ad platform spend' },
    { id: 'b2', item: 'Client Credit Bonus & Promo Incentives', usd: 2000, note: '$100 Deposit Bonus Budget' }
  ];
}
