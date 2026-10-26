import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Clock, 
  GitMerge, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  ArrowRightLeft, 
  TrendingUp, 
  Building2, 
  User, 
  FileCheck,
  Paperclip,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { CaseStatus, BureauType } from '../../types';

interface CaseDetailModalProps {
  caseId: string;
  onClose: () => void;
  onOpenJointRoom: (overlapId?: string) => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({ 
  caseId, 
  onClose,
  onOpenJointRoom 
}) => {
  const { 
    cases, 
    updateCaseStatus, 
    transferCase, 
    escalateCase, 
    addGreenSheetNote,
    currentUser,
    overlaps
  } = useApp();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'GREEN_SHEET' | 'AUDIT_TRAIL' | 'ACTIONS'>('OVERVIEW');

  // Form states
  const [newStatus, setNewStatus] = useState<CaseStatus>('UNDER_PROCESS');
  const [statusRemark, setStatusRemark] = useState('');
  
  const [transferBureau, setTransferBureau] = useState<BureauType>('RB');
  const [transferOfficer, setTransferOfficer] = useState('');
  const [transferReason, setTransferReason] = useState('');

  const [escalateReason, setEscalateReason] = useState('');
  const [greenNoteText, setGreenNoteText] = useState('');

  const targetCase = cases.find(c => c.id === caseId);

  if (!targetCase) return null;

  // Check if case is part of any overlap
  const relatedOverlap = overlaps.find(o => o.caseIds.includes(targetCase.id));

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusRemark.trim()) {
      alert('Please enter an action remark.');
      return;
    }
    updateCaseStatus(targetCase.id, newStatus, statusRemark);
    setStatusRemark('');
    alert(`Status successfully updated to ${newStatus}.`);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferReason.trim()) {
      alert('Mandatory transfer justification is required.');
      return;
    }
    transferCase(targetCase.id, transferBureau, transferOfficer || 'Concerned Desk Officer', transferReason);
    setTransferReason('');
    alert(`Case successfully transferred to ${transferBureau}.`);
  };

  const handleEscalateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalateReason.trim()) {
      alert('Mandatory escalation justification is required.');
      return;
    }
    escalateCase(targetCase.id, escalateReason);
    setEscalateReason('');
    alert('Case successfully escalated to Member Secretary / Council Apex Committee.');
  };

  const handleGreenNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!greenNoteText.trim()) return;
    addGreenSheetNote(targetCase.id, greenNoteText);
    setGreenNoteText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">
                {targetCase.id}
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-bold bg-aicte-blue text-white">
                {targetCase.assignedBureau} Bureau
              </span>
              <span className="text-xs font-mono text-slate-400">
                Token: {targetCase.trackingToken}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1 line-clamp-1">
              {targetCase.subject}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overlap Alert Strip */}
        {targetCase.isOverlapFlagged && (
          <div className="bg-amber-500 text-slate-950 px-6 py-2.5 flex items-center justify-between text-xs font-semibold shadow-inner">
            <div className="flex items-center space-x-2">
              <GitMerge className="w-4 h-4 shrink-0" />
              <span>
                <strong>Cross-Bureau Overlap Flagged:</strong> Another AICTE Bureau has active proceedings for {targetCase.institutionName}.
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenJointRoom(relatedOverlap?.id);
              }}
              className="px-3 py-1 rounded bg-slate-950 hover:bg-slate-800 text-amber-300 font-bold transition-colors flex items-center space-x-1 shrink-0 ml-2"
            >
              <span>Coordinate in Joint Room</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Tabs Navigation */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex space-x-6 text-xs font-bold">
          {[
            { id: 'OVERVIEW', label: 'File Overview' },
            { id: 'GREEN_SHEET', label: `Digital Green Note-Sheet (${targetCase.greenSheetNotes.length})` },
            { id: 'AUDIT_TRAIL', label: `Movement History (${targetCase.actionHistory.length})` },
            { id: 'ACTIONS', label: 'Dispatch Actions & Transfer' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-3 border-b-2 transition-all ${
                activeTab === t.id
                  ? 'border-aicte-blue text-aicte-blue dark:border-amber-400 dark:text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-5 text-xs">
              {/* Institution Box */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Target Institution Profile
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {targetCase.institutionName}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                      Region: {targetCase.institutionRegion} • State: {targetCase.institutionState}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      AICTE PID: {targetCase.institutionPermanentId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Category</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">
                    {targetCase.category.replace(/_/g, ' ')}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Priority</span>
                  <div className="font-bold text-rose-600 dark:text-rose-400 mt-1">
                    {targetCase.priority}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">SLA Limit</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">
                    30 Days ({targetCase.daysPending}d elapsed)
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Handling Officer</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">
                    {targetCase.assignedOfficer}
                  </div>
                </div>
              </div>

              {/* Grievance Narrative */}
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wider mb-2">
                  Complaint Description & Allegations
                </h5>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {targetCase.description}
                </div>
              </div>

              {/* Complainant Identity */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">Complainant:</span>
                  <strong className="text-slate-900 dark:text-white">
                    {targetCase.complainantName}
                  </strong>
                  <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px]">
                    {targetCase.complainantType}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Receipt Date: {targetCase.receiptDate}
                </div>
              </div>

              {/* Supporting Evidence */}
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wider mb-2">
                  Supporting Documents & Affidavits ({targetCase.supportingDocuments.length})
                </h5>
                <div className="space-y-2">
                  {targetCase.supportingDocuments.length === 0 ? (
                    <div className="text-slate-400 italic">No external documents uploaded yet.</div>
                  ) : (
                    targetCase.supportingDocuments.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                        <div className="flex items-center space-x-2">
                          <Paperclip className="w-4 h-4 text-aicte-sky" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">{doc.name}</span>
                          <span className="text-[10px] text-slate-400">({doc.size})</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">Verified</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIGITAL GREEN NOTE-SHEET (e-Office) */}
          {activeTab === 'GREEN_SHEET' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span>
                  <strong>Official e-Office Green Note-Sheet:</strong> Legal internal ministerial minutes with immutable cryptographic signatures.
                </span>
                <span className="font-mono text-[10px] bg-emerald-200 dark:bg-emerald-900 px-2 py-0.5 rounded">
                  NIC e-Gov Standard
                </span>
              </div>

              {/* Existing Notes in Green Paper Style */}
              <div className="space-y-4 font-serif">
                {targetCase.greenSheetNotes.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs italic">
                    No official minutes recorded on this note-sheet yet. Add note below.
                  </div>
                ) : (
                  targetCase.greenSheetNotes.map(n => (
                    <div 
                      key={n.id}
                      className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border-l-4 border-emerald-600 dark:border-emerald-400 shadow-sm text-slate-800 dark:text-slate-200 text-xs space-y-2"
                    >
                      <div className="flex justify-between items-center text-[11px] text-emerald-800 dark:text-emerald-300 font-sans font-bold">
                        <span>Note #{n.noteNumber} — {n.officerName} ({n.designation}, {n.bureau})</span>
                        <span>{n.timestamp}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap font-sans text-xs">
                        {n.content}
                      </p>
                      <div className="pt-2 border-t border-emerald-200 dark:border-emerald-900 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 flex justify-between items-center font-sans">
                        <span>Signed with Digital Certificate</span>
                        <span>{n.signatureHash}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add New Note */}
              <form onSubmit={handleGreenNoteSubmit} className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Endorse Official Note on Green-Sheet (As {currentUser.name}, {currentUser.designation})
                </label>
                <textarea
                  rows={3}
                  value={greenNoteText}
                  onChange={(e) => setGreenNoteText(e.target.value)}
                  placeholder="Record official proposal, instruction to regional office, or referral to Standing Hearing Committee..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Digitally Sign & Append Note</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: AUDIT TRAIL */}
          {activeTab === 'AUDIT_TRAIL' && (
            <div className="space-y-4">
              <h5 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wider mb-2">
                Chronological Case Movement
              </h5>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                {targetCase.actionHistory.map(act => (
                  <div key={act.id} className="relative text-xs">
                    <span className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-aicte-blue border-2 border-white dark:border-slate-900"></span>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                      <span>{act.actionType}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-normal">
                        {act.bureau}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {act.remarks}
                    </p>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-2">
                      <span>By: {act.officerName} ({act.officerDesignation})</span>
                      <span>•</span>
                      <span>{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ACTIONS & DISPATCH */}
          {activeTab === 'ACTIONS' && (
            <div className="space-y-6 text-xs">
              
              {/* 1. Update Status */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                <h5 className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                  <span>Update Case Workflow Status</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold mb-1 block">Target Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as CaseStatus)}
                      className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                    >
                      <option value="UNDER_PROCESS">Under Process (Inquiry Active)</option>
                      <option value="SHOW_CAUSE_ISSUED">Show Cause Issued to College</option>
                      <option value="HEARING_SCHEDULED">Personal Hearing Scheduled (SHC)</option>
                      <option value="DISPOSED">Disposed (Resolution Completed)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold mb-1 block">Action Remarks</label>
                    <input
                      type="text"
                      value={statusRemark}
                      onChange={(e) => setStatusRemark(e.target.value)}
                      placeholder="e.g. Dispatched notice via Speed Post ref #ED8819..."
                      className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
                <button
                  onClick={handleStatusSubmit}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition-colors"
                >
                  Commit Status Change
                </button>
              </div>

              {/* 2. Transfer Case with Mandatory Reason */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                <h5 className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <ArrowRightLeft className="w-4 h-4 text-cyan-500" />
                  <span>Cross-Bureau Transfer (Mandatory Justification Required)</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold mb-1 block">Transfer to Bureau</label>
                    <select
                      value={transferBureau}
                      onChange={(e) => setTransferBureau(e.target.value as BureauType)}
                      className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                    >
                      <option value="RB">Regulation Bureau (RB)</option>
                      <option value="PGRC">Public Grievance Redressal Cell (PGRC)</option>
                      <option value="RO">Regional Office (RO)</option>
                      <option value="VIGILANCE">Chief Vigilance Officer (CVO)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold mb-1 block">Officer In-Charge (Optional)</label>
                    <input
                      type="text"
                      value={transferOfficer}
                      onChange={(e) => setTransferOfficer(e.target.value)}
                      placeholder="e.g. Dr. Arvind Mahajan"
                      className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 font-semibold mb-1 block">Mandatory Transfer Reason</label>
                  <input
                    type="text"
                    value={transferReason}
                    onChange={(e) => setTransferReason(e.target.value)}
                    placeholder="Provide statutory justification why this case belongs to the recipient bureau..."
                    className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <button
                  onClick={handleTransferSubmit}
                  className="px-4 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs shadow transition-colors"
                >
                  Execute Bureau Transfer
                </button>
              </div>

              {/* 3. Escalate to Member Secretary */}
              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 space-y-3">
                <h5 className="font-bold text-rose-700 dark:text-rose-300 flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Escalate to Member Secretary / Chairman Apex Committee</span>
                </h5>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Escalates the file directly to Senior Leadership for council-level disciplinary sanction, intake freeze, or withdrawal of approval.
                </p>
                <div>
                  <label className="text-[11px] text-slate-500 font-semibold mb-1 block">Escalation Justification</label>
                  <input
                    type="text"
                    value={escalateReason}
                    onChange={(e) => setEscalateReason(e.target.value)}
                    placeholder="e.g. Non-compliance with 2 successive show cause notices. Severe student welfare jeopardy..."
                    className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <button
                  onClick={handleEscalateSubmit}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow transition-colors"
                >
                  Confirm Apex Escalation
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-850">
          <div className="text-[11px] text-slate-400">
            Case Status: <strong className="text-slate-700 dark:text-slate-200">{targetCase.status}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs transition-colors"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
