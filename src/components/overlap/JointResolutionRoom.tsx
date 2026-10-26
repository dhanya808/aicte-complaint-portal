import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users2, 
  GitMerge, 
  MessageSquare, 
  Send, 
  FileCheck2, 
  Calendar, 
  AlertTriangle, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  FileText, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { BureauType } from '../../types';

interface JointResolutionRoomProps {
  overlapId?: string | null;
  onBack: () => void;
  onOpenCase: (caseId: string) => void;
}

export const JointResolutionRoom: React.FC<JointResolutionRoomProps> = ({ 
  overlapId, 
  onBack,
  onOpenCase 
}) => {
  const { 
    overlaps, 
    cases, 
    currentUser, 
    addJointNote, 
    scheduleJointAction, 
    mergeOverlapCases 
  } = useApp();

  const [noteMessage, setNoteMessage] = useState('');
  const [selectedOverlapId, setSelectedOverlapId] = useState<string>(
    overlapId || overlaps[0]?.id || ''
  );

  const activeOverlap = overlaps.find(o => o.id === selectedOverlapId) || overlaps[0];

  if (!activeOverlap) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        <Users2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
          No active overlap selected.
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Select an overlapping case from the Overlap Intelligence Center to begin cross-bureau coordination.
        </p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-aicte-blue text-white text-xs font-bold"
        >
          Return to Overlap Center
        </button>
      </div>
    );
  }

  const caseA = cases.find(c => c.id === activeOverlap.caseIds[0]);
  const caseB = cases.find(c => c.id === activeOverlap.caseIds[1]);

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteMessage.trim()) return;
    addJointNote(activeOverlap.id, noteMessage);
    setNoteMessage('');
  };

  const handleRecommendJointEvc = () => {
    scheduleJointAction(activeOverlap.id, 'JOINT_EVC');
    alert('Joint EVC Inspection recommended to AICTE Approvals Committee! Both bureaus will share a unified committee report.');
  };

  const handleMergeCases = () => {
    if (!caseA) return;
    if (confirm(`Consolidate case proceedings under primary file ${caseA.id}? Both bureaus will have joint sign-off.`)) {
      mergeOverlapCases(activeOverlap.id, caseA.id);
      alert('Cases successfully consolidated into a unified master inquiry file.');
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Bar with Selector and Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500 text-white uppercase tracking-wider">
                Joint Resolution Room
              </span>
              <span className="text-xs text-slate-400 font-mono">
                PID: {activeOverlap.institutionPermanentId}
              </span>
            </div>
            <h2 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
              {activeOverlap.institutionName}
            </h2>
          </div>
        </div>

        {/* Overlap Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-semibold hidden md:inline">Switch Active Overlap:</span>
          <select
            value={activeOverlap.id}
            onChange={(e) => setSelectedOverlapId(e.target.value)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
          >
            {overlaps.map(o => (
              <option key={o.id} value={o.id}>
                {o.institutionName.substring(0, 32)}... ({o.confidence}% Match)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Joint Coordination Strategy Strip */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-aicte-blue via-indigo-950 to-slate-900 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>AICTE Bureau Coordination Protocol</span>
          </div>
          <p className="text-xs text-slate-200 mt-1 max-w-2xl leading-relaxed">
            {activeOverlap.summary}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRecommendJointEvc}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow transition-all flex items-center space-x-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Recommend Joint EVC Inspection</span>
          </button>

          <button
            onClick={handleMergeCases}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition-all flex items-center space-x-1.5"
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>Consolidate File Proceedings</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Dual Case View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Case 1: Regulation Bureau (RB) */}
        {caseA && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/60 p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100 dark:border-slate-700">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {caseA.assignedBureau} Bureau Proceedings
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {caseA.id}
                </h4>
              </div>
              <button
                onClick={() => onOpenCase(caseA.id)}
                className="text-xs text-indigo-600 hover:underline font-bold"
              >
                Inspect Full File →
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-semibold text-[11px]">Subject:</span>
                <p className="font-bold text-slate-800 dark:text-slate-100">{caseA.subject}</p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold text-[11px]">Summary Allegation:</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  {caseA.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <span className="text-slate-400 block text-[10px]">Dealing Officer</span>
                  <strong className="text-slate-800 dark:text-slate-200">{caseA.assignedOfficer}</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <span className="text-slate-400 block text-[10px]">Current Status</span>
                  <strong className="text-indigo-600 dark:text-indigo-400">{caseA.status}</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/40 text-[11px]">
                <span className="font-bold text-indigo-900 dark:text-indigo-300">Last Action: </span>
                <span className="text-slate-600 dark:text-slate-300">{caseA.lastAction}</span>
              </div>
            </div>
          </div>
        )}

        {/* Case 2: Public Grievance (PGRC) */}
        {caseB && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-blue-200 dark:border-blue-900/60 p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100 dark:border-slate-700">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {caseB.assignedBureau} Bureau Proceedings
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {caseB.id}
                </h4>
              </div>
              <button
                onClick={() => onOpenCase(caseB.id)}
                className="text-xs text-blue-600 hover:underline font-bold"
              >
                Inspect Full File →
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-semibold text-[11px]">Subject:</span>
                <p className="font-bold text-slate-800 dark:text-slate-100">{caseB.subject}</p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold text-[11px]">Summary Allegation:</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  {caseB.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <span className="text-slate-400 block text-[10px]">Dealing Officer</span>
                  <strong className="text-slate-800 dark:text-slate-200">{caseB.assignedOfficer}</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <span className="text-slate-400 block text-[10px]">Current Status</span>
                  <strong className="text-blue-600 dark:text-blue-400">{caseB.status}</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40 text-[11px]">
                <span className="font-bold text-blue-900 dark:text-blue-300">Last Action: </span>
                <span className="text-slate-600 dark:text-slate-300">{caseB.lastAction}</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Interactive Inter-Bureau Discussion Terminal */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Inter-Bureau Collaborative Minute Sheet (Cross-Cell Dialogue)
            </h4>
          </div>
          <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500">
            Encrypted Internal Channel
          </span>
        </div>

        {/* Message Thread */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {(!activeOverlap.jointNotes || activeOverlap.jointNotes.length === 0) ? (
            <div className="p-6 text-center text-slate-400 text-xs italic">
              No cross-bureau coordination notes recorded yet. Post a message below to synchronize inquiries.
            </div>
          ) : (
            activeOverlap.jointNotes.map(n => (
              <div 
                key={n.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1"
              >
                <div className="flex justify-between items-center text-[10px]">
                  <strong className="text-slate-900 dark:text-white font-bold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{n.author}</span>
                  </strong>
                  <span className="text-slate-400">{n.timestamp}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                  {n.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Post Form */}
        <form onSubmit={handlePostNote} className="flex gap-2 pt-2">
          <input
            type="text"
            value={noteMessage}
            onChange={(e) => setNoteMessage(e.target.value)}
            placeholder={`Message as ${currentUser.name} (${currentUser.bureau} Bureau)... e.g. "We have received the bank statements, sharing copy for your faculty verification."`}
            className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-aicte-blue hover:bg-aicte-navy text-white font-bold text-xs shadow transition-colors flex items-center space-x-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Note</span>
          </button>
        </form>
      </div>

    </div>
  );
};
