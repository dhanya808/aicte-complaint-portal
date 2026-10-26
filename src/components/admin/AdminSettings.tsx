import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Users2, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Lock,
  History
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { users, currentUser, cases } = useApp();

  const [activeTab, setActiveTab] = useState<'USERS' | 'SLA_RULES' | 'AUDIT_LOGS'>('USERS');

  const slaRules = [
    { category: 'RAGGING_HARASSMENT', title: 'Ragging & Harassment', days: 15, priority: 'CRITICAL' },
    { category: 'SALARY_NON_PAYMENT', title: 'Salary Non-Payment (7th CPC)', days: 30, priority: 'HIGH' },
    { category: 'CERTIFICATE_WITHHELD', title: 'Retention of Original Certificates', days: 15, priority: 'HIGH' },
    { category: 'FACULTY_IRREGULARITIES', title: 'Faculty Irregularities / Ghost Rolls', days: 30, priority: 'CRITICAL' },
    { category: 'FEE_OVERCHARGE', title: 'Capitation Fee / Overcharging', days: 30, priority: 'HIGH' },
    { category: 'INFRASTRUCTURE_DEFICIT', title: 'Infrastructure / Lab Area Shortfall', days: 45, priority: 'MEDIUM' },
    { category: 'UNAPPROVED_COURSE', title: 'Unapproved Course / Excess Seats', days: 30, priority: 'CRITICAL' }
  ];

  // Consolidate all action history logs from all cases to form system audit log
  const allAuditLogs = cases.flatMap(c => 
    c.actionHistory.map(a => ({
      ...a,
      caseId: c.id,
      institution: c.institutionName
    }))
  ).sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-aicte-blue" />
          <span>System Administration & Statutory Master Data</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          User access controls, category SLA definitions, and council-wide audit trail logs
        </p>
      </div>

      {/* Admin Tabs */}
      <div className="flex space-x-3 text-xs font-bold border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'USERS', label: 'User & Role Access' },
          { id: 'SLA_RULES', label: 'Category SLA Timelines' },
          { id: 'AUDIT_LOGS', label: `System Audit Log (${allAuditLogs.length})` }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`py-2.5 px-4 border-b-2 transition-all ${
              activeTab === t.id
                ? 'border-aicte-blue text-aicte-blue dark:border-amber-400 dark:text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: USERS */}
      {activeTab === 'USERS' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Authorized Bureau Officers & Delegated Roles
          </h4>
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Officer Name</th>
                  <th className="py-2.5 px-3">Official Email</th>
                  <th className="py-2.5 px-3">Designation</th>
                  <th className="py-2.5 px-3">Bureau / Cell</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-750">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {u.name}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                      {u.email}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {u.designation}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-700">
                        {u.bureau}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-aicte-sky">
                      {u.role}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SLA RULES */}
      {activeTab === 'SLA_RULES' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Statutory Resolution SLA Timelines (AICTE Regulations)
          </h4>
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Complaint Category</th>
                  <th className="py-2.5 px-3">Priority Level</th>
                  <th className="py-2.5 px-3">Prescribed SLA Limit</th>
                  <th className="py-2.5 px-3">Auto-Escalation Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-750">
                {slaRules.map(s => (
                  <tr key={s.category} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {s.title}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300">
                        {s.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">
                      {s.days} Calendar Days
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      Alert to Bureau Head at {s.days - 5} days; Council Apex escalation at {s.days} days
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'AUDIT_LOGS' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Immutable Audit Trail of All Administrative Actions
          </h4>
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs max-h-96 overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-700 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Case ID</th>
                  <th className="py-2.5 px-3">Action Type</th>
                  <th className="py-2.5 px-3">Officer</th>
                  <th className="py-2.5 px-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-750">
                {allAuditLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <td className="py-3 px-3 text-slate-400 text-[10px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      {log.caseId}
                    </td>
                    <td className="py-3 px-3 font-semibold text-aicte-blue dark:text-amber-400">
                      {log.actionType}
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                      {log.officerName} ({log.bureau})
                    </td>
                    <td className="py-3 px-3 text-slate-500 max-w-sm truncate">
                      {log.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
