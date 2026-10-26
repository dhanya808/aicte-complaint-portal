import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { 
  Plus, 
  Filter, 
  Search, 
  AlertTriangle, 
  Clock, 
  GitMerge, 
  Building2, 
  ArrowUpDown,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { CaseStatus, BureauType, ComplaintCase } from '../../types';

interface CaseListProps {
  onOpenCase: (caseId: string) => void;
  onOpenRegister: () => void;
}

export const CaseList: React.FC<CaseListProps> = ({ onOpenCase, onOpenRegister }) => {
  const { cases, language, globalSearch, setGlobalSearch, currentUser } = useApp();
  const t = translations[language];

  const [bureauFilter, setBureauFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [onlyOverlaps, setOnlyOverlaps] = useState<boolean>(false);
  const [onlyBreached, setOnlyBreached] = useState<boolean>(false);

  // Filter logic
  const filteredCases = cases.filter(c => {
    // Search filter
    const q = globalSearch.toLowerCase().trim();
    if (q) {
      const matchId = c.id.toLowerCase().includes(q);
      const matchPid = c.institutionPermanentId.toLowerCase().includes(q);
      const matchName = c.institutionName.toLowerCase().includes(q);
      const matchSubject = c.subject.toLowerCase().includes(q);
      const matchToken = c.trackingToken.toLowerCase().includes(q);
      if (!matchId && !matchPid && !matchName && !matchSubject && !matchToken) {
        return false;
      }
    }

    // Bureau filter
    if (bureauFilter !== 'ALL' && c.assignedBureau !== bureauFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'ALL' && c.status !== statusFilter) {
      return false;
    }

    // Overlap only filter
    if (onlyOverlaps && !c.isOverlapFlagged) {
      return false;
    }

    // SLA Breached only filter
    if (onlyBreached && (!c.isSlaBreached || c.status === 'DISPOSED')) {
      return false;
    }

    return true;
  });

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200';
      case 'UNDER_PROCESS':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200';
      case 'SHOW_CAUSE_ISSUED':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200';
      case 'HEARING_SCHEDULED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200';
      case 'DISPOSED':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200';
      case 'TRANSFERRED':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200';
      case 'ESCALATED':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getCategoryLabel = (cat: string) => {
    return cat.replace(/_/g, ' ');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header with Title and Register Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <span>{t.cases}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 font-bold text-slate-700 dark:text-slate-300">
              {filteredCases.length} Records
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Unified single-window grievance & regulatory case management across all AICTE Bureaus
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenRegister}
            className="px-4 py-2 rounded-xl bg-aicte-blue hover:bg-aicte-navy text-white text-xs font-bold shadow-md hover:shadow transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t.registerNew}</span>
          </button>
        </div>
      </div>

      {/* Filter and Query Bar */}
      <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Bureau Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            <span className="text-slate-400 mr-1 text-[11px] font-bold">Bureau:</span>
            {[
              { id: 'ALL', label: 'All Bureaus' },
              { id: 'RB', label: 'Regulation Bureau (RB)' },
              { id: 'PGRC', label: 'Public Grievance (PGRC)' },
              { id: 'RO', label: 'Regional Offices (RO)' }
            ].map(b => (
              <button
                key={b.id}
                onClick={() => setBureauFilter(b.id)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  bureauFilter === b.id
                    ? 'bg-aicte-blue text-white shadow-sm font-bold'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Quick Toggles */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setOnlyOverlaps(!onlyOverlaps)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                onlyOverlaps
                  ? 'bg-amber-500 text-white shadow'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100'
              }`}
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>Overlaps Only</span>
            </button>

            <button
              onClick={() => setOnlyBreached(!onlyBreached)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                onlyBreached
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-300 dark:border-rose-800 hover:bg-rose-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Overdue SLA</span>
            </button>
          </div>
        </div>

        {/* Status Dropdown Filter */}
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
          <span className="text-slate-400 font-medium">Filter by Status:</span>
          {['ALL', 'NEW', 'UNDER_PROCESS', 'SHOW_CAUSE_ISSUED', 'HEARING_SCHEDULED', 'DISPOSED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                statusFilter === st
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {st === 'ALL' ? 'All Statuses' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Datatable */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 text-[10px]">
              <tr>
                <th className="py-3 px-4">Case ID / Date</th>
                <th className="py-3 px-4">Institution & PID</th>
                <th className="py-3 px-4">Category & Subject</th>
                <th className="py-3 px-4">Bureau & Officer</th>
                <th className="py-3 px-4">SLA Timeline</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-center">Cross-Bureau Alert</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No complaint cases found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredCases.map(c => (
                  <tr 
                    key={c.id} 
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-750/50 transition-colors group cursor-pointer"
                    onClick={() => onOpenCase(c.id)}
                  >
                    {/* Case ID */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-900 dark:text-white group-hover:text-aicte-sky transition-colors">
                        {c.id}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Received: {c.receiptDate}
                      </div>
                    </td>

                    {/* Institution */}
                    <td className="py-3.5 px-4 max-w-[220px]">
                      <div className="font-bold text-slate-900 dark:text-white truncate">
                        {c.institutionName}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center space-x-1.5 mt-0.5">
                        <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1 py-0.2 rounded text-slate-600 dark:text-slate-300">
                          PID: {c.institutionPermanentId}
                        </span>
                        <span>•</span>
                        <span>{c.institutionState}</span>
                      </div>
                    </td>

                    {/* Category & Subject */}
                    <td className="py-3.5 px-4 max-w-[240px]">
                      <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 mb-1">
                        {getCategoryLabel(c.category)}
                      </span>
                      <div className="text-slate-700 dark:text-slate-200 font-medium truncate text-xs">
                        {c.subject}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        By: {c.complainantType} ({c.complainantName})
                      </div>
                    </td>

                    {/* Bureau & Officer */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                          c.assignedBureau === 'RB' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' :
                          c.assignedBureau === 'PGRC' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                          'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {c.assignedBureau}
                        </span>
                      </div>
                      <div className="text-slate-700 dark:text-slate-200 font-medium text-[11px] mt-1">
                        {c.assignedOfficer}
                      </div>
                    </td>

                    {/* SLA Timeline */}
                    <td className="py-3.5 px-4">
                      {c.status === 'DISPOSED' ? (
                        <span className="text-[11px] text-emerald-600 font-bold flex items-center">
                          <FileCheck2 className="w-3.5 h-3.5 mr-1" />
                          Resolved
                        </span>
                      ) : (
                        <div>
                          <div className={`text-[11px] font-bold flex items-center ${
                            c.isSlaBreached ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'
                          }`}>
                            <Clock className="w-3 h-3 mr-1" />
                            {c.isSlaBreached ? 'SLA Breached' : 'Due in ' + Math.max(0, 30 - c.daysPending) + 'd'}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Pending: {c.daysPending} days
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(c.status)}`}>
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Cross Bureau Overlap Badge */}
                    <td className="py-3.5 px-4 text-center">
                      {c.isOverlapFlagged ? (
                        <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg bg-amber-500 text-white font-extrabold text-[10px] shadow-sm animate-pulse">
                          <GitMerge className="w-3 h-3" />
                          <span>Overlap Flagged!</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px]">No Overlap</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCase(c.id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-aicte-blue hover:text-white dark:hover:bg-aicte-blue text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                      >
                        Inspect File
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
