import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Building2, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  Search, 
  Plus, 
  CheckCircle2, 
  GitMerge 
} from 'lucide-react';
import { ComplaintCategory, PriorityLevel, BureauType } from '../../types';

interface RegisterCaseModalProps {
  onClose: () => void;
  onSuccess: (newCaseId: string) => void;
}

export const RegisterCaseModal: React.FC<RegisterCaseModalProps> = ({ onClose, onSuccess }) => {
  const { institutions, addCase, currentUser, cases } = useApp();

  const [selectedInstId, setSelectedInstId] = useState<string>(institutions[0]?.id || '');
  const [category, setCategory] = useState<ComplaintCategory>('FACULTY_IRREGULARITIES');
  const [priority, setPriority] = useState<PriorityLevel>('HIGH');
  const [assignedBureau, setAssignedBureau] = useState<BureauType>(
    currentUser.bureau === 'RB' ? 'RB' : 'PGRC'
  );
  
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [complainantName, setComplainantName] = useState('');
  const [complainantType, setComplainantType] = useState<'Student' | 'Faculty' | 'Parent' | 'Public/Whistleblower' | 'Anonymous'>('Student');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const selectedInst = institutions.find(i => i.id === selectedInstId);

  // Check if selected institution has other active cases in other bureaus
  const existingCasesForInst = selectedInst 
    ? cases.filter(c => c.institutionPermanentId === selectedInst.permanentId && c.status !== 'DISPOSED')
    : [];

  const hasCrossBureauOverlap = existingCasesForInst.some(c => c.assignedBureau !== assignedBureau);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      alert('Subject and description are mandatory.');
      return;
    }

    if (!selectedInst) return;

    const created = addCase({
      institutionId: selectedInst.id,
      institutionPermanentId: selectedInst.permanentId,
      institutionName: selectedInst.name,
      institutionState: selectedInst.state,
      institutionRegion: selectedInst.region,
      category,
      priority,
      assignedBureau,
      subject,
      description,
      complainantName: isAnonymous ? 'Anonymous (Sealed Identity)' : (complainantName || 'Concerned Stakeholder'),
      complainantType: isAnonymous ? 'Anonymous' : complainantType
    });

    onSuccess(created.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Plus className="w-5 h-5 text-aicte-blue" />
              <span>Register New Complaint Case</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct intake into Centralized AICTE Case Registry with automatic overlap screening
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          
          {/* Target Institution Selection */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              1. Select AICTE Approved Institution
            </label>
            <select
              value={selectedInstId}
              onChange={(e) => setSelectedInstId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-aicte-blue focus:outline-none"
            >
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} — PID: {inst.permanentId} ({inst.city}, {inst.state})
                </option>
              ))}
            </select>
          </div>

          {/* Real-time Pre-Registration Overlap Alert */}
          {hasCrossBureauOverlap && (
            <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs space-y-1">
              <div className="font-bold flex items-center space-x-1.5 text-amber-700 dark:text-amber-400">
                <GitMerge className="w-4 h-4 shrink-0" />
                <span>Cross-Bureau Pre-Alert: Active Inquiries Exist for this College!</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                This institution already has {existingCasesForInst.length} ongoing case(s) in other Bureaus. 
                Submitting this complaint will automatically flag a potential duplicate/overlapping case for joint coordination.
              </p>
            </div>
          )}

          {/* Category, Bureau & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Complaint Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="FACULTY_IRREGULARITIES">Faculty Irregularities / Ghost Faculty</option>
                <option value="SALARY_NON_PAYMENT">Salary Non-Payment (7th CPC)</option>
                <option value="FEE_OVERCHARGE">Capitation Fee / Overcharge</option>
                <option value="CERTIFICATE_WITHHELD">Withholding Original Certificates</option>
                <option value="UNAPPROVED_COURSE">Unapproved Course / Excess Intake</option>
                <option value="RAGGING_HARASSMENT">Ragging / Student Harassment</option>
                <option value="INFRASTRUCTURE_DEFICIT">Infrastructure / Lab Deficit</option>
                <option value="GOVERNANCE_MALPRACTICE">Management / Governance Malpractice</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Assign Bureau / Cell
              </label>
              <select
                value={assignedBureau}
                onChange={(e) => setAssignedBureau(e.target.value as BureauType)}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="RB">Regulation Bureau (RB)</option>
                <option value="PGRC">Public Grievance Redressal (PGRC)</option>
                <option value="RO">Regional Office (RO)</option>
                <option value="VIGILANCE">Vigilance Cell</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="CRITICAL">Critical (Ragging, SCN, High Risk)</option>
                <option value="HIGH">High (Salaries, Intake)</option>
                <option value="MEDIUM">Medium (Hostel, Facilities)</option>
                <option value="LOW">Low (General Query)</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Complaint Subject / Headline
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Non-refund of caution deposit and retention of original B.Tech certificate"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Detailed Complaint Narrative
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide specific dates, departments, names of officials, and nature of regulatory norm violated..."
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          {/* Complainant Details */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200">Complainant Information</span>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-aicte-blue focus:ring-0"
                />
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Protect Identity (Whistleblower/Anonymous)
                </span>
              </label>
            </div>

            {!isAnonymous && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 font-medium mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={complainantName}
                    onChange={(e) => setComplainantName(e.target.value)}
                    placeholder="e.g. Amit Verma"
                    className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 font-medium mb-1 block">Stakeholder Type</label>
                  <select
                    value={complainantType}
                    onChange={(e) => setComplainantType(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty Member</option>
                    <option value="Parent">Parent / Guardian</option>
                    <option value="Public/Whistleblower">Public / Whistleblower</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-aicte-blue hover:bg-aicte-navy text-white font-bold shadow-md transition-all flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Register & Screen Overlaps</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
