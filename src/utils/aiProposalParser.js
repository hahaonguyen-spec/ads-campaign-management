/**
 * AI Proposal Parser Utility for CPT Ads Campaign Manager
 * Supports:
 * 1. Multi-format proposal file text extraction (PDF, DOCX, XLSX, CSV, TXT, MD)
 * 2. Live Gemini API structured text parsing (if API Key provided/configured)
 * 3. Intelligent Built-in NLP Rule Engine (Offline/Fallback) for VN & EN proposals
 * 4. Natural Language Fine-Tuning Assistant
 * 5. Continuous AI Optimization & Diagnostic Recommendation Engine
 */

import * as XLSX from 'xlsx';

export const SAMPLE_PROPOSALS = [
  {
    id: 'sea_leadgen',
    title: '🚀 SEA Meta & Google Acquisition Brief (Lead Gen)',
    text: `PROPOSAL CHIẾN DỊCH QUẢNG CÁO PERFORMANCE Q3/2026 - CPT MARKETS SEA

1. TỔNG QUAN DỰ ÁN
- Tên chiến dịch: Q3 SEA Meta & Google Acquisition Campaign
- Người phụ trách (Owner): Nguyễn Hảo Hà (Paid Lead)
- Thị trường mục tiêu: Vietnam (VN) và Thailand (TH)
- Loại hình chiến dịch: Lead Gen Campaign
- Mục tiêu chính: Thu hút khách hàng tiềm năng đăng ký tài khoản giao dịch Forex & Gold, chuyển đổi sang KYC và Nạp tiền lần đầu (FTD).

2. NGÂN SÁCH & CHỈ TIÊU KPI
- Tổng ngân sách đề xuất: $15,000 USD (trong 30 ngày)
- Mục tiêu Leads (Chỉ số đăng ký): 750 Leads
- Target CPL (Chi phí/Lead): $20.00 USD
- Target FTD (Khách nạp đầu): 120 FTDs
- Khối lượng nạp dự kiến (Gross Deposit): $75,000 USD

3. PHÂN BỔ KÊNH QUẢNG CÁO (CHANNELS)
- Meta Ads (Facebook & Instagram Lead Forms): $9,000 USD (60% ngân sách)
- Google Search & Youtube Ads: $6,000 USD (40% ngân sách)

4. LỊCH TRÌNH THỰC THI (TIMELINE)
- Tuần 1: Thiết kế Visual Banners, dựng Landing Page và test Pixel Attribution (Phụ trách: Creative Team)
- Tuần 2: Setup và Launch Meta Ads + Google Search (Phụ trách: Paid Team)
- Tuần 3-4: A/B Testing ad creatives, tối ưu hoá CPL và tăng tỷ lệ FTD (Phụ trách: Paid Lead)

5. HẠNG MỤC BÀN GIAO (DELIVERABLES)
- 05 bộ Visual Banners & 02 Video Ad Creatives (Thiết kế bởi Graphic Team)
- 01 Landing Page đăng ký tích hợp Form CPT (Tech Team)
- Báo cáo KPI Tracking hàng tuần (Analytics Team)
`
  },
  {
    id: 'forex_webinar',
    title: '🎓 Global Forex & Gold Masterclass (Webinar)',
    text: `CHƯƠNG TRÌNH PROPOSAL WEBINAR CHIẾN LƯỢC ĐẦU TƯ VÀNG & NGHỆ THUẬT GIAO DỊCH 2026

1. THÔNG TIN CHUNG
- Tên sự kiện: CPT Masterclass - Bí Quyết Giao Dịch Vàng & Tiền Tệ 2026
- Người quản lý: Trần Minh Đức
- Khu vực phủ sóng: SEA Regional (Việt Nam, Thái Lan, Malaysia)
- Định dạng: Webinar Campaign
- Ngày tổ chức Webinar: 2026-08-25
- Chủ đề Webinar: Chiến lược Lướt sóng Vàng XAUUSD & Quản trị Rủi ro 2026

2. MỤC TIÊU & NGÂN SÁCH
- Tổng ngân sách sự kiện: $8,000 USD
- Target đăng ký (Registrations): 1,200 người
- Target tham dự thực tế (Attendees): 500 người (Tỷ lệ 40%)
- Target Khách Nạp Tiền (FTD từ Webinar): 60 FTDs
- Tổng tiền nạp kỳ vọng: $40,000 USD

3. PHÂN BỔ KÊNH
- Facebook Event Ads & Lead Form: $4,500 USD
- TikTok Video Ads & KOL Partner: $2,500 USD
- Email Automation & Tele-call Follow-up: $1,000 USD

4. BÀN GIAO & CÔNG VIỆC
- Landing page Webinar Đăng ký (Web Team, Hạn: Tuần 1)
- Slide thuyết trình & Tài liệu quà tặng cho Investor (Content Team, Hạn: Tuần 2)
- Hệ thống gửi Zoom Email & SMS nhắc hẹn (Marketing Automation Team)`
  },
  {
    id: 'crypto_cpa',
    title: '🔥 Crypto & FX High Leverage Acquisition (CPA)',
    text: `PROPOSAL PERFORMANCE CPA ACQUISITION CAMPAIGN - LATAM & ASIA

Campaign Name: High Leverage FX & Crypto Growth 2026
Campaign Manager: Alex Rivera
Target Region: Global / LatAm Regional
Campaign Type: CPA Performance
Total Budget: $25,000 USD
Target Leads: 1,000 Leads
Target CPL: $25.00 USD
Target FTDs: 180 FTDs
Expected Deposit Volume: $120,000 USD

Channels Breakdown:
- Meta Ads (Facebook/IG): $12,500 USD
- Google Search Ads: $7,500 USD
- Telegram Paid Channels & Crypto Media: $5,000 USD

Execution Tasks:
- Week 1: Setup CPA Tracking & Postback URLs (Tech Lead)
- Week 1: Produce High-CTR Video Creatives (Design Team)
- Week 2: Launch Campaigns in Brazil & Mexico (Paid Manager)
- Week 3-4: Scale Winning Campaigns & Optimize CPA (Media Buyer)`
  }
];

/**
 * Universal Multi-Format File Reader (PDF, DOCX, XLSX, XLS, CSV, TXT, MD, JSON)
 */
export async function extractTextFromProposalFile(file) {
  if (!file) throw new Error('Không tìm thấy file tải lên.');
  const name = file.name.toLowerCase();

  // 1. Excel File (.xlsx, .xls)
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    let textResult = `=== PROPOSAL FROM EXCEL: ${file.name} ===\n\n`;
    workbook.SheetNames.forEach(sheetName => {
      textResult += `--- Sheet: ${sheetName} ---\n`;
      const sheet = workbook.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      textResult += csv + '\n\n';
    });
    return textResult;
  }

  // 2. Word File (.docx)
  if (name.endsWith('.docx')) {
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    const decoded = decoder.decode(arrayBuffer);
    
    // Extract text nodes from DOCX XML structure
    const textMatches = decoded.match(/<w:t[^>]*>(.*?)<\/w:t>/gi) || [];
    let extractedText = textMatches.map(m => m.replace(/<[^>]+>/g, '')).join(' ');
    
    if (extractedText && extractedText.trim().length > 50) {
      return `=== PROPOSAL FROM WORD DOCX: ${file.name} ===\n\n` + extractedText;
    }
    
    // Fallback: extract plain printable ASCII/Unicode blocks from binary
    const printableMatches = decoded.match(/[\w\s\dàáảãạăắằẳẵặâấầnẩẫậnèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ:.,\-$%\/]{4,}/gi) || [];
    return `=== PROPOSAL FROM WORD DOCX: ${file.name} ===\n\n` + printableMatches.join('\n');
  }

  // 3. PDF File (.pdf)
  if (name.endsWith('.pdf')) {
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    const rawString = decoder.decode(arrayBuffer);
    
    // Extract text strings inside PDF object parenthesized streams (e.g. (Text string) Tj)
    const pdfTextChunks = rawString.match(/\(([^()]{3,})\)\s*T[jJ]/g) || 
                          rawString.match(/[\w\s\dàáảãạăắằẳẵặâấầnẩẫậnèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ:.,\-$%\/]{5,}/gi) || [];
    
    let cleanPdfText = pdfTextChunks.map(c => c.replace(/^\(/, '').replace(/\)\s*T[jJ]$/, '')).join('\n');
    if (!cleanPdfText || cleanPdfText.trim().length < 30) {
      cleanPdfText = rawString.replace(/[^\x20-\x7E\sàáảãạăắằẳẵặâấầnẩẫậnèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ]/g, ' ');
    }

    return `=== PROPOSAL FROM PDF: ${file.name} ===\n\n` + cleanPdfText;
  }

  // 4. Text, Markdown, CSV, JSON (.txt, .md, .csv, .json)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(String(e.target?.result || ''));
    reader.onerror = () => reject(new Error('Lỗi đọc file văn bản.'));
    reader.readAsText(file);
  });
}

/**
 * Main parser entry point
 */
export async function parseProposalWithAI(proposalText, options = {}) {
  const { apiKey = '', customPrompt = '' } = options;

  if (!proposalText || !proposalText.trim()) {
    throw new Error('Vui lòng nhập nội dung proposal hoặc chọn file mẫu.');
  }

  // 1. Try Gemini API if API key is supplied
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const geminiResult = await callGeminiApi(proposalText, apiKey, customPrompt);
      if (geminiResult) return geminiResult;
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local AI engine:', err);
    }
  }

  // 2. Fallback to Local Intelligent NLP Rule Engine
  return intelligentHeuristicProposalExtract(proposalText, customPrompt);
}

/**
 * Call Gemini API directly using structured prompt
 */
async function callGeminiApi(proposalText, apiKey, customPrompt = '') {
  const systemPrompt = `You are an expert Ad Campaign Architect AI. Analyze the following marketing proposal and extract structured JSON parameters for an ad campaign management system.
Return strictly valid JSON only (no markdown codeblock tags if possible, or clean JSON object).

JSON Schema to return:
{
  "name": "String (Campaign Name)",
  "owner": "String (Campaign Owner/Manager)",
  "region": "String (One of: 'Vietnam (VN)', 'Thailand (TH)', 'Malaysia (MY)', 'Indonesia (ID)', 'Philippines (PH)', 'Singapore (SG)', 'SEA Regional', 'Taiwan (TW)', 'Hong Kong (HK)', 'Korea (KR)', 'Japan (JP)', 'India (IN)', 'UAE / Dubai (AE)', 'Saudi Arabia (KSA)', 'MENA Regional', 'Brazil (BR)', 'Mexico (MX)', 'LatAm Regional', 'UK & Europe', 'Global', 'Custom')",
  "type": "String (One of: 'Lead Gen', 'Webinar', 'Brand Campaign', 'CPA Performance')",
  "status": "Launching",
  "totalBudget": Number (Total USD Budget),
  "targetLeads": Number,
  "targetCpl": Number,
  "targetFtd": Number,
  "targetVolume": Number,
  "channels": ["String"],
  "channelBreakdown": [
    { "channel": "String", "allocated": Number, "spent": 0 }
  ],
  "week1Spend": Number,
  "week1Leads": Number,
  "week1Ftd": Number,
  "week1GrossDeposit": Number,
  "timeline": [
    { "task": "String", "owner": "String", "status": "Pending", "deadline": "String (e.g. Week 1)" }
  ],
  "deliverables": [
    { "name": "String", "status": "Ready", "link": "#" }
  ],
  "webinarTopic": "String (if Webinar, else empty)",
  "webinarDate": "YYYY-MM-DD (if Webinar, else empty)",
  "aiAnalysis": {
    "confidenceScore": 95,
    "keyStrategy": "String summary of proposal strategy",
    "targetAudience": "String extracted target audience",
    "recommendations": ["String recommendation 1", "String recommendation 2"]
  }
}`;

  const payload = {
    contents: [
      {
        parts: [
          { text: systemPrompt },
          { text: `Proposal Content:\n${proposalText}\n${customPrompt ? `\nUser Additional Instruction: ${customPrompt}` : ''}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json"
    }
  };

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textContent) throw new Error('No content returned from Gemini API');

  const cleanJson = textContent.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanJson);
  
  return formatParsedCampaignResult(parsed, proposalText);
}

/**
 * Intelligent Local NLP Rule Engine for VN & EN proposals
 */
export function intelligentHeuristicProposalExtract(text, customPrompt = '') {
  const cleanText = text || '';
  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Campaign Name
  let name = 'New AI Parsed Campaign';
  const nameMatch = cleanText.match(/(?:Tên chiến dịch|Tên dự án|Campaign Name|Project Name|Dự án|Sự kiện|Tên sự kiện)[:\-\s]+([^\n\r]+)/i) ||
                    cleanText.match(/PROPOSAL[^\n\r]*[\-\:]\s*([^\n\r]+)/i);
  if (nameMatch && nameMatch[1]) {
    name = nameMatch[1].trim().replace(/^[:\-\s]+/, '');
  } else if (lines.length > 0) {
    name = lines[0].replace(/^(PROPOSAL|BẢN ĐỀ XUẤT|DỰ ÁN|CHIẾN DỊCH)[:\-\s]*/i, '').trim() || 'New AI Campaign Proposal';
  }

  // 2. Owner
  let owner = 'Marketing Manager';
  const ownerMatch = cleanText.match(/(?:Người phụ trách|Phụ trách|Owner|Manager|PIC|Lead|Người quản lý)[:\-\s]+([^\n\r]+)/i);
  if (ownerMatch && ownerMatch[1]) {
    owner = ownerMatch[1].trim();
  }

  // 3. Region
  let region = 'Vietnam (VN)';
  if (/thailand|thái lan|\(th\)/i.test(cleanText)) region = 'Thailand (TH)';
  else if (/malaysia|\(my\)/i.test(cleanText)) region = 'Malaysia (MY)';
  else if (/indonesia|\(id\)/i.test(cleanText)) region = 'Indonesia (ID)';
  else if (/philippines|\(ph\)/i.test(cleanText)) region = 'Philippines (PH)';
  else if (/singapore|\(sg\)/i.test(cleanText)) region = 'Singapore (SG)';
  else if (/sea|đông nam á|southeast asia/i.test(cleanText)) region = 'SEA Regional';
  else if (/taiwan|đài loan/i.test(cleanText)) region = 'Taiwan (TW)';
  else if (/hong kong/i.test(cleanText)) region = 'Hong Kong (HK)';
  else if (/korea|hàn quốc/i.test(cleanText)) region = 'Korea (KR)';
  else if (/japan|nhật bản/i.test(cleanText)) region = 'Japan (JP)';
  else if (/india|ấn độ/i.test(cleanText)) region = 'India (IN)';
  else if (/uae|dubai/i.test(cleanText)) region = 'UAE / Dubai (AE)';
  else if (/saudi|ksa/i.test(cleanText)) region = 'Saudi Arabia (KSA)';
  else if (/mena/i.test(cleanText)) region = 'MENA Regional';
  else if (/brazil|latam/i.test(cleanText)) region = 'LatAm Regional';
  else if (/europe|uk/i.test(cleanText)) region = 'UK & Europe';
  else if (/global|toàn cầu/i.test(cleanText)) region = 'Global';

  // 4. Campaign Type
  let type = 'Lead Gen';
  if (/webinar|sự kiện online|hội thảo/i.test(cleanText)) type = 'Webinar';
  else if (/cpa|cpa performance|cost per acquisition/i.test(cleanText)) type = 'CPA Performance';
  else if (/brand|thương hiệu|awareness/i.test(cleanText)) type = 'Brand Campaign';

  // 5. Total Budget
  let totalBudget = 10000;
  const budgetMatch = cleanText.match(/(?:Tổng ngân sách|Ngân sách|Total Budget|Budget|Budget đề xuất)[:\-\s]+(?:\$|USD)?\s*([0-9.,]+)\s*(?:USD|\$|k|triệu|tr|VND)?/i);
  if (budgetMatch && budgetMatch[1]) {
    let rawNum = budgetMatch[1].replace(/,/g, '');
    let val = parseFloat(rawNum);
    if (/triệu|tr/i.test(budgetMatch[0])) val = (val * 1000000) / 25000;
    if (/k/i.test(budgetMatch[0]) && val < 1000) val = val * 1000;
    if (val > 0) totalBudget = val;
  }

  // 6. Target Leads
  let targetLeads = Math.round(totalBudget / 20);
  const leadsMatch = cleanText.match(/(?:Mục tiêu Leads|Target Leads|Leads|Số lead|Đăng ký|Registrations)[:\-\s]+([0-9.,]+)/i);
  if (leadsMatch && leadsMatch[1]) {
    const val = parseInt(leadsMatch[1].replace(/,/g, ''), 10);
    if (val > 0) targetLeads = val;
  }

  // 7. Target CPL
  let targetCpl = targetLeads > 0 ? Number((totalBudget / targetLeads).toFixed(2)) : 20;
  const cplMatch = cleanText.match(/(?:Target CPL|CPL|Chi phí\/Lead)[:\-\s]+(?:\$|USD)?\s*([0-9.,]+)/i);
  if (cplMatch && cplMatch[1]) {
    const val = parseFloat(cplMatch[1].replace(/,/g, ''));
    if (val > 0) targetCpl = val;
  }

  // 8. Target FTDs
  let targetFtd = Math.round(targetLeads * 0.15);
  const ftdMatch = cleanText.match(/(?:Target FTD|FTD|Khách nạp|Khách nạp đầu|First Time Depositor)[:\-\s]+([0-9.,]+)/i);
  if (ftdMatch && ftdMatch[1]) {
    const val = parseInt(ftdMatch[1].replace(/,/g, ''), 10);
    if (val > 0) targetFtd = val;
  }

  // 9. Target Volume / Gross Deposit
  let targetVolume = targetFtd * 500;
  const volMatch = cleanText.match(/(?:Gross Deposit|Khối lượng nạp|Tổng tiền nạp|Deposit Volume)[:\-\s]+(?:\$|USD)?\s*([0-9.,]+)/i);
  if (volMatch && volMatch[1]) {
    let val = parseFloat(volMatch[1].replace(/,/g, ''));
    if (/k/i.test(volMatch[0]) && val < 1000) val = val * 1000;
    if (val > 0) targetVolume = val;
  }

  // 10. Channels & Channel Breakdown
  const detectedChannels = [];
  if (/meta|facebook|instagram/i.test(cleanText)) detectedChannels.push('Meta Ads');
  if (/google|youtube|search/i.test(cleanText)) detectedChannels.push('Google Search');
  if (/tiktok/i.test(cleanText)) detectedChannels.push('TikTok Ads');
  if (/telegram/i.test(cleanText)) detectedChannels.push('Telegram Ads');
  if (/kol|influencer/i.test(cleanText)) detectedChannels.push('KOL / Influencers');

  const channels = detectedChannels.length > 0 ? detectedChannels : ['Meta Ads', 'Google Search'];

  const channelBreakdown = channels.map((ch, idx) => {
    let share = idx === 0 ? 0.6 : 0.4 / (channels.length - 1 || 1);
    if (channels.length === 1) share = 1.0;
    return {
      channel: ch,
      allocated: Math.round(totalBudget * share),
      spent: 0
    };
  });

  // 11. Timeline & Deliverables parsing
  const timeline = [];
  const timelineMatches = cleanText.matchAll(/(?:Tuần|Week)\s*([0-9\-]+)[:\-\s]+([^\n\r]+)/gi);
  for (const m of timelineMatches) {
    timeline.push({
      task: m[2].trim(),
      owner: owner || 'Team',
      status: 'Pending',
      deadline: `Week ${m[1]}`
    });
  }

  if (timeline.length === 0) {
    timeline.push(
      { task: 'Creative Assets Design & Landing Page Setup', owner: owner, status: 'Completed', deadline: 'Week 1' },
      { task: 'Launch Campaign Channels & Pixel Tracking', owner: owner, status: 'In Progress', deadline: 'Week 1' },
      { task: 'A/B Testing Ad Copy & Funnel Optimization', owner: owner, status: 'Pending', deadline: 'Week 2' }
    );
  }

  const deliverables = [];
  const delivSection = cleanText.match(/(?:HẠNG MỤC BÀN GIAO|DELIVERABLES|BÀN GIAO)([\s\S]*?)(?:\n\n|\n[0-9]\.|$)/i);
  if (delivSection && delivSection[1]) {
    const dLines = delivSection[1].split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('*') || /^[0-9]\./.test(l.trim()));
    dLines.forEach(dl => {
      deliverables.push({
        name: dl.replace(/^[\-\*\s0-9\.]+\s*/, '').trim(),
        status: 'Ready',
        link: '#'
      });
    });
  }

  if (deliverables.length === 0) {
    deliverables.push(
      { name: 'Ad Creative Banners & Video Assets', status: 'Ready', link: '#' },
      { name: 'High-Converting Registration Landing Page', status: 'Live', link: '#' },
      { name: 'Weekly Performance KPI Tracking Report', status: 'In Progress', link: '#' }
    );
  }

  // 12. Webinar Details
  let webinarTopic = '';
  let webinarDate = new Date().toISOString().split('T')[0];
  if (type === 'Webinar') {
    const topicMatch = cleanText.match(/(?:Chủ đề|Sự kiện|Topic|Subject)[:\-\s]+([^\n\r]+)/i);
    if (topicMatch && topicMatch[1]) webinarTopic = topicMatch[1].trim();
    const dateMatch = cleanText.match(/([0-9]{4}\-[0-9]{2}\-[0-9]{2})/);
    if (dateMatch) webinarDate = dateMatch[1];
  }

  const rawParsed = {
    name,
    owner,
    region,
    type,
    status: 'Launching',
    totalBudget,
    targetLeads,
    targetCpl,
    targetFtd,
    targetVolume,
    channels,
    channelBreakdown,
    week1Spend: Math.round(totalBudget * 0.25),
    week1Leads: Math.round(targetLeads * 0.25),
    week1Ftd: Math.round(targetFtd * 0.2),
    week1GrossDeposit: Math.round(targetVolume * 0.2),
    timeline,
    deliverables,
    webinarTopic,
    webinarDate,
    aiAnalysis: {
      confidenceScore: 92,
      keyStrategy: `Tập trung thúc đẩy chuyển đổi ${type} tại khu vực ${region} với tổng ngân sách $${totalBudget.toLocaleString()} USD qua các kênh ${channels.join(', ')}.`,
      targetAudience: `Nhà đầu tư tài chính, Retail Traders & IBs (24 - 50 tuổi) tại thị trường ${region}`,
      recommendations: [
        `Phân bổ ${channelBreakdown[0]?.channel || 'Meta Ads'} chiếm tỷ trọng lớn để tối ưu chi phí CPL mục tiêu $${targetCpl}/Lead.`,
        `Thiết lập quy trình Tele-call & Email Automation để nâng cao tỷ lệ chuyển đổi từ Lead sang FTD (Mục tiêu: ${targetFtd} FTDs).`
      ]
    }
  };

  return formatParsedCampaignResult(rawParsed, text);
}

/**
 * Normalizes and builds full campaign object compatible with CPT schema
 */
function formatParsedCampaignResult(parsed, rawText) {
  const campaignId = 'cpt-ai-' + Date.now();
  
  const overview = {
    id: campaignId,
    name: parsed.name || 'AI Parsed Campaign',
    owner: parsed.owner || 'Paid Media Team',
    region: parsed.region || 'Vietnam (VN)',
    type: parsed.type || 'Lead Gen',
    status: parsed.status || 'Launching',
    totalBudget: Number(parsed.totalBudget) || 10000,
    startDate: new Date().toISOString().split('T')[0],
    channels: parsed.channels && parsed.channels.length > 0 ? parsed.channels : ['Meta Ads', 'Google Search'],
    objective: parsed.aiAnalysis?.keyStrategy || 'Maximize Qualified Leads and FTD Volume',
    targetAudience: parsed.aiAnalysis?.targetAudience || 'Active Forex & Gold Traders'
  };

  const kpiTargets = {
    leads: Number(parsed.targetLeads) || 500,
    cpl: Number(parsed.targetCpl) || 20,
    ftd: Number(parsed.targetFtd) || 100,
    volume: Number(parsed.targetVolume) || 50000
  };

  const budget = parsed.channelBreakdown && parsed.channelBreakdown.length > 0
    ? parsed.channelBreakdown
    : [
        { channel: overview.channels[0] || 'Meta Ads', allocated: Math.round(overview.totalBudget * 0.6), spent: Number(parsed.week1Spend) || 2000 },
        { channel: overview.channels[1] || 'Google Search', allocated: Math.round(overview.totalBudget * 0.4), spent: 0 }
      ];

  const timeline = parsed.timeline && parsed.timeline.length > 0
    ? parsed.timeline
    : [
        { task: 'Campaign Setup & Assets Brief', owner: overview.owner, status: 'Completed', deadline: 'Week 1' },
        { task: 'Launch Channels & Tracking', owner: overview.owner, status: 'In Progress', deadline: 'Week 1' }
      ];

  const deliverables = parsed.deliverables && parsed.deliverables.length > 0
    ? parsed.deliverables
    : [
        { name: 'Ad Creatives & Visual Assets', status: 'Ready', link: '#' },
        { name: 'Conversion Landing Page', status: 'Live', link: '#' }
      ];

  const week1Spend = Number(parsed.week1Spend) || Math.round(overview.totalBudget * 0.25);
  const week1Leads = Number(parsed.week1Leads) || Math.round(kpiTargets.leads * 0.25);
  const week1Ftd = Number(parsed.week1Ftd) || Math.round(kpiTargets.ftd * 0.2);
  const week1GrossDeposit = Number(parsed.week1GrossDeposit) || Math.round(kpiTargets.volume * 0.2);

  const kpiTracking = [
    {
      week: '1',
      dateRange: 'Week 1',
      channel: overview.channels[0] || 'Meta Ads',
      spend: week1Spend,
      impressions: (week1Leads || 10) * 80,
      clicks: (week1Leads || 10) * 12,
      leads: week1Leads,
      cpl: week1Leads > 0 ? Number((week1Spend / week1Leads).toFixed(2)) : 0,
      accountOpened: Math.round(week1Leads * 0.7),
      kyc: Math.round(week1Leads * 0.5),
      ftd: week1Ftd,
      ftt: Math.round(week1Ftd * 0.8),
      grossDeposit: week1GrossDeposit,
      netDeposit: week1GrossDeposit,
      lots: Math.round(week1GrossDeposit / 500),
      nmi: Math.round(week1GrossDeposit * 0.25)
    }
  ];

  const webinarTracking = overview.type === 'Webinar' ? [
    {
      topic: parsed.webinarTopic || 'CPT Market Insights Webinar',
      date: parsed.webinarDate || new Date().toISOString().split('T')[0],
      registrations: Math.round(kpiTargets.leads * 1.5),
      attendees: kpiTargets.leads,
      ftdCount: kpiTargets.ftd,
      totalDeposit: kpiTargets.volume
    }
  ] : null;

  return {
    id: campaignId,
    overview,
    kpiTargets,
    budget,
    timeline,
    deliverables,
    kpiTracking,
    webinarTracking,
    rawProposalText: rawText,
    aiAnalysis: parsed.aiAnalysis || {
      confidenceScore: 90,
      keyStrategy: 'Extracted campaign structure from proposal text.',
      targetAudience: 'Retail Traders & Investors',
      recommendations: ['Review channel budget distribution before launching.']
    }
  };
}

/**
 * Natural language fine-tuning assistant
 */
export function fineTuneCampaignWithPrompt(campaignData, promptText) {
  if (!campaignData || !promptText) return campaignData;
  const updated = JSON.parse(JSON.stringify(campaignData));
  const text = promptText.toLowerCase();

  // Budget adjustments
  const budgetMatch = text.match(/(?:budget|ngân sách|usd|\$)\s*(?:lên|thành|=|to)?\s*([0-9.,]+)\s*(?:k|usd|\$)?/i);
  if (budgetMatch && budgetMatch[1]) {
    let num = parseFloat(budgetMatch[1].replace(/,/g, ''));
    if (text.includes('k') && num < 1000) num = num * 1000;
    if (num > 0) {
      updated.overview.totalBudget = num;
      if (updated.budget && updated.budget.length > 0) {
        const totalOld = updated.budget.reduce((acc, b) => acc + (b.allocated || 0), 0) || 1;
        updated.budget.forEach(b => {
          b.allocated = Math.round((b.allocated / totalOld) * num);
        });
      }
    }
  }

  // Leads adjustments
  const leadsMatch = text.match(/(?:leads|lead|đăng ký)\s*(?:lên|thành|=|to)?\s*([0-9.,]+)/i);
  if (leadsMatch && leadsMatch[1]) {
    const val = parseInt(leadsMatch[1].replace(/,/g, ''), 10);
    if (val > 0) updated.kpiTargets.leads = val;
  }

  // FTD adjustments
  const ftdMatch = text.match(/(?:ftd|ftds|khách nạp)\s*(?:lên|thành|=|to)?\s*([0-9.,]+)/i);
  if (ftdMatch && ftdMatch[1]) {
    const val = parseInt(ftdMatch[1].replace(/,/g, ''), 10);
    if (val > 0) updated.kpiTargets.ftd = val;
  }

  // Owner adjustments
  const ownerMatch = text.match(/(?:giao cho|phụ trách|owner|manager)\s*([a-z0-9\sàáảãạăắằẳẵặâấầnẩẫậnèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]+)/i);
  if (ownerMatch && ownerMatch[1]) {
    updated.overview.owner = ownerMatch[1].trim();
  }

  // Recalculate target CPL
  if (updated.kpiTargets.leads > 0 && updated.overview.totalBudget > 0) {
    updated.kpiTargets.cpl = Number((updated.overview.totalBudget / updated.kpiTargets.leads).toFixed(2));
  }

  return updated;
}

/**
 * Continuous AI Optimization & Diagnostic Recommendation Engine
 * Evaluates active campaign metrics continuously and provides 1-click optimization actions.
 */
export function generateContinuousAiRecommendations(campaign) {
  if (!campaign) return [];
  const recommendations = [];

  const { overview = {}, kpiTracking = [], budget = [], kpiTargets = {} } = campaign;

  let totalSpend = 0;
  let totalLeads = 0;
  let totalFtd = 0;
  let totalGrossDeposit = 0;

  if (kpiTracking && Array.isArray(kpiTracking)) {
    totalSpend = kpiTracking.reduce((acc, curr) => acc + (Number(curr?.spend) || 0), 0);
    totalLeads = kpiTracking.reduce((acc, curr) => acc + (Number(curr?.leads) || 0), 0);
    totalFtd = kpiTracking.reduce((acc, curr) => acc + (Number(curr?.ftd) || 0), 0);
    totalGrossDeposit = kpiTracking.reduce((acc, curr) => acc + (Number(curr?.grossDeposit) || 0), 0);
  }

  const allocatedBudget = Number(overview.totalBudget) || 10000;
  const currentCpl = totalLeads > 0 ? totalSpend / totalLeads : 0;
  const targetCpl = Number(kpiTargets.cpl) || 20;

  // Recommendation 1: Budget Re-allocation & Channel Optimization
  if (budget.length >= 2) {
    recommendations.push({
      id: 'rec_reallocate_budget',
      category: 'Ngân sách & Channel',
      type: 'warning',
      title: 'Tối ưu phân bổ ngân sách Kênh Quảng Cáo (Channel Re-allocation)',
      description: `Kênh ${budget[0]?.channel || 'Meta Ads'} đang chiếm ${Math.round((budget[0]?.allocated / allocatedBudget) * 100)}% ngân sách. Đề xuất dịch chuyển 15% ngân sách sang ${budget[1]?.channel || 'Google Search'} để hạ CPL trung bình.`,
      actionLabel: '⚡ Tự động phân bổ lại ngân sách 60/40',
      actionPayload: { type: 'reallocate_budget', ratio: [0.6, 0.4] }
    });
  }

  // Recommendation 2: CPL Efficiency Adjustment
  if (currentCpl > targetCpl) {
    recommendations.push({
      id: 'rec_optimize_cpl',
      category: 'Tối ưu CPL',
      type: 'danger',
      title: `CPL hiện tại ($${currentCpl.toFixed(2)}) cao hơn CPL mục tiêu ($${targetCpl.toFixed(2)})`,
      description: 'Đề xuất cập nhật lại CPL mục tiêu và thêm công việc A/B Testing Video Creative để giảm chi phí/lead.',
      actionLabel: '⚡ Thêm Task A/B Testing Creative & Điều chỉnh CPL',
      actionPayload: { type: 'add_ab_task', targetCpl: Number((currentCpl * 0.85).toFixed(2)) }
    });
  } else {
    recommendations.push({
      id: 'rec_scale_winning',
      category: 'Tăng trưởng (Scaling)',
      type: 'success',
      title: 'Hiệu suất CPL xuất sắc - Đề xuất Scale Ngân sách',
      description: `CPL thực tế ($${currentCpl.toFixed(2)}) đang duy trì ở mức rất tốt. Đề xuất tăng 20% ngân sách chiến dịch để thu hút thêm leads.`,
      actionLabel: '⚡ Scale tăng 20% Ngân sách',
      actionPayload: { type: 'scale_budget', increasePercent: 20 }
    });
  }

  // Recommendation 3: Tele-sales & FTD Funnel Conversion
  const ftdRate = totalLeads > 0 ? (totalFtd / totalLeads) * 100 : 0;
  if (totalLeads > 20 && ftdRate < 10) {
    recommendations.push({
      id: 'rec_boost_ftd_funnel',
      category: 'Chuyển đổi FTD',
      type: 'warning',
      title: `Tỷ lệ chuyển đổi FTD thấp (${ftdRate.toFixed(1)}%)`,
      description: 'Đề xuất bổ sung quy trình chăm sóc tự động qua Telegram/WhatsApp & ưu đãi Bonus nạp $50 để thúc đẩy FTD.',
      actionLabel: '⚡ Thêm Hạng mục Bàn giao Campaign Nạp Bonus',
      actionPayload: { type: 'add_bonus_deliverable' }
    });
  }

  return recommendations;
}

/**
 * Executes a continuous AI recommendation action directly on a campaign object
 */
export function applyAiRecommendationToCampaign(campaign, actionPayload) {
  if (!campaign || !actionPayload) return campaign;
  const updated = JSON.parse(JSON.stringify(campaign));

  if (actionPayload.type === 'reallocate_budget' && updated.budget && updated.budget.length >= 2) {
    const totalB = Number(updated.overview.totalBudget) || 10000;
    updated.budget[0].allocated = Math.round(totalB * (actionPayload.ratio[0] || 0.6));
    updated.budget[1].allocated = Math.round(totalB * (actionPayload.ratio[1] || 0.4));
  }

  if (actionPayload.type === 'add_ab_task') {
    if (actionPayload.targetCpl) updated.kpiTargets.cpl = actionPayload.targetCpl;
    if (!updated.timeline) updated.timeline = [];
    updated.timeline.unshift({
      task: 'AI Optimization: A/B Testing 03 Ad Creatives & Refine Target Audience',
      owner: updated.overview.owner || 'Paid Team',
      status: 'In Progress',
      deadline: 'Immediate'
    });
  }

  if (actionPayload.type === 'scale_budget') {
    const increase = (actionPayload.increasePercent || 20) / 100;
    const oldB = Number(updated.overview.totalBudget) || 10000;
    const newB = Math.round(oldB * (1 + increase));
    updated.overview.totalBudget = newB;
    if (updated.budget) {
      updated.budget.forEach(b => {
        b.allocated = Math.round(b.allocated * (1 + increase));
      });
    }
  }

  if (actionPayload.type === 'add_bonus_deliverable') {
    if (!updated.deliverables) updated.deliverables = [];
    updated.deliverables.unshift({
      name: 'AI Optimization: 50% Credit Deposit Bonus Incentive Promo Landing Page',
      status: 'Ready',
      link: '#'
    });
  }

  return updated;
}
