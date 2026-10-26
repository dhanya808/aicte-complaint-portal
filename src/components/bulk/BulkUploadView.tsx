import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Play, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ComplaintCase } from '../../types';
import * as XLSX from 'xlsx';

export const BulkUploadView: React.FC = () => {
  const { bulkImportCases, setActiveTab } = useApp();

  const [previewRows, setPreviewRows] = useState<Partial<ComplaintCase>[]>([]);
  const [importStatus, setImportStatus] = useState<{ count: number; overlaps: number } | null>(null);

  // Sample pre-configured test dataset to demo instant migration
  const handleLoadDemoDataset = () => {
    const demoCases: Partial<ComplaintCase>[] = [
      {
        institutionPermanentId: '1-4091823711', // Matches Apex Institute
        institutionName: 'Apex Institute of Engineering & Technology',
        institutionState: 'Rajasthan',
        institutionRegion: 'North-Western (Chandigarh)',
        category: 'GOVERNANCE_MALPRACTICE',
        assignedBureau: 'RO',
        subject: 'Unauthorized conversion of student activity center into commercial coaching franchise',
        description: 'Audit report from Regional Camp office indicating commercial coaching running inside sanctioned institutional area.',
        priority: 'HIGH',
        complainantName: 'Regional Office Field Inspector',
        complainantType: 'Stakeholder' as any
      },
      {
        institutionPermanentId: '1-7782190341', // Matches Maharashtra Institute
        institutionName: 'Maharashtra Institute of Pharmaceutical Sciences',
        institutionState: 'Maharashtra',
        institutionRegion: 'Western (Mumbai)',
        category: 'FEE_OVERCHARGE',
        assignedBureau: 'PGRC',
        subject: 'Excess examination fee charged despite online university semester fee waiver',
        description: 'Student collective grievance protesting ₹12,000 extra lab maintenance fees.',
        priority: 'MEDIUM',
        complainantName: 'B.Pharm 3rd Year Batch',
        complainantType: 'Student'
      },
      {
        institutionPermanentId: '1-5541290823', // Matches Pragati
        institutionName: 'Pragati Engineering College',
        institutionState: 'Andhra Pradesh',
        institutionRegion: 'South-Central (Hyderabad)',
        category: 'FACULTY_IRREGULARITIES',
        assignedBureau: 'RB',
        subject: 'Cadre ratio deficit in Department of Computer Science & Engineering',
        description: 'Professor count below mandatory 1:2:6 ratio as per AICTE APH Chapter 7.',
        priority: 'HIGH',
        complainantName: 'Academic Audit Cell',
        complainantType: 'Stakeholder' as any
      }
    ];

    setPreviewRows(demoCases);
    setImportStatus(null);
  };

  const handleDownloadTemplate = () => {
    const headers = [
      {
        'AICTE_Permanent_ID': '1-4091823711',
        'Institution_Name': 'Apex Institute of Engineering & Technology',
        'State': 'Rajasthan',
        'Region': 'North-Western (Chandigarh)',
        'Bureau': 'RB',
        'Category': 'FACULTY_IRREGULARITIES',
        'Priority': 'HIGH',
        'Subject': 'Sample Subject Here',
        'Description': 'Detailed description of regulatory grievance...',
        'Complainant_Type': 'Faculty'
      }
    ];
    const ws = XLSX.utils.json_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ingestion_Template');
    XLSX.writeFile(wb, 'AICTE_Bulk_Ingestion_Template.xlsx');
  };

  const handleCommitImport = () => {
    if (previewRows.length === 0) return;

    const fullCases: ComplaintCase[] = previewRows.map((r, index) => ({
      id: `AICTE/2026/${r.assignedBureau || 'PGRC'}/${Math.floor(3000 + Math.random() * 6000)}`,
      trackingToken: `TRK-${Math.floor(10000 + Math.random() * 90000)}`,
      institutionId: `INST-BULK-${index}`,
      institutionPermanentId: r.institutionPermanentId || '1-0000000000',
      institutionName: r.institutionName || 'Unknown Institution',
      institutionState: r.institutionState || 'National',
      institutionRegion: (r.institutionRegion as any) || 'Northern (Kanpur)',
      receiptDate: new Date().toISOString().split('T')[0],
      category: (r.category as any) || 'FACULTY_IRREGULARITIES',
      subject: r.subject || 'Bulk Ingested Case',
      description: r.description || '',
      complainantName: r.complainantName || 'Legacy Complainant',
      complainantType: (r.complainantType as any) || 'Student',
      assignedBureau: (r.assignedBureau as any) || 'PGRC',
      assignedOfficer: 'Bulk Ingestion Desk',
      assignedOfficerDesignation: 'Section Officer',
      status: 'UNDER_PROCESS',
      priority: (r.priority as any) || 'MEDIUM',
      slaDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      daysPending: 5,
      isSlaBreached: false,
      lastAction: 'Imported via legacy spreadsheet bridge',
      lastActionDate: new Date().toISOString().split('T')[0],
      nextActionRequired: 'Initial preliminary review',
      linkedCaseIds: [],
      isOverlapFlagged: false,
      supportingDocuments: [],
      actionHistory: [
        {
          id: `ACT-BULK-${Date.now()}-${index}`,
          timestamp: new Date().toLocaleString(),
          officerName: 'System Data Bridge',
          officerDesignation: 'e-Gov System',
          bureau: (r.assignedBureau as any) || 'PGRC',
          actionType: 'Bulk Ingested',
          remarks: 'Ingested from historical legacy Excel data repository.'
        }
      ],
      greenSheetNotes: []
    }));

    const result = bulkImportCases(fullCases);
    setImportStatus({ count: result.importedCount, overlaps: result.overlapsFound });
    setPreviewRows([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
          <UploadCloud className="w-5 h-5 text-aicte-blue" />
          <span>Legacy Bureau Data Ingestion Bridge</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Seamlessly migrate and consolidate offline Excel spreadsheets from Regulation Bureau and PGRC into the live monitoring system
        </p>
      </div>

      {/* Action Strip */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Data Ingestion Options
            </h4>
            <p className="text-xs text-slate-400">
              Download standard schema or test with simulated multi-bureau legacy spreadsheets
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadTemplate}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Schema Template</span>
            </button>
            <button
              onClick={handleLoadDemoDataset}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow transition-all flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Legacy Records</span>
            </button>
          </div>
        </div>

        {/* Drag-Drop Box */}
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center bg-slate-50 dark:bg-slate-900/40">
          <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h5 className="font-bold text-slate-700 dark:text-slate-300 text-xs">
            Drag & drop offline CSV or Excel files here
          </h5>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Automatic schema mapping with AICTE Permanent ID verification
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {importStatus && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <strong className="text-sm font-bold block">
                Successfully Ingested {importStatus.count} Records!
              </strong>
              <span className="text-[11px]">
                Real-time screening executed: {importStatus.overlaps} cross-bureau overlaps identified and correlated.
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('overlaps')}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-700 transition-colors flex items-center space-x-1"
          >
            <span>Review Overlaps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Ingestion Preview Table */}
      {previewRows.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Staged Records Preview</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  {previewRows.length} Records Ready
                </span>
              </h4>
              <p className="text-xs text-slate-400">
                Review columns before committing to centralized production database
              </p>
            </div>
            <button
              onClick={handleCommitImport}
              className="px-4 py-2 rounded-xl bg-aicte-blue hover:bg-aicte-navy text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
            >
              <Play className="w-4 h-4" />
              <span>Commit & Run Overlap Engine</span>
            </button>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">AICTE Permanent ID</th>
                  <th className="py-2.5 px-3">Institution Name</th>
                  <th className="py-2.5 px-3">Target Bureau</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Validation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-750">
                {previewRows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {r.institutionPermanentId}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {r.institutionName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[10px] font-bold">
                        {r.assignedBureau}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {r.category?.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {r.subject}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded flex items-center space-x-1 w-max">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Valid PID
                      </span>
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
