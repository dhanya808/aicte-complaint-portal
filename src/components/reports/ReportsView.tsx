import React from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { 
  BarChart3, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Layers
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const ReportsView: React.FC = () => {
  const { cases, institutions, language } = useApp();
  const t = translations[language];

  // Performance calculations
  const totalCases = cases.length;
  const rbCases = cases.filter(c => c.assignedBureau === 'RB');
  const pgrcCases = cases.filter(c => c.assignedBureau === 'PGRC');
  const roCases = cases.filter(c => c.assignedBureau === 'RO');

  const exportToExcel = () => {
    const reportData = cases.map(c => ({
      'Case ID': c.id,
      'AICTE Permanent ID': c.institutionPermanentId,
      'Institution Name': c.institutionName,
      'Region': c.institutionRegion,
      'State': c.institutionState,
      'Category': c.category,
      'Bureau': c.assignedBureau,
      'Handling Officer': c.assignedOfficer,
      'Status': c.status,
      'Days Pending': c.daysPending,
      'SLA Breached': c.isSlaBreached ? 'YES' : 'NO',
      'Overlap Flagged': c.isOverlapFlagged ? 'YES' : 'NO',
      'Receipt Date': c.receiptDate,
      'Last Action': c.lastAction
    }));

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AICTE_Grievance_Report');
    XLSX.writeFile(workbook, `AICTE_Integrated_Cases_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with Export Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-aicte-blue" />
            <span>AICTE Statutory Performance Reports & Analytics</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Official monthly/quarterly compliance review ready for Member Secretary and Council submission
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <button
            onClick={exportToExcel}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-all flex items-center space-x-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export to Excel (.xlsx)</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow transition-all flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Dossier</span>
          </button>
        </div>
      </div>

      {/* Bureau Comparison Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Layers className="w-4 h-4 text-aicte-sky" />
          <span>Bureau / Cell Disposal Velocity & SLA Compliance</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">Bureau / Cell</th>
                <th className="py-2.5 px-3">Total Inquiries</th>
                <th className="py-2.5 px-3">Under Process</th>
                <th className="py-2.5 px-3">Show Cause Issued</th>
                <th className="py-2.5 px-3">Disposed</th>
                <th className="py-2.5 px-3">SLA Breaches</th>
                <th className="py-2.5 px-3">Disposal Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-750">
              {[
                { name: 'Regulation Bureau (RB)', data: rbCases, code: 'RB' },
                { name: 'Public Grievance Redressal Cell (PGRC)', data: pgrcCases, code: 'PGRC' },
                { name: 'Regional Camp Offices (RO)', data: roCases, code: 'RO' }
              ].map(b => {
                const total = b.data.length;
                const underProc = b.data.filter(c => c.status === 'UNDER_PROCESS').length;
                const scn = b.data.filter(c => c.status === 'SHOW_CAUSE_ISSUED').length;
                const disposed = b.data.filter(c => c.status === 'DISPOSED').length;
                const breached = b.data.filter(c => c.isSlaBreached && c.status !== 'DISPOSED').length;
                const rate = total > 0 ? Math.round((disposed / total) * 100) : 0;

                return (
                  <tr key={b.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {b.name}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {total}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {underProc}
                    </td>
                    <td className="py-3 px-3 text-amber-600 font-semibold">
                      {scn}
                    </td>
                    <td className="py-3 px-3 text-emerald-600 font-bold">
                      {disposed}
                    </td>
                    <td className="py-3 px-3 text-rose-600 font-bold">
                      {breached}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-extrabold text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ageing Summary Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Pending Cases Ageing Matrix (Citizen Charter Timelines)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">
              0 - 15 Days (Stage 1)
            </span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {cases.filter(c => c.daysPending <= 15 && c.status !== 'DISPOSED').length}
            </div>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">Under preliminary scrutiny</p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase">
              16 - 30 Days (Stage 2)
            </span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {cases.filter(c => c.daysPending > 15 && c.daysPending <= 30 && c.status !== 'DISPOSED').length}
            </div>
            <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">Show cause explanation awaited</p>
          </div>

          <div className="p-3.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
            <span className="text-[10px] font-bold text-orange-800 dark:text-orange-300 uppercase">
              31 - 60 Days (Breached)
            </span>
            <div className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-1">
              {cases.filter(c => c.daysPending > 30 && c.daysPending <= 60 && c.status !== 'DISPOSED').length}
            </div>
            <p className="text-[10px] text-orange-700 dark:text-orange-400 mt-0.5">Mandatory reminder dispatched</p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
            <span className="text-[10px] font-bold text-rose-800 dark:text-rose-300 uppercase">
              &gt; 60 Days (Critical)
            </span>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
              {cases.filter(c => c.daysPending > 60 && c.status !== 'DISPOSED').length}
            </div>
            <p className="text-[10px] text-rose-700 dark:text-rose-400 mt-0.5">Auto-escalated to Apex Council</p>
          </div>
        </div>
      </div>
    </div>
  );
};
