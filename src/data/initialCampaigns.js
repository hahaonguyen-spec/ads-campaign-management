export const INITIAL_CAMPAIGNS = [
  {
    id: 'cpt_q3_contest_2026',
    importedAt: '2026-07-24T10:00:00Z',
    overview: {
      name: 'CPT Q3 Forex & CFD Trading Contest',
      type: 'Performance & Growth',
      region: 'SEA & LatAm',
      owner: 'Alex Morgan',
      requestDate: '2026-07-01',
      duration: '4 Weeks',
      objective: 'Drive trading volume, acquire active traders, and maximize net deposits via high-stakes trading competition',
      primaryKpi: '1,500+ Leads, CPL < $8.00, 200+ FTDs',
      targetAudience: 'Active retail forex, gold, and index traders aged 24-48 looking for high leverage & low spreads',
      mechanics: 'Register for free contest account -> Trade minimum 3 lots -> Top 10 traders win $25,000 prize pool',
      userJourney: 'Meta/Google Ad -> Contest LP -> Demo/Live Account -> KYC -> $200 Minimum Deposit -> Execute Trades',
      channels: 'Meta Ads, Google Search, Youtube Video Ads, Telegram Forex Communities',
      totalBudget: 12500,
      expectedTargets: {
        targetBudget: 12500,
        targetLeads: 1500,
        targetCpl: 8.33,
        targetFtd: 220,
        targetNetDeposit: 130000,
        targetLots: 2800
      },
      trackingLink: 'https://cptcorp.com/contest-q3?utm_source=meta_ads&utm_medium=cpc&utm_campaign=q3_trading_contest',
      riskMitigation: 'Set up max daily campaign spend limits; monitor click-fraud on Search keywords; daily CPL alerts.',
      note: 'Flagship Q3 contest performance campaign.',
      status: 'Launching'
    },
    timeline: [
      { id: 't1', week: 'Week 1', task: 'Contest LP Design & Copywriting', owner: 'Creative Team', start: '2026-07-01', end: '2026-07-05', department: 'Design', status: 'Completed' },
      { id: 't2', week: 'Week 1', task: 'UTM Tracking & Pixel Integration', owner: 'Dev Team', start: '2026-07-04', end: '2026-07-06', department: 'Tech', status: 'Completed' },
      { id: 't3', week: 'Week 2', task: 'Launch Meta Ads (Interest & Lookalike)', owner: 'Alex Morgan', start: '2026-07-07', end: '2026-07-14', department: 'Media Buying', status: 'Completed' },
      { id: 't4', week: 'Week 3', task: 'Google Search Ads & Brand Defense', owner: 'Media Buying Lead', start: '2026-07-14', end: '2026-07-21', department: 'Media Buying', status: 'Completed' },
      { id: 't5', week: 'Week 4', task: 'Final Leaderboard Push & Retargeting', owner: 'CRM Manager', start: '2026-07-21', end: '2026-07-28', department: 'CRM', status: 'In Progress' }
    ],
    deliverables: [
      { id: 'd1', deliverable: 'Content Copywriting (Ads & LP Brief)', owner: 'Sarah Jenkins', dueDate: '2026-07-03', status: 'Completed', link: 'https://docs.google.com/copy-brief' },
      { id: 'd2', deliverable: 'Visual Banners & Animated Reels', owner: 'Graphic Designer', dueDate: '2026-07-04', status: 'Completed', link: 'https://drive.google.com/banners' },
      { id: 'd3', deliverable: 'EDM Nurture Sequence (4 Emails)', owner: 'CRM Specialist', dueDate: '2026-07-05', status: 'Completed', link: 'https://cpt.com/edm-preview' },
      { id: 'd4', deliverable: 'Landing Page Deployment & Mobile Check', owner: 'Web Developer', dueDate: '2026-07-06', status: 'Completed', link: 'https://cptcorp.com/contest-q3' },
      { id: 'd5', deliverable: 'Meta & Google Ads Setup & Conversion Pixels', owner: 'Alex Morgan', dueDate: '2026-07-07', status: 'Completed', link: 'https://business.facebook.com/ads' }
    ],
    budget: [
      { id: 'b1', item: 'Meta Ads (Facebook & Instagram)', usd: 6000, note: 'Lookalike 1% and Forex interest targeting' },
      { id: 'b2', item: 'Google Search & YouTube Ads', usd: 4000, note: 'High intent keywords: forex broker, trading contest' },
      { id: 'b3', item: 'Landing Page & Creative Production', usd: 1500, note: 'Video ad production & copywriting' },
      { id: 'b4', item: 'CRM Email & SMS Automation', usd: 1000, note: 'Automated contestant leaderboard emails' }
    ],
    kpiTracking: [
      { week: 'Week 1', campaign: 'CPT Q3 Trading Contest', channel: 'Meta Ads', spend: 2500, impressions: 180000, clicks: 3900, leads: 340, cpl: 7.35, accountOpened: 180, kyc: 120, ftd: 48, ftt: 42, grossDeposit: 24000, netDeposit: 22000, lots: 520, nmi: 14000 },
      { week: 'Week 2', campaign: 'CPT Q3 Trading Contest', channel: 'Meta Ads', spend: 2800, impressions: 210000, clicks: 4500, leads: 410, cpl: 6.83, accountOpened: 220, kyc: 155, ftd: 62, ftt: 58, grossDeposit: 35000, netDeposit: 31000, lots: 740, nmi: 19000 },
      { week: 'Week 3', campaign: 'CPT Q3 Trading Contest', channel: 'Google Search', spend: 3200, impressions: 95000, clicks: 3100, leads: 360, cpl: 8.89, accountOpened: 205, kyc: 140, ftd: 75, ftt: 68, grossDeposit: 52000, netDeposit: 48000, lots: 980, nmi: 26000 },
      { week: 'Week 4', campaign: 'CPT Q3 Trading Contest', channel: 'Google Search', spend: 3000, impressions: 90000, clicks: 2900, leads: 330, cpl: 9.09, accountOpened: 190, kyc: 130, ftd: 68, ftt: 61, grossDeposit: 44000, netDeposit: 41000, lots: 860, nmi: 22000 }
    ],
    webinarTracking: null
  },
  {
    id: 'cpt_latam_brand_2026',
    importedAt: '2026-07-20T08:30:00Z',
    overview: {
      name: 'CPT LatAm Brand Expansion Push',
      type: 'Brand & Regional Expansion',
      region: 'Latin America (Mexico, Colombia, Chile)',
      owner: 'Maria Gomez',
      requestDate: '2026-07-10',
      duration: '4 Weeks',
      objective: 'Establish CPT brand authority in LatAm forex market and acquire high-lifetime value traders',
      primaryKpi: '1,200 Leads, CPL < $6.50, 100+ FTDs',
      targetAudience: 'Spanish-speaking day traders, financial enthusiasts, copy-trading followers',
      mechanics: 'Local financial influencer partnerships + localized Meta Ads + Spanish educational LP',
      userJourney: 'Instagram Reel -> LatAm LP -> Free Spanish Trading Guide -> Live Account Registration',
      channels: 'Meta Ads, Instagram Reels, Financial Influencers, YouTube Sponsorships',
      totalBudget: 9500,
      expectedTargets: {
        targetBudget: 9500,
        targetLeads: 1400,
        targetCpl: 6.78,
        targetFtd: 140,
        targetNetDeposit: 75000,
        targetLots: 1600
      },
      trackingLink: 'https://cptcorp.com/latam-es?utm_source=instagram&utm_campaign=latam_brand',
      riskMitigation: 'Ensure native Spanish proofreading on all ad copy; verify local payment gateways.',
      note: 'Regional LatAm growth push.',
      status: 'Launching'
    },
    timeline: [
      { id: 'lt1', week: 'Week 1', task: 'Translate LP & Video Subtitles to Spanish', owner: 'Maria Gomez', start: '2026-07-10', end: '2026-07-13', department: 'Localization', status: 'Completed' },
      { id: 'lt2', week: 'Week 1', task: 'Influencer Sponsorship Contracts', owner: 'PR Manager', start: '2026-07-12', end: '2026-07-16', department: 'Partnerships', status: 'Completed' },
      { id: 'lt3', week: 'Week 2', task: 'Meta Video Campaign Launch', owner: 'Media Buying', start: '2026-07-17', end: '2026-07-24', department: 'Media Buying', status: 'Completed' },
      { id: 'lt4', week: 'Week 3-4', task: 'Retargeting LP Visitors & Email Broadcast', owner: 'CRM Team', start: '2026-07-25', end: '2026-08-05', department: 'CRM', status: 'In Progress' }
    ],
    deliverables: [
      { id: 'ld1', deliverable: 'Spanish Content Copy (Ads & Guides)', owner: 'Maria Gomez', dueDate: '2026-07-12', status: 'Completed', link: 'https://cpt.com/docs/spanish-copy' },
      { id: 'ld2', deliverable: 'LatAm Specific Video & Visual Assets', owner: 'Graphic Designer', dueDate: '2026-07-14', status: 'Completed', link: 'https://cpt.com/assets/latam-visuals' },
      { id: 'ld3', deliverable: 'Localized Spanish Landing Page', owner: 'Dev Team', dueDate: '2026-07-15', status: 'Completed', link: 'https://cptcorp.com/latam-es' },
      { id: 'ld4', deliverable: 'Meta & Instagram Ad Set Campaign', owner: 'Media Buyer', dueDate: '2026-07-17', status: 'Completed', link: 'https://business.facebook.com' }
    ],
    budget: [
      { id: 'lb1', item: 'Meta Ads LatAm Spend', usd: 5500, note: 'Targeting Mexico, Colombia, Chile' },
      { id: 'lb2', item: 'Local Finance Influencers', usd: 2500, note: '2 YouTube reviews + 5 IG posts' },
      { id: 'lb3', item: 'Spanish Content Localization', usd: 1500, note: 'Native translation & voiceover' }
    ],
    kpiTracking: [
      { week: 'Week 1', campaign: 'CPT LatAm Brand Expansion', channel: 'Meta Ads', spend: 2000, impressions: 240000, clicks: 4200, leads: 380, cpl: 5.26, accountOpened: 150, kyc: 90, ftd: 30, ftt: 25, grossDeposit: 15000, netDeposit: 14000, lots: 310, nmi: 8000 },
      { week: 'Week 2', campaign: 'CPT LatAm Brand Expansion', channel: 'Instagram Reels', spend: 2500, impressions: 310000, clicks: 5100, leads: 460, cpl: 5.43, accountOpened: 195, kyc: 115, ftd: 42, ftt: 36, grossDeposit: 22000, netDeposit: 20000, lots: 450, nmi: 11500 },
      { week: 'Week 3', campaign: 'CPT LatAm Brand Expansion', channel: 'Influencer Partnerships', spend: 2200, impressions: 180000, clicks: 3400, leads: 310, cpl: 7.10, accountOpened: 140, kyc: 85, ftd: 35, ftt: 30, grossDeposit: 18000, netDeposit: 16500, lots: 380, nmi: 9500 },
      { week: 'Week 4', campaign: 'CPT LatAm Brand Expansion', channel: 'Meta Ads', spend: 2300, impressions: 200000, clicks: 3600, leads: 330, cpl: 6.97, accountOpened: 155, kyc: 95, ftd: 38, ftt: 33, grossDeposit: 20000, netDeposit: 18500, lots: 410, nmi: 10500 }
    ],
    webinarTracking: null
  },
  {
    id: 'cpt_partner_webinar_2026',
    importedAt: '2026-07-15T12:00:00Z',
    overview: {
      name: 'CPT Masterclass: Algorithmic Trading Webinar',
      type: 'Webinar & Educational Lead Gen',
      region: 'Global / MENA & Europe',
      owner: 'David Chen',
      requestDate: '2026-07-05',
      duration: '4 Weeks',
      objective: 'Host live masterclass with expert EA developer to acquire premium algorithmic traders',
      primaryKpi: '800 Webinar Registrations, 45% Attendance Rate, 50+ FTDs',
      targetAudience: 'Experienced traders interested in Expert Advisors (EA), automated trading & VPS',
      mechanics: 'Free Live Masterclass -> Attend Session -> Exclusive $100 Deposit Bonus Code',
      userJourney: 'Meta Lead Form -> Zoom Registration -> Live Webinar -> Special Offer LP -> Account Funding',
      channels: 'Meta Lead Ads, Direct Email to Database, TradingView Banners',
      totalBudget: 6000,
      expectedTargets: {
        targetBudget: 6000,
        targetLeads: 900,
        targetCpl: 6.67,
        targetFtd: 70,
        targetNetDeposit: 50000,
        targetLots: 1000
      },
      trackingLink: 'https://cptcorp.com/webinar-algo?utm_source=meta_leadgen',
      riskMitigation: 'Send automated SMS reminders 1 hour before live webinar to ensure high attendance.',
      note: 'Live masterclass session hosted on July 25th.',
      status: 'Launching'
    },
    timeline: [
      { id: 'wt1', week: 'Week 1', task: 'Speaker Brief & Deck Creation', owner: 'David Chen', start: '2026-07-05', end: '2026-07-08', department: 'Content', status: 'Completed' },
      { id: 'wt2', week: 'Week 1', task: 'Zoom Webinar Setup & Automation', owner: 'Ops Team', start: '2026-07-07', end: '2026-07-09', department: 'Tech', status: 'Completed' },
      { id: 'wt3', week: 'Week 2', task: 'Run Meta Lead Ads & Email Broadcast', owner: 'Media Buying', start: '2026-07-10', end: '2026-07-20', department: 'Marketing', status: 'Completed' },
      { id: 'wt4', week: 'Week 3-4', task: 'Host Live Masterclass & Offer Follow-up', owner: 'David Chen', start: '2026-07-25', end: '2026-08-01', department: 'Sales', status: 'In Progress' }
    ],
    deliverables: [
      { id: 'wd1', deliverable: 'Webinar Presentation Deck', owner: 'David Chen', dueDate: '2026-07-08', status: 'Completed', link: 'https://cpt.com/docs/algo-deck' },
      { id: 'wd2', deliverable: 'Registration Landing Page', owner: 'Web Dev', dueDate: '2026-07-09', status: 'Completed', link: 'https://cptcorp.com/webinar-algo' },
      { id: 'wd3', deliverable: 'SMS & Email Reminder Sequence', owner: 'CRM Team', dueDate: '2026-07-10', status: 'Completed', link: 'https://cpt.com/crm/webinar-sms' }
    ],
    budget: [
      { id: 'wb1', item: 'Meta Lead Generation Ads', usd: 4000, note: 'Targeting Algo Traders & MetaTrader users' },
      { id: 'wb2', item: 'Guest Speaker Honorarium', usd: 1200, note: 'Expert EA Developer speaker fee' },
      { id: 'wb3', item: 'Zoom Webinar License & SMS Tools', usd: 800, note: 'Twilio SMS reminders & Zoom setup' }
    ],
    kpiTracking: [
      { week: 'Week 1', campaign: 'CPT Masterclass Webinar', channel: 'Meta Lead Ads', spend: 1500, impressions: 85000, clicks: 2100, leads: 420, cpl: 3.57, accountOpened: 110, kyc: 70, ftd: 24, ftt: 20, grossDeposit: 18000, netDeposit: 16500, lots: 390, nmi: 9500 },
      { week: 'Week 2', campaign: 'CPT Masterclass Webinar', channel: 'Meta Lead Ads', spend: 1500, impressions: 90000, clicks: 2300, leads: 450, cpl: 3.33, accountOpened: 135, kyc: 85, ftd: 31, ftt: 28, grossDeposit: 25000, netDeposit: 23000, lots: 510, nmi: 14000 },
      { week: 'Week 3', campaign: 'CPT Masterclass Webinar', channel: 'TradingView Banners', spend: 1200, impressions: 60000, clicks: 1400, leads: 180, cpl: 6.67, accountOpened: 70, kyc: 45, ftd: 18, ftt: 15, grossDeposit: 12000, netDeposit: 11000, lots: 220, nmi: 6500 },
      { week: 'Week 4', campaign: 'CPT Masterclass Webinar', channel: 'Direct Email', spend: 800, impressions: 45000, clicks: 1100, leads: 150, cpl: 5.33, accountOpened: 60, kyc: 40, ftd: 15, ftt: 12, grossDeposit: 10000, netDeposit: 9000, lots: 180, nmi: 5000 }
    ],
    webinarTracking: [
      { week: 'Session 1 (July 25)', registration: 870, attendance: 412, attendanceRate: '47.4%', openAccount: 245, kyc: 155, ftd: 55, ftt: 48, grossDeposit: 43000, netDeposit: 39500, lots: 900, nmi: 23500 }
    ]
  },
  {
    id: 'cpt_q4_gold_championship_2026',
    importedAt: '2026-07-24T11:00:00Z',
    overview: {
      name: 'CPT Q4 Gold & Indices Trading Championship',
      type: 'Performance & Growth',
      region: 'Global / MENA & Europe',
      owner: 'David Chen',
      requestDate: '2026-07-22',
      duration: '4 Weeks',
      objective: 'Planned Q4 flagship trading contest targeting high-volume XAUUSD and NAS100 traders',
      primaryKpi: '2,500 Target Leads, CPL < $7.50, 350 Expected FTDs',
      targetAudience: 'Gold (XAUUSD) & US Index day traders with minimum $500 initial account deposit',
      mechanics: 'Planned Campaign: High-converting landing page with live leaderboard & zero commission incentive',
      userJourney: 'Google/Meta Ad -> LP Register -> Instant $100 Demo Bonus -> Live Account Deposit -> Trade Gold',
      channels: 'Meta Ads, Google Search, TradingView Display Ads, Telegram Signals Channel',
      totalBudget: 20000,
      expectedTargets: {
        targetBudget: 20000,
        targetLeads: 2500,
        targetCpl: 8.00,
        targetFtd: 350,
        targetNetDeposit: 250000,
        targetLots: 5000
      },
      trackingLink: 'https://cptcorp.com/gold-championship?utm_source=meta_q4',
      riskMitigation: 'Ensure strict risk warnings for high leverage trading on gold.',
      note: 'Planned Q4 campaign ready for Week 1 metrics logging.',
      status: 'Planned'
    },
    timeline: [
      { id: 'pt1', week: 'Week 1', task: 'Finalize Championship Rules & Landing Page Brief', owner: 'David Chen', start: '2026-08-15', end: '2026-08-20', department: 'Strategy', status: 'In Progress' },
      { id: 'pt2', week: 'Week 1', task: 'Design Gold Championship Banners & Videos', owner: 'Creative Team', start: '2026-08-18', end: '2026-08-25', department: 'Design', status: 'Pending' },
      { id: 'pt3', week: 'Week 2', task: 'Pre-launch Email Warmup & Meta Teaser Ads', owner: 'Media Buying', start: '2026-08-26', end: '2026-09-01', department: 'Media Buying', status: 'Pending' }
    ],
    deliverables: [
      { id: 'pd1', deliverable: 'Landing Page Copywriting & Spanish/Arabic Translation', owner: 'Localization Team', dueDate: '2026-08-22', status: 'Pending', link: '#' },
      { id: 'pd2', deliverable: 'Video Ads (3D Gold Trophy Animations)', owner: 'Motion Designer', dueDate: '2026-08-24', status: 'Pending', link: '#' },
      { id: 'pd3', deliverable: 'TradingView Banners & Ad Sets', owner: 'Media Buyer', dueDate: '2026-08-25', status: 'Pending', link: '#' }
    ],
    budget: [
      { id: 'pb1', item: 'Meta Ads Spend (Global targeting)', usd: 10000, note: 'Targeting Gold, Forex, Day Trading interest' },
      { id: 'pb2', item: 'Google Search & SEM Ads', usd: 6000, note: 'Keywords: gold trading broker, xauusd leverage' },
      { id: 'pb3', item: 'TradingView Direct Sponsorship', usd: 4000, note: 'Banner placement on Gold charts' }
    ],
    kpiTracking: [
      { week: 'Week 1', channel: 'Meta Ads', spend: 0, impressions: 0, clicks: 0, leads: 0, cpl: 0, accountOpened: 0, kyc: 0, ftd: 0, ftt: 0, grossDeposit: 0, netDeposit: 0, lots: 0, nmi: 0 },
      { week: 'Week 2', channel: 'Meta Ads', spend: 0, impressions: 0, clicks: 0, leads: 0, cpl: 0, accountOpened: 0, kyc: 0, ftd: 0, ftt: 0, grossDeposit: 0, netDeposit: 0, lots: 0, nmi: 0 },
      { week: 'Week 3', channel: 'Google Search', spend: 0, impressions: 0, clicks: 0, leads: 0, cpl: 0, accountOpened: 0, kyc: 0, ftd: 0, ftt: 0, grossDeposit: 0, netDeposit: 0, lots: 0, nmi: 0 },
      { week: 'Week 4', channel: 'Google Search', spend: 0, impressions: 0, clicks: 0, leads: 0, cpl: 0, accountOpened: 0, kyc: 0, ftd: 0, ftt: 0, grossDeposit: 0, netDeposit: 0, lots: 0, nmi: 0 }
    ],
    webinarTracking: null
  }
];
