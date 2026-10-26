import React from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { 
  LayoutDashboard, 
  FileText, 
  GitMerge, 
  Users2, 
  Building2, 
  MapPin, 
  BarChart3, 
  UploadCloud, 
  ShieldCheck, 
  SearchCode,
  AlertCircle,
  Clock
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, overlaps, cases, language, currentUser } = useApp();
  const t = translations[language];

  const activeOverlapsCount = overlaps.filter(o => o.status !== 'DISMISSED' && o.status !== 'MERGED').length;
  const overdueCasesCount = cases.filter(c => c.isSlaBreached && c.status !== 'DISPOSED').length;

  const navItems = [
    {
      id: 'dashboard',
      label: t.dashboard,
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'cases',
      label: t.cases,
      icon: FileText,
      badge: cases.length
    },
    {
      id: 'overlaps',
      label: t.overlaps,
      icon: GitMerge,
      badge: activeOverlapsCount > 0 ? `${activeOverlapsCount} Active` : null,
      badgeColor: 'bg-rose-500 text-white animate-pulse'
    },
    {
      id: 'joint-room',
      label: t.jointRoom,
      icon: Users2,
      badge: 'Coordination'
    },
    {
      id: 'institutions',
      label: t.institutions,
      icon: Building2,
      badge: null
    },
    {
      id: 'map',
      label: t.map,
      icon: MapPin,
      badge: 'Live'
    },
    {
      id: 'reports',
      label: t.reports,
      icon: BarChart3,
      badge: null
    },
    {
      id: 'bulk',
      label: t.bulkUpload,
      icon: UploadCloud,
      badge: 'CSV/Excel'
    },
    {
      id: 'citizen-tracker',
      label: t.citizenPortal,
      icon: SearchCode,
      badge: 'Public'
    },
    {
      id: 'admin',
      label: t.admin,
      icon: ShieldCheck,
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 min-h-[calc(100vh-84px)] select-none">
      {/* Bureau Filter Scoping Indicator */}
      <div className="p-3.5 m-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
        <div className="flex items-center justify-between text-slate-400 font-medium text-[11px] mb-1">
          <span>PORTAL SCOPE</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>
        <div className="font-bold text-white flex items-center space-x-1.5">
          <span className="text-amber-400">●</span>
          <span>
            {currentUser.role === 'MEMBER_SECRETARY' || currentUser.role === 'ADMIN'
              ? 'Apex Council (All Bureaus)'
              : `${currentUser.bureau} Active Bureau`}
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[11px]">
          <span className="text-rose-400 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {overdueCasesCount} Overdue SLA
          </span>
          <span className="text-amber-400 font-semibold">
            {activeOverlapsCount} Overlaps
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-aicte-blue text-white shadow-md border-l-4 border-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Info */}
      <div className="p-3 border-t border-slate-800 text-[10px] text-slate-500 text-center">
        <span>Smart India Hackathon 2024-26</span>
        <div className="text-slate-400 font-semibold mt-0.5">AICTE Cross-Bureau Integrated Hub</div>
      </div>
    </aside>
  );
};
