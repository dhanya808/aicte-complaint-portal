import React from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  GitMerge, 
  Building, 
  ArrowUpRight, 
  FileText, 
  ShieldAlert, 
  Sparkles,
  ExternalLink,
  Layers,
  Users2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';

export const ExecutiveDashboard: React.FC = () => {
  const { 
    cases, 
    overlaps, 
    institutions, 
    language, 
    setActiveTab, 
    setSelectedOverlapId,
    setSelectedCaseId 
  } = useApp();

  const t = translations[language];

  // Calculations
  const totalCases = cases.length;
  const rbCases = cases.filter(c => c.assignedBureau === 'RB');
  const pgrcCases = cases.filter(c => c.assignedBureau === 'PGRC');
  const roCases = cases.filter(c => c.assignedBureau === 'RO');
  const disposedCases = cases.filter(c => c.status === 'DISPOSED');
  const breachedCases = cases.filter(c => c.isSlaBreached && c.status !== 'DISPOSED');
  const activeOverlaps = overlaps.filter(o => o.status !== 'DISMISSED' && o.status !== 'MERGED');

  const disposalRate = totalCases > 0 ? Math.round((disposedCases.length / totalCases) * 100) : 0;

  // Chart Data: Bureau Workload by Stage
  const workloadData = [
    {
      stage: 'New Intake',
      RB: rbCases.filter(c => c.status === 'NEW').length,
      PGRC: pgrcCases.filter(c => c.status === 'NEW').length,
    },
    {
      stage: 'Under Scrutiny',
      RB: rbCases.filter(c => c.status === 'UNDER_PROCESS').length,
      PGRC: pgrcCases.filter(c => c.status === 'UNDER_PROCESS').length,
    },
    {
      stage: 'Show Cause',
      RB: rbCases.filter(c => c.status === 'SHOW_CAUSE_ISSUED').length,
      PGRC: pgrcCases.filter(c => c.status === 'SHOW_CAUSE_ISSUED').length,
    },
    {
      stage: 'Hearing Stage',
      RB: rbCases.filter(c => c.status === 'HEARING_SCHEDULED').length,
      PGRC: pgrcCases.filter(c => c.status === 'HEARING_SCHEDULED').length,
    },
    {
      stage: 'Disposed',
      RB: rbCases.filter(c => c.status === 'DISPOSED').length,
      PGRC: pgrcCases.filter(c => c.status === 'DISPOSED').length,
    }
  ];

  // Ageing Breakdown Data
  const ageingData = [
    { name: '< 15 Days (On-Track)', value: cases.filter(c => c.daysPending <= 15 && c.status !== 'DISPOSED').length, color: '#10B981' },
    { name: '16 - 30 Days (Warning)', value: cases.filter(c => c.daysPending > 15 && c.daysPending <= 30 && c.status !== 'DISPOSED').length, color: '#F59E0B' },
    { name: '31 - 60 Days (Breached)', value: cases.filter(c => c.daysPending > 30 && c.daysPending <= 60 && c.status !== 'DISPOSED').length, color: '#F97316' },
    { name: '> 60 Days (Critical)', value: cases.filter(c => c.daysPending > 60 && c.status !== 'DISPOSED').length, color: '#EF4444' }
  ];

  // Top High Risk Institutions
  const highRiskInstitutions = [...institutions]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Critical Overlap Emergency Banner */}
      {activeOverlaps.length > 0 && (
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-white rounded-2xl p-4 md:p-5 shadow-lg border border-rose-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 bg-rose-600/50 rounded-xl border border-rose-400/40 shrink-0">
              <GitMerge className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500 text-white uppercase tracking-wider">
                  AICTE Cross-Bureau Overlap Alert
                </span>
                <span className="text-xs text-rose-200">
                  {activeOverlaps.length} Institutions with Dual RB & PGRC Inquiries
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Potential Duplicate or Conflicting Actions Detected Across Bureaus!
              </h3>
              <p className="text-xs text-rose-100/90 max-w-2xl mt-0.5 leading-relaxed">
                Cases for Apex Institute, St. Xavier, and Kalinga Institute are currently being processed independently in Regulation Bureau and PGRC. Immediate coordination is advised to prevent contradictory orders.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2.5 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('joint-room')}
              className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <span>Open Joint Resolution Room</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Grievances */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Total Received</span>
            <FileText className="w-4 h-4 text-aicte-sky" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{totalCases}</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
              All Cells
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Across 8 AICTE Regions</div>
        </div>

        {/* Regulation Bureau */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Regulation (RB)</span>
            <Building className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{rbCases.length}</span>
            <span className="text-[10px] font-bold text-slate-500">Norms & EoA</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {rbCases.filter(c => c.status !== 'DISPOSED').length} Active Files
          </div>
        </div>

        {/* PGRC */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Grievance (PGRC)</span>
            <Users2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{pgrcCases.length}</span>
            <span className="text-[10px] font-bold text-slate-500">Staff/Student</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {pgrcCases.filter(c => c.status !== 'DISPOSED').length} Active Files
          </div>
        </div>

        {/* Overlaps Flagged */}
        <div 
          onClick={() => setActiveTab('overlaps')}
          className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-amber-300 dark:border-amber-700/60 shadow-sm hover:shadow cursor-pointer bg-gradient-to-br from-amber-50/40 dark:from-amber-950/20"
        >
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 text-xs font-bold">
            <span>Overlaps Found</span>
            <GitMerge className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {activeOverlaps.length}
            </span>
            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded">
              High Priority
            </span>
          </div>
          <div className="text-[10px] text-amber-600/80 mt-1">Cross-Bureau Alert</div>
        </div>

        {/* SLA Breaches */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-rose-300 dark:border-rose-700/60 shadow-sm hover:shadow">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 text-xs font-bold">
            <span>SLA Overdue</span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {breachedCases.length}
            </span>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-100 dark:bg-rose-950 px-1.5 py-0.5 rounded">
              &gt; 30 Days
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Requires Escalation</div>
        </div>

        {/* Disposal Efficiency */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Disposal Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {disposalRate}%
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
              {disposedCases.length} Closed
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Target: &gt; 85%</div>
        </div>
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bureau Workload Comparison (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Bureau Case Stage Distribution</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  RB vs PGRC
                </span>
              </h4>
              <p className="text-xs text-slate-400">
                Comparison of case pipelines across Regulation Bureau and Public Grievance Cell
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('cases')}
              className="text-xs text-aicte-sky hover:underline font-semibold"
            >
              View Detailed Table →
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} stroke="#888888" />
                <YAxis tick={{ fontSize: 11 }} stroke="#888888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#fff', fontSize: '12px', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="RB" name="Regulation Bureau (RB)" fill="#6366F1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="PGRC" name="Public Grievance Cell (PGRC)" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SLA Ageing Distribution (1 Col) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>SLA Pending Ageing Analysis</span>
              <Clock className="w-4 h-4 text-slate-400" />
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Citizen Charter Compliance: Mandated resolution within 30 days
            </p>
          </div>
          <div className="h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ageingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {ageingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#fff', fontSize: '11px', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 dark:border-slate-700">
            {ageingData.map((d, i) => (
              <div key={i} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                <span className="text-slate-600 dark:text-slate-400 truncate">{d.name}:</span>
                <span className="font-bold text-slate-900 dark:text-white">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Institutional Risk Index & Recent Overlaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Institutional Risk Scorecard */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>AICTE Institutional Risk Index (EoA Watchlist)</span>
              </h4>
              <p className="text-xs text-slate-400">
                Colleges accumulating multi-bureau grievances flagged before annual Extension of Approval
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('institutions')}
              className="text-xs text-aicte-sky hover:underline font-semibold"
            >
              All Colleges →
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {highRiskInstitutions.map(inst => (
              <div key={inst.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white hover:text-aicte-sky cursor-pointer"
                       onClick={() => setActiveTab('institutions')}>
                    {inst.name}
                  </div>
                  <div className="text-slate-400 text-[11px] flex items-center space-x-2 mt-0.5">
                    <span className="font-mono text-slate-500">PID: {inst.permanentId}</span>
                    <span>•</span>
                    <span>{inst.city}, {inst.state}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      inst.riskLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                      inst.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      Risk Score: {inst.riskScore}/100
                    </span>
                  </div>
                  <div className="text-[10px] text-rose-500 font-semibold mt-1">
                    EoA: {inst.eoaStatus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Detected Overlaps Overview */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Cross-Bureau Overlap Feed</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Automated entity correlation & AI semantic issue matching
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('overlaps')}
                className="text-xs text-aicte-sky hover:underline font-semibold"
              >
                Inspect All ({overlaps.length}) →
              </button>
            </div>
            <div className="space-y-3">
              {overlaps.slice(0, 2).map(ovl => (
                <div 
                  key={ovl.id}
                  className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/30 dark:bg-amber-950/20 text-xs"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {ovl.institutionName}
                    </div>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500 text-white">
                      {ovl.confidence}% Confidence
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed line-clamp-2">
                    {ovl.summary}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-amber-200/60 dark:border-amber-800/40 flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">
                      Bureaus: <strong className="text-indigo-600 dark:text-indigo-400">{ovl.bureauInvolved.join(' ↔ ')}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setSelectedOverlapId(ovl.id);
                        setActiveTab('joint-room');
                      }}
                      className="text-aicte-blue dark:text-amber-400 font-bold hover:underline flex items-center space-x-1"
                    >
                      <span>Coordinate in Joint Room</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-center">
            <span className="text-xs text-slate-400">
              Proactive coordination saves over 40 hours of redundant inspection committee expenses per institution.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
