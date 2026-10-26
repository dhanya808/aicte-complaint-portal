import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  FileText, 
  AlertCircle,
  Building2,
  Calendar,
  Lock
} from 'lucide-react';

export const CitizenTracker: React.FC = () => {
  const { cases } = useApp();

  const [searchToken, setSearchToken] = useState('TRK-98124');
  const [captchaInput, setCaptchaInput] = useState('7829');
  const [captchaCode] = useState('7829');
  const [searchedCase, setSearchedCase] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (captchaInput !== captchaCode) {
      setErrorMessage('Invalid captcha verification code. Please try again.');
      return;
    }

    const q = searchToken.trim().toUpperCase();
    const found = cases.find(c => 
      c.trackingToken.toUpperCase() === q || c.id.toUpperCase() === q
    );

    if (found) {
      setSearchedCase(found);
    } else {
      setSearchedCase(null);
      setErrorMessage(`No complaint found with Tracking Token / Case ID: "${searchToken}".`);
    }
  };

  const getStepProgress = (status: string) => {
    switch (status) {
      case 'NEW':
        return 1;
      case 'UNDER_PROCESS':
        return 2;
      case 'SHOW_CAUSE_ISSUED':
        return 3;
      case 'HEARING_SCHEDULED':
        return 4;
      case 'DISPOSED':
        return 5;
      default:
        return 2;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="text-center space-y-2 py-4">
        <span className="px-3 py-1 rounded-full bg-aicte-blue text-white font-bold text-xs uppercase tracking-wider">
          Citizen & Student Portal
        </span>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Track Institution Complaint Status
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Real-time status tracking for grievances filed with AICTE Public Grievance Redressal Cell (PGRC) and Regulation Bureau
        </p>
      </div>

      {/* Search Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-md space-y-4">
        <form onSubmit={handleSearch} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Enter Tracking Token or Case Reference ID
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={searchToken}
                onChange={(e) => setSearchToken(e.target.value)}
                placeholder="e.g. TRK-98124 or AICTE/2026/PGRC/0841"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white text-sm"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Tip: Try demo tracking token: <strong className="text-aicte-sky cursor-pointer" onClick={() => setSearchToken('TRK-98124')}>TRK-98124</strong> or <strong className="text-aicte-sky cursor-pointer" onClick={() => setSearchToken('TRK-55209')}>TRK-55209</strong>
            </span>
          </div>

          {/* Captcha */}
          <div className="flex items-center space-x-3">
            <div className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl font-mono text-base font-extrabold tracking-widest text-slate-800 dark:text-slate-100 select-none">
              {captchaCode}
            </div>
            <input
              type="text"
              required
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              placeholder="Enter Captcha"
              className="w-36 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-center"
            />
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-aicte-blue hover:bg-aicte-navy text-white font-bold text-xs shadow transition-all"
            >
              Verify & Check Status
            </button>
          </div>
        </form>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 text-xs">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Searched Case Result Card */}
      {searchedCase && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-md space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {searchedCase.id}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {searchedCase.subject}
              </h3>
              <div className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
                <span>Institution: <strong>{searchedCase.institutionName}</strong></span>
                <span>•</span>
                <span>PID: {searchedCase.institutionPermanentId}</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              {searchedCase.status.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Stepper Milestones */}
          <div className="py-2">
            <h5 className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider mb-4">
              Grievance Progress Milestones
            </h5>
            <div className="relative flex justify-between">
              {[
                { title: 'LODGED', desc: 'Received online' },
                { title: 'SCRUTINY', desc: 'Desk review' },
                { title: 'NOTICE', desc: 'Notice sent' },
                { title: 'HEARING', desc: 'Committee review' },
                { title: 'DISPOSAL', desc: 'Action closed' }
              ].map((step, idx) => {
                const stepNum = idx + 1;
                const currentProgress = getStepProgress(searchedCase.status);
                const isPassed = currentProgress >= stepNum;

                return (
                  <div key={step.title} className="flex flex-col items-center flex-1 text-center relative z-10">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        isPassed 
                          ? 'bg-aicte-blue text-white shadow-md' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {step.title}
                    </span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Latest Public Action Notice */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Latest Official Movement / Action Taken
            </span>
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              {searchedCase.lastAction}
            </div>
            <div className="text-[11px] text-slate-400">
              Date: {searchedCase.lastActionDate}
            </div>
          </div>

          {/* Statutory Shield Notice */}
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />
            <span className="leading-snug">
              <strong>Whistleblower / Complainant Protection:</strong> In accordance with AICTE Regulations 2026, technical institutions are prohibited from taking punitive action against students or staff during active inquiry proceedings.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
