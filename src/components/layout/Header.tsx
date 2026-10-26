import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Globe, 
  UserCheck, 
  ShieldAlert, 
  ChevronDown, 
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    users, 
    switchUserRole, 
    notifications, 
    language, 
    setLanguage, 
    theme, 
    toggleTheme, 
    globalSearch, 
    setGlobalSearch,
    setActiveTab,
    setSelectedCaseId
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const t = translations[language];
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      {/* Top Govt Bar */}
      <div className="bg-aicte-blue text-white px-4 py-1 text-xs flex justify-between items-center border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <span className="font-semibold tracking-wide">GOVERNMENT OF INDIA</span>
          <span className="opacity-40">|</span>
          <span className="opacity-90">{t.statutoryBody}</span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setLanguage(language === 'EN' ? 'HI' : 'EN')}
            className="flex items-center space-x-1 hover:text-amber-300 transition-colors font-medium"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'EN' ? 'हिन्दी' : 'English'}</span>
          </button>
          <span className="opacity-40">|</span>
          <span className="text-amber-300 font-mono">AICTE ICMS v2.6 (SIH Edition)</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 lg:px-6 py-2.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-aicte-blue to-aicte-navy flex items-center justify-center text-amber-400 font-bold shadow-md border border-amber-400/30">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zm0 8.5L3.82 7 12 3.32 20.18 7 12 10.5zM4 11.5v6.18L12 22l8-4.32V11.5L12 16l-8-4.5z"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                {t.portalTitle}
              </h1>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/40">
                OFFICIAL
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight">
              {t.councilName}
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-lg mx-6 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-1.5 text-sm rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-aicte-sky transition-all"
            />
            {globalSearch && (
              <button 
                onClick={() => setGlobalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Action Icons & Role Switcher */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
            title="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Intelligence & SLA Alerts
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-semibold">
                    {unreadCount} New
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-750 cursor-pointer transition-colors ${
                        n.severity === 'urgent' ? 'border-l-4 border-rose-500 bg-rose-50/20' : ''
                      }`}
                      onClick={() => {
                        if (n.caseId) {
                          setSelectedCaseId(n.caseId);
                          setActiveTab('cases');
                        }
                        setShowNotifications(false);
                      }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-1">
                          {n.type === 'OVERLAP' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 inline mr-1" />}
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 text-center">
                  <button 
                    onClick={() => {
                      setActiveTab('overlaps');
                      setShowNotifications(false);
                    }}
                    className="text-xs text-aicte-sky hover:underline font-medium"
                  >
                    View All Overlaps in Intelligence Center →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

          {/* Quick Role Switcher (Hackathon Evaluator Showcase) */}
          <div className="relative">
            <button 
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-750 transition-all text-left"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-aicte-blue to-aicte-sky text-white flex items-center justify-center font-bold text-xs shadow-inner">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-aicte-sky dark:text-amber-400 font-medium leading-tight mt-0.5 flex items-center space-x-1">
                  <span>{currentUser.designation}</span>
                  <span className="px-1 rounded bg-slate-200 dark:bg-slate-700 text-[9px] font-bold">
                    {currentUser.bureau}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Role Switcher Menu */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    SIH Demo: Switch Officer Role
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {users.map(u => (
                    <div 
                      key={u.id}
                      onClick={() => {
                        switchUserRole(u.id);
                        setShowRoleMenu(false);
                      }}
                      className={`px-4 py-2.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-700/60 cursor-pointer flex items-center justify-between ${
                        currentUser.id === u.id ? 'bg-amber-50/60 dark:bg-amber-950/30' : ''
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                          <span>{u.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {u.bureau}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {u.designation}
                        </div>
                      </div>
                      {currentUser.id === u.id && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
