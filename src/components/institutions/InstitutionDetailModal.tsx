import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldAlert, 
  Clock, 
  FileText, 
  GitMerge, 
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface InstitutionDetailModalProps {
  institutionId: string;
  onClose: () => void;
  onOpenCase: (caseId: string) => void;
}

export const InstitutionDetailModal: React.FC<InstitutionDetailModalProps> = ({ 
  institutionId, 
  onClose,
  onOpenCase 
}) => {
  const { institutions, cases } = useApp();

  const inst = institutions.find(i => i.id === institutionId);
  if (!inst) return null;

  const associatedCases = cases.filter(c => c.institutionPermanentId === inst.permanentId);
  const activeCases = associatedCases.filter(c => c.status !== 'DISPOSED');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-aicte-blue text-white">
                AICTE PID: {inst.permanentId}
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {inst.type}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {inst.name}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* Institutional Health & Risk Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase">Risk Rating</span>
              <div className="font-black text-base text-rose-600 dark:text-rose-400 mt-0.5">
                {inst.riskScore}/100 ({inst.riskLevel})
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase">Total Inquiries</span>
              <div className="font-black text-base text-slate-900 dark:text-white mt-0.5">
                {associatedCases.length} Cases ({activeCases.length} Active)
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase">Approval Status</span>
              <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {inst.approvalStatus}
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase">Annual EoA Status</span>
              <div className={`font-bold mt-0.5 ${inst.eoaStatus.includes('Approved') ? 'text-emerald-600' : 'text-rose-500'}`}>
                {inst.eoaStatus}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600 dark:text-slate-300">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{inst.address}, {inst.city}, {inst.state} - {inst.pincode}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{inst.contactEmail}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{inst.contactPhone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Principal: <strong>{inst.principalName}</strong></span>
            </div>
          </div>

          {/* Consolidated Complaint Cases Table */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wider mb-2 flex items-center justify-between">
              <span>Consolidated Bureau Case Records ({associatedCases.length})</span>
              <span className="text-slate-400 font-normal">Cross-Bureau View</span>
            </h4>
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold text-[10px] uppercase border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Case ID</th>
                    <th className="py-2.5 px-3">Bureau</th>
                    <th className="py-2.5 px-3">Category & Subject</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Officer</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-750">
                  {associatedCases.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400">
                        No registered complaints against this institution.
                      </td>
                    </tr>
                  ) : (
                    associatedCases.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                          {c.id}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            c.assignedBureau === 'RB' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' :
                            c.assignedBureau === 'PGRC' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                            'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {c.assignedBureau}
                          </span>
                        </td>
                        <td className="py-3 px-3 max-w-[220px]">
                          <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {c.subject}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {c.category.replace(/_/g, ' ')}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {c.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-[11px]">
                          {c.assignedOfficer}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              onClose();
                              onOpenCase(c.id);
                            }}
                            className="text-aicte-sky font-bold hover:underline"
                          >
                            Open File →
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

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-850">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
};
