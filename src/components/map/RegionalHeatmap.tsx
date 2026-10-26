import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  Building2, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { RegionType } from '../../types';

interface RegionalHeatmapProps {
  onOpenCase: (caseId: string) => void;
}

export const RegionalHeatmap: React.FC<RegionalHeatmapProps> = ({ onOpenCase }) => {
  const { cases, institutions } = useApp();

  const [selectedRegion, setSelectedRegion] = useState<string>('Northern (Kanpur)');

  const regionsList = [
    { name: 'Northern (Kanpur)', states: ['Uttar Pradesh', 'Uttarakhand'], hq: 'Kanpur', color: '#6366F1' },
    { name: 'North-Western (Chandigarh)', states: ['Punjab', 'Haryana', 'Rajasthan', 'Himachal Pradesh', 'Jammu & Kashmir', 'Delhi'], hq: 'Chandigarh', color: '#EC4899' },
    { name: 'Western (Mumbai)', states: ['Maharashtra', 'Goa'], hq: 'Mumbai', color: '#3B82F6' },
    { name: 'Central (Bhopal)', states: ['Madhya Pradesh', 'Chhattisgarh', 'Gujarat'], hq: 'Bhopal', color: '#10B981' },
    { name: 'Eastern (Kolkata)', states: ['West Bengal', 'Bihar', 'Jharkhand', 'Odisha', 'Assam', 'North-East'], hq: 'Kolkata', color: '#F59E0B' },
    { name: 'Southern (Chennai)', states: ['Tamil Nadu', 'Puducherry'], hq: 'Chennai', color: '#8B5CF6' },
    { name: 'South-Western (Bengaluru)', states: ['Karnataka', 'Kerala'], hq: 'Bengaluru', color: '#14B8A6' },
    { name: 'South-Central (Hyderabad)', states: ['Andhra Pradesh', 'Telangana'], hq: 'Hyderabad', color: '#EF4444' }
  ];

  const currentRegionCases = cases.filter(c => c.institutionRegion === selectedRegion);
  const currentRegionInsts = institutions.filter(i => i.region === selectedRegion);
  const breachedCount = currentRegionCases.filter(c => c.isSlaBreached && c.status !== 'DISPOSED').length;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-rose-500" />
          <span>AICTE GIS Regional Office Command Heatmap</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Geographic monitoring of complaint concentrations, regional disposal velocity, and defaulting institution clusters
        </p>
      </div>

      {/* Grid of 8 AICTE Regions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {regionsList.map(r => {
          const regCases = cases.filter(c => c.institutionRegion === r.name);
          const regBreached = regCases.filter(c => c.isSlaBreached && c.status !== 'DISPOSED').length;
          const isSelected = selectedRegion === r.name;

          return (
            <div
              key={r.name}
              onClick={() => setSelectedRegion(r.name)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-aicte-blue bg-aicte-blue/5 dark:bg-aicte-blue/20 ring-2 ring-aicte-blue shadow-md'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    RO: {r.hq}
                  </span>
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: r.color }}
                  ></span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                  {r.name.split(' ')[0]} Region
                </h4>
                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {r.states.join(', ')}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {regCases.length} Cases
                </span>
                {regBreached > 0 ? (
                  <span className="text-[10px] font-extrabold text-rose-500 bg-rose-50 dark:bg-rose-950 px-1.5 py-0.2 rounded">
                    {regBreached} Overdue
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-600 font-bold">On Track</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Region Detailed Inspection */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-slate-700 dark:text-slate-300">
                Camp Office: {regionsList.find(r => r.name === selectedRegion)?.hq}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {currentRegionInsts.length} Tracked Institutions
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {selectedRegion} Command Overview
            </h3>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[10px]">Active Grievances</span>
              <strong className="text-slate-900 dark:text-white text-sm">{currentRegionCases.length}</strong>
            </div>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
              <span className="text-rose-500 block text-[10px]">SLA Breaches</span>
              <strong className="text-rose-600 dark:text-rose-400 text-sm">{breachedCount}</strong>
            </div>
          </div>
        </div>

        {/* Regional Cases Table */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-400 font-bold text-[10px] uppercase border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">Institution & PID</th>
                <th className="py-2.5 px-3">Bureau</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-750">
              {currentRegionCases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No active complaint cases currently pending in {selectedRegion}.
                  </td>
                </tr>
              ) : (
                currentRegionCases.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      {c.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{c.institutionName}</div>
                      <div className="text-[10px] font-mono text-slate-400">PID: {c.institutionPermanentId}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[10px] font-bold">
                        {c.assignedBureau}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {c.category.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-700">
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onOpenCase(c.id)}
                        className="text-aicte-sky font-bold hover:underline"
                      >
                        Inspect →
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
  );
};
