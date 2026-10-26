import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { 
  Building2, 
  Search, 
  ShieldAlert, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  AlertTriangle,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Institution } from '../../types';

interface InstitutionDirectoryProps {
  onSelectInstitution: (institutionId: string) => void;
}

export const InstitutionDirectory: React.FC<InstitutionDirectoryProps> = ({ onSelectInstitution }) => {
  const { institutions, cases, language, globalSearch, setGlobalSearch } = useApp();
  const t = translations[language];

  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  const filteredInstitutions = institutions.filter(inst => {
    const q = globalSearch.toLowerCase().trim();
    if (q) {
      const matchName = inst.name.toLowerCase().includes(q);
      const matchPid = inst.permanentId.toLowerCase().includes(q);
      const matchCity = inst.city.toLowerCase().includes(q);
      const matchState = inst.state.toLowerCase().includes(q);
      if (!matchName && !matchPid && !matchCity && !matchState) return false;
    }

    if (regionFilter !== 'ALL' && !inst.region.includes(regionFilter)) {
      return false;
    }

    if (riskFilter !== 'ALL' && inst.riskLevel !== riskFilter) {
      return false;
    }

    return true;
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
      case 'HIGH':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800';
      case 'MEDIUM':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
      default:
        return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-aicte-blue" />
            <span>Centralized Institution Profiles & Risk Index</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Consolidated 360° history of grievances, regulatory audits, and Extension of Approval (EoA) status
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-semibold text-[11px]">Region:</span>
          {['ALL', 'Northern', 'Western', 'Southern', 'Central', 'Eastern', 'North-Western', 'South-Western'].map(reg => (
            <button
              key={reg}
              onClick={() => setRegionFilter(reg)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                regionFilter === reg
                  ? 'bg-aicte-blue text-white font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-semibold text-[11px]">Risk Filter:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setRiskFilter(lvl)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                riskFilter === lvl
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Institutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInstitutions.map(inst => {
          const instCases = cases.filter(c => c.institutionPermanentId === inst.permanentId);
          const activeCount = instCases.filter(c => c.status !== 'DISPOSED').length;

          return (
            <div
              key={inst.id}
              onClick={() => onSelectInstitution(inst.id)}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all p-4 flex flex-col justify-between cursor-pointer group hover:border-aicte-sky"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    PID: {inst.permanentId}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getRiskColor(inst.riskLevel)}`}>
                    Risk: {inst.riskScore}/100 ({inst.riskLevel})
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-aicte-sky transition-colors line-clamp-2">
                  {inst.name}
                </h3>

                {/* Location */}
                <div className="flex items-center space-x-1 text-slate-400 text-xs mt-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{inst.city}, {inst.state} ({inst.region})</span>
                </div>

                {/* Risk Bar Meter */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Institutional Risk Meter:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{inst.riskScore}%</strong>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        inst.riskScore > 75 ? 'bg-rose-500' :
                        inst.riskScore > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${inst.riskScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* EoA Status Banner */}
                <div className="mt-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 font-medium">Annual EoA Status:</span>
                  <span className={`font-bold ${
                    inst.eoaStatus.includes('Approved') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                  }`}>
                    {inst.eoaStatus}
                  </span>
                </div>
              </div>

              {/* Bottom Complaints Count */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs">
                <span className="text-slate-500">
                  Total Complaints: <strong className="text-slate-800 dark:text-slate-100">{instCases.length}</strong> ({activeCount} Active)
                </span>
                <span className="text-aicte-sky font-bold text-xs flex items-center group-hover:translate-x-0.5 transition-transform">
                  View 360° Profile →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
