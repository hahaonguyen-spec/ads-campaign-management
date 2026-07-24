import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

export default function KPIChart({ data = [], type = 'weeklyTrend' }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        No tracking data recorded yet. Fill weekly metrics to generate performance chart.
      </div>
    );
  }

  // Filter out any invalid items
  const safeData = data.map(d => ({
    week: d.week || 'Week',
    channel: d.channel || 'Channel',
    spend: Number(d.spend) || 0,
    leads: Number(d.leads) || 0,
    cpl: Number(d.cpl) || 0,
    ftd: Number(d.ftd) || 0,
    netDeposit: Number(d.netDeposit) || 0,
    lots: Number(d.lots) || 0
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-900 border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs space-y-1.5 backdrop-blur-md">
          <p className="font-bold text-amber-400 border-b border-slate-800 pb-1">{label}</p>
          {payload.map((item, index) => {
            const val = Number(item.value) || 0;
            const name = item.name || '';
            const isMoney = name.toLowerCase().includes('spend') || name.toLowerCase().includes('cpl') || name.toLowerCase().includes('deposit');
            return (
              <div key={index} className="flex justify-between items-center gap-4 text-slate-200">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {name}:
                </span>
                <span className="font-semibold font-mono">
                  {isMoney ? `$${val.toLocaleString()}` : val.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  if (type === 'channelBreakdown') {
    return (
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={safeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="channel" stroke="#64748B" fontSize={11} />
            <YAxis yAxisId="left" stroke="#94A3B8" fontSize={11} tickFormatter={(val) => `$${val}`} />
            <YAxis yAxisId="right" orientation="right" stroke="#D7B76D" fontSize={11} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Bar yAxisId="left" dataKey="spend" name="Spend ($)" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={28} />
            <Line yAxisId="right" type="monotone" dataKey="leads" name="Leads" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 4 }} />
            <Line yAxisId="right" type="monotone" dataKey="ftd" name="FTDs" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={safeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
          <XAxis dataKey="week" stroke="#64748B" fontSize={11} />
          <YAxis yAxisId="left" stroke="#94A3B8" fontSize={11} tickFormatter={(val) => `$${val}`} />
          <YAxis yAxisId="right" orientation="right" stroke="#D7B76D" fontSize={11} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Bar yAxisId="left" dataKey="spend" name="Spend ($)" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={24} />
          <Line yAxisId="right" type="monotone" dataKey="leads" name="Leads" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 4 }} />
          <Line yAxisId="right" type="monotone" dataKey="cpl" name="CPL ($)" stroke="#EC4899" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 3 }} />
          <Line yAxisId="right" type="monotone" dataKey="ftd" name="FTDs" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
