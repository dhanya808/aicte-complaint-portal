import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  Mail, 
  KeyRound, 
  RotateCw, 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  SearchCode, 
  Eye, 
  EyeOff, 
  Sparkles,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { UserProfile } from '../../types';

export const LoginPage: React.FC = () => {
  const { users, login, setActiveTab } = useApp();

  const [authMode, setAuthMode] = useState<'COUNCIL' | 'PARICHAY'>('COUNCIL');
  const [selectedUser, setSelectedUser] = useState<UserProfile>(users[0]);
  const [password, setPassword] = useState('AICTE@Gov2026#');
  const [showPassword, setShowPassword] = useState(false);
  
  // Captcha
  const [captchaCode, setCaptchaCode] = useState('8K2M9');
  const [captchaInput, setCaptchaInput] = useState('8K2M9');
  const [captchaError, setCaptchaError] = useState('');

  // 2FA / OTP Step
  const [step, setStep] = useState<'LOGIN' | 'OTP' | 'FORGOT'>('LOGIN');
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');

  // Forgot password
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput(code); // Pre-fill for instant frictionless demoing
    setCaptchaError('');
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCaptchaError('');

    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setCaptchaError('Incorrect captcha verification code.');
      return;
    }

    // Advance to 2FA / OTP verification step
    setStep('OTP');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    // Accept demo OTP "123456" or any 6 digits
    if (!otpInput.trim() || otpInput.trim().length < 4) {
      setOtpError('Please enter the 6-digit OTP sent to your registered mobile.');
      return;
    }

    login(selectedUser);
  };

  const handleQuickLogin = (user: UserProfile) => {
    setSelectedUser(user);
    login(user);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.includes('@')) {
      alert('Please enter a valid official AICTE email.');
      return;
    }
    setResetSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-900">
      
      {/* Top Govt of India Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 text-xs flex justify-between items-center text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-200">GOVERNMENT OF INDIA</span>
          <span>|</span>
          <span>Ministry of Education</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">All India Council for Technical Education</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="text-amber-400 font-mono font-bold">NIC Certified Portal</span>
          <span>•</span>
          <span className="text-slate-400">National Emblem (GOI)</span>
        </div>
      </div>

      {/* Main Login Shell Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-850 rounded-3xl shadow-2xl overflow-hidden border border-slate-700/60">
          
          {/* Left Column: AICTE Seal & System Overview */}
          <div className="lg:col-span-5 bg-gradient-to-br from-aicte-blue via-aicte-navy to-slate-950 p-8 flex flex-col justify-between text-white border-r border-slate-800">
            <div>
              {/* Emblem Logo */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-900 flex items-center justify-center shadow-lg font-bold">
                  <svg className="w-9 h-9 fill-current text-slate-900" viewBox="0 0 24 24">
                    <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zm0 8.5L3.82 7 12 3.32 20.18 7 12 10.5zM4 11.5v6.18L12 22l8-4.32V11.5L12 16l-8-4.5z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-white leading-none">
                    AICTE ICMS
                  </h1>
                  <span className="text-[11px] text-amber-300 font-semibold tracking-wide">
                    Integrated Complaint Monitoring System
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-extrabold text-white leading-snug">
                Single-Window Council Command & Cross-Bureau Redressal Hub
              </h2>
              <p className="text-xs text-slate-300/80 mt-2 leading-relaxed">
                Centralized real-time tracking unifying Regulation Bureau (RB), Public Grievance Redressal Cell (PGRC), and Regional Camp Offices.
              </p>

              {/* Security Features */}
              <div className="mt-8 space-y-3 text-xs">
                <div className="flex items-center space-x-2.5 text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mandatory 2FA / NIC e-Pramaan SSO protocol</span>
                </div>
                <div className="flex items-center space-x-2.5 text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Role-Scoped Dashboard (RB, PGRC, Regional Offices)</span>
                </div>
                <div className="flex items-center space-x-2.5 text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-Time Cross-Bureau Overlap Screening</span>
                </div>
              </div>
            </div>

            {/* Bottom Public Tracking Link */}
            <div className="pt-6 mt-6 border-t border-slate-700/60">
              <span className="text-[11px] text-slate-400 block mb-1">
                Are you a Student, Faculty, or Citizen Complainant?
              </span>
              <button
                onClick={() => {
                  login(users[0]);
                  setActiveTab('citizen-tracker');
                }}
                className="text-xs text-amber-300 hover:text-amber-200 font-bold flex items-center space-x-1.5 transition-colors"
              >
                <SearchCode className="w-4 h-4" />
                <span>Track Complaint Status with Case Token →</span>
              </button>
            </div>
          </div>

          {/* Right Column: Authentication Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-slate-900 text-slate-100">
            <div>
              {/* Tab Selector */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex space-x-4 text-xs font-bold">
                  <button
                    onClick={() => setAuthMode('COUNCIL')}
                    className={`pb-2 border-b-2 transition-all ${
                      authMode === 'COUNCIL'
                        ? 'border-amber-400 text-amber-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Council Officer Sign-In
                  </button>
                  <button
                    onClick={() => setAuthMode('PARICHAY')}
                    className={`pb-2 border-b-2 transition-all ${
                      authMode === 'PARICHAY'
                        ? 'border-amber-400 text-amber-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Jan Parichay (MeriPehchan SSO)
                  </button>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  256-Bit SSL
                </span>
              </div>

              {/* STEP 1: INITIAL LOGIN */}
              {step === 'LOGIN' && (
                <form onSubmit={handleInitialSubmit} className="space-y-4 text-xs">
                  {/* Officer User Select / Input */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Select Bureau / Officer Account
                    </label>
                    <div className="relative">
                      <select
                        value={selectedUser.id}
                        onChange={(e) => {
                          const found = users.find(u => u.id === e.target.value);
                          if (found) setSelectedUser(found);
                        }}
                        className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
                      >
                        {users.map(u => (
                          <option key={u.id} value={u.id}>
                            {u.name} — [{u.bureau}] {u.designation}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Official Email / ID */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Official Council ID / Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        readOnly
                        value={selectedUser.email}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 font-mono text-slate-300"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-300 font-semibold">Password</label>
                      <button
                        type="button"
                        onClick={() => setStep('FORGOT')}
                        className="text-amber-400 hover:underline text-[11px]"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Captcha Box */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Security Captcha Verification
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-lg font-black tracking-widest text-amber-300 select-none">
                        {captchaCode}
                      </div>
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors"
                        title="Reload Captcha"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                      <input
                        type="text"
                        required
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        placeholder="Type characters"
                        className="flex-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-center font-bold tracking-wider"
                      />
                    </div>
                    {captchaError && (
                      <span className="text-rose-400 text-[11px] mt-1 block font-semibold">
                        {captchaError}
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-lg transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Proceed to 2FA Authentication</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: 2FA / OTP VERIFICATION */}
              {step === 'OTP' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs animate-in fade-in">
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="flex items-center space-x-2 text-amber-400 font-bold mb-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Two-Factor Authentication (Gov e-Pramaan)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      A 6-digit one-time passcode has been dispatched to the authorized mobile number registered with AICTE Council Directory for <strong>{selectedUser.name}</strong>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Enter 6-Digit One-Time Password (OTP)
                    </label>
                    <input
                      type="text"
                      autoFocus
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="e.g. 123456"
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-center text-lg tracking-widest font-extrabold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                    <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5">
                      <span>Demo Hackathon OTP: <strong className="text-amber-400 cursor-pointer" onClick={() => setOtpInput('123456')}>123456</strong></span>
                      <button type="button" onClick={() => setOtpInput('123456')} className="text-aicte-sky hover:underline">
                        Auto-fill OTP
                      </button>
                    </div>
                    {otpError && (
                      <span className="text-rose-400 text-[11px] mt-1 block font-semibold">
                        {otpError}
                      </span>
                    )}
                  </div>

                  <div className="pt-2 flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setStep('LOGIN')}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Enter Council Dashboard</span>
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: FORGOT PASSWORD */}
              {step === 'FORGOT' && (
                <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs animate-in fade-in">
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <h4 className="font-bold text-white text-xs mb-1">Reset Council Officer Password</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Enter your official email (`@aicte-india.org`). A secure NIC authentication recovery link will be dispatched.
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Official AICTE Email</label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="e.g. advisor.rb@aicte-india.org"
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>

                  {resetSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs">
                      Password reset token successfully dispatched to {resetEmail}.
                    </div>
                  )}

                  <div className="pt-2 flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setStep('LOGIN');
                        setResetSuccess(false);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                    >
                      Back to Login
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow"
                    >
                      Send Password Recovery Link
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Quick 1-Click Role Login Bar for SIH Evaluators */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SIH Evaluator 1-Click Fast Login:</span>
                </span>
                <span className="text-[10px] text-slate-500">Auto-routes to role scope</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => handleQuickLogin(u)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/60 text-left transition-colors text-[11px]"
                  >
                    <div className="font-bold text-white truncate">{u.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-amber-300/90 font-medium">
                      {u.bureau} Bureau
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-slate-950 border-t border-slate-800 px-4 py-2 text-center text-slate-500 text-[11px]">
        Designed for Smart India Hackathon (SIH) • Statutory AICTE Integrated Redressal Architecture • Ministry of Education
      </div>

    </div>
  );
};
