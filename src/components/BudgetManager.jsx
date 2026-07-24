import React, { useState } from 'react';
import { DollarSign, Plus, Edit3, Trash2, History, Save, X, CheckCircle2, Clock } from 'lucide-react';

export default function BudgetManager({ campaign, onUpdateCampaign }) {
  const budgetList = campaign.budget || [];
  const budgetLogs = campaign.budgetLog || [];

  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState(budgetList);
  const [newLogNote, setNewLogNote] = useState('');

  const totalBudget = items.reduce((a, b) => a + (Number(b.usd) || 0), 0);

  const handleItemChange = (idx, field, value) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    setItems(updated);
  };

  const handleAddItem = () => {
    const newItem = {
      id: `item_${Date.now()}`,
      item: 'New Ad Budget Line',
      usd: 1000,
      note: 'Allocated for paid media'
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (idx) => {
    const itemToDelete = items[idx];
    const updated = items.filter((_, i) => i !== idx);
    setItems(updated);

    // Create log entry
    addLogEntry('Deleted Item', `Removed "${itemToDelete.item}" ($${(itemToDelete.usd || 0).toLocaleString()})`);
  };

  const addLogEntry = (action, details) => {
    const newEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleString([], { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      action,
      details,
      user: campaign.overview?.owner || 'Paid Team Manager'
    };
    return [newEntry, ...budgetLogs];
  };

  const handleSaveChanges = () => {
    const oldTotal = budgetList.reduce((a, b) => a + (Number(b.usd) || 0), 0);
    const newTotal = items.reduce((a, b) => a + (Number(b.usd) || 0), 0);

    let details = `Updated budget allocation. Total changed from $${oldTotal.toLocaleString()} to $${newTotal.toLocaleString()}.`;
    if (newLogNote) {
      details += ` Reason: ${newLogNote}`;
    }

    const updatedLogs = addLogEntry('Budget Allocation Edited', details);

    onUpdateCampaign({
      ...campaign,
      overview: {
        ...campaign.overview,
        totalBudget: newTotal,
        marketingSpend: newTotal
      },
      budget: items,
      budgetLog: updatedLogs
    });

    setIsEditing(false);
    setNewLogNote('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header & Controls */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Budget Allocation & Change Audit Log
            </h3>
            <p className="text-xs text-slate-400">
              Edit allocated budget line items while maintaining an automated immutable audit log of all changes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Budget Allocations</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setIsEditing(false); setItems(budgetList); }}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold gradient-gold-bg text-dark-900 shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Budget & Record Log</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Change Reason Note Input during Edit Mode */}
        {isEditing && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 text-xs">
            <span className="text-amber-400 font-bold block">Audit Log Revision Reason (Optional):</span>
            <input
              type="text"
              value={newLogNote}
              onChange={(e) => setNewLogNote(e.target.value)}
              placeholder="e.g. Reallocated $1,500 from Meta Ads to TikTok Video Ads per weekly ROI performance"
              className="w-full bg-slate-950 border border-amber-500/50 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:outline-none"
            />
          </div>
        )}

        {/* Budget Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                <th className="p-3 min-w-[200px]">Budget Line Item</th>
                <th className="p-3 w-40">Allocated Amount ($)</th>
                <th className="p-3 min-w-[220px]">Allocation Note / Strategy</th>
                {isEditing && <th className="p-3 w-12 text-center">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {items.map((b, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="p-2.5">
                    {isEditing ? (
                      <input
                        type="text"
                        value={b.item || ''}
                        onChange={(e) => handleItemChange(idx, 'item', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-bold"
                      />
                    ) : (
                      <span className="font-bold text-white">{b.item}</span>
                    )}
                  </td>
                  <td className="p-2.5">
                    {isEditing ? (
                      <input
                        type="number"
                        step="any"
                        value={b.usd || ''}
                        onChange={(e) => handleItemChange(idx, 'usd', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs font-mono font-bold text-emerald-400"
                      />
                    ) : (
                      <span className="font-extrabold font-mono text-emerald-400">${Number(b.usd || 0).toLocaleString()}</span>
                    )}
                  </td>
                  <td className="p-2.5">
                    {isEditing ? (
                      <input
                        type="text"
                        value={b.note || ''}
                        onChange={(e) => handleItemChange(idx, 'note', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-300"
                      />
                    ) : (
                      <span className="text-slate-400">{b.note || '-'}</span>
                    )}
                  </td>
                  {isEditing && (
                    <td className="p-2.5 text-center">
                      <button
                        onClick={() => handleDeleteItem(idx)}
                        className="p-1 text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-900/90 font-bold border-t-2 border-slate-700 text-slate-100">
              <tr>
                <td className="p-3 text-amber-400">TOTAL ALLOCATED BUDGET</td>
                <td className="p-3 font-mono text-emerald-400 text-sm">${totalBudget.toLocaleString()}</td>
                <td className="p-3 text-slate-400" colSpan={isEditing ? 2 : 1}>-</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {isEditing && (
          <button
            onClick={handleAddItem}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Add Budget Line Item</span>
          </button>
        )}
      </div>

      {/* Audit Log / Revision History */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <History className="w-4 h-4 text-amber-400" />
          Budget Revision Audit Log & Revision History ({budgetLogs.length} Entries)
        </h3>

        {budgetLogs.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">No budget revisions logged yet. Any edit to budget line items will be recorded here automatically.</p>
        ) : (
          <div className="space-y-3">
            {budgetLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-300">{log.action}</span>
                    <span className="text-[10px] text-slate-400 font-mono">by {log.user}</span>
                  </div>
                  <p className="text-slate-300 font-medium">{log.details}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">{log.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
