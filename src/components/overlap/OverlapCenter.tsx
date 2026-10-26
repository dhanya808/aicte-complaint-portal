import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { 
  GitMerge, 
  Sparkles, 
  AlertTriangle, 
  ArrowUpRight, 
  ShieldAlert, 
  Building2, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  FileText
} from 'lucide-react';
import { OverlapGroup } from '../../types';

interface OverlapCenterProps {
  onOpenJointRoom: (overlapId: string) => void;
  onOpenCase: (caseId: string) => void;
}

export const OverlapCenter: React.FC<OverlapCenterProps> = ({ onOpenJointRoom, onOpenCase }) => {
  const { overlaps, cases, language, dismissOverlap } = useApp();
  const t = translations[language];

  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredOverlaps = overlaps.filter(o => {
    if (filterType !== 'ALL' && o.matchType !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Page Title & Explanation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <GitMerge className="w-5 h-5 text-amber-500" />
            <span>Cross-Bureau Overlap Intelligence Center</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated entity matching and AI semantic issue correlation preventing duplicate, contradictory AICTE actions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-xl bg-amber-500 text-white font-extrabold text-xs shadow-sm flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{overlaps.filter(o => o.status !== 'DISMISSED').length} Active Overlaps</span>
          </span>
        </div>
      </div>

      {/* Detection Technique Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => setFilterType('EXACT_PERMANENT_ID')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterType === 'EXACT_PERMANENT_ID'
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Level 1: Exact PID Matching
            </span>
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
            {overlaps.filter(o => o.matchType === 'EXACT_PERMANENT_ID').length} Cases
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Matches identical AICTE Permanent ID (e.g. 1-4091823711) receiving simultaneous filings in RB & PGRC.
          </p>
        </div>

        <div 
          onClick={() => setFilterType('FUZZY_NAME_ADDRESS')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterType === 'FUZZY_NAME_ADDRESS'
              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Level 2: Fuzzy Entity Matching
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
            {overlaps.filter(o => o.matchType === 'FUZZY_NAME_ADDRESS').length} Cases
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Catches misspelled college names, soundex variants, and address matches when PID was omitted by student.
          </p>
        </div>

        <div 
          onClick={() => setFilterType('ALL')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterType === 'ALL'
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Level 3: AI Semantic Issue Match
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
            Active Engine
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Detects when different words describe the same root regulatory violation (e.g., ghost faculty vs unpaid salaries).
          </p>
        </div>
      </div>

      {/* Overlaps Feed List */}
      <div className="space-y-4">
        {filteredOverlaps.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400 text-xs">
            No active overlapping cases found in this category.
          </div>
        ) : (
          filteredOverlaps.map(ovl => {
            const caseA = cases.find(c => c.id === ovl.caseIds[0]);
            const caseB = cases.find(c => c.id === ovl.caseIds[1]);

            return (
              <div 
                key={ovl.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-amber-200 dark:border-amber-900/60 shadow-sm overflow-hidden"
              >
                {/* Overlap Card Top Header */}
                <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-200/60 dark:border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500 text-white">
                        {ovl.confidence}% AI Match Confidence
                      </span>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        PID: {ovl.institutionPermanentId}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{ovl.region}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {ovl.institutionName}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onOpenJointRoom(ovl.id)}
                      className="px-4 py-2 rounded-xl bg-aicte-blue hover:bg-aicte-navy text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
                    >
                      <span>Open Joint Resolution Room</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Overlap Summary Diagnosis */}
                <div className="p-4 bg-amber-50/40 dark:bg-amber-950/20 text-xs text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700/60 flex items-start space-x-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">AICTE Conflict Prevention Notice: </strong>
                    {ovl.summary}
                  </div>
                </div>

                {/* Side-by-Side Comparison of Cases */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">
                  
                  {/* Case 1 */}
                  {caseA && (
                    <div className="p-4 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center space-x-1">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{caseA.id}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {caseA.assignedBureau} Bureau
                        </span>
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-100">
                        {caseA.subject}
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 line-clamp-2 text-[11px]">
                        {caseA.description}
                      </p>
                      <div className="pt-2 flex justify-between items-center text-[11px] text-slate-400">
                        <span>Handling: <strong>{caseA.assignedOfficer}</strong></span>
                        <button 
                          onClick={() => onOpenCase(caseA.id)}
                          className="text-aicte-sky hover:underline font-semibold"
                        >
                          View File →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Case 2 */}
                  {caseB && (
                    <div className="p-4 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center space-x-1">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{caseB.id}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {caseB.assignedBureau} Bureau
                        </span>
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-100">
                        {caseB.subject}
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 line-clamp-2 text-[11px]">
                        {caseB.description}
                      </p>
                      <div className="pt-2 flex justify-between items-center text-[11px] text-slate-400">
                        <span>Handling: <strong>{caseB.assignedOfficer}</strong></span>
                        <button 
                          onClick={() => onOpenCase(caseB.id)}
                          className="text-aicte-sky hover:underline font-semibold"
                        >
                          View File →
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Card Footer with Quick Joint Notes count */}
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-[11px] text-slate-500">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ovl.jointNotes?.length || 0} Inter-Bureau Discussion Notes</span>
                  </div>
                  <div className="space-x-3">
                    <button
                      onClick={() => dismissOverlap(ovl.id)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-[11px]"
                    >
                      Dismiss (Not Duplicate)
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
