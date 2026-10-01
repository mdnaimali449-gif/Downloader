import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  RotateCcw, 
  LogOut, 
  Eye, 
  EyeOff, 
  X, 
  RefreshCw, 
  Check, 
  Sparkles,
  ExternalLink,
  Send,
  Loader2
} from 'lucide-react';
import { DeveloperSettings } from '../types';
import { DEFAULT_SETTINGS } from '../utils/config';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DeveloperSettings;
  onUpdateSettings: (newSettings: DeveloperSettings) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  // Flow steps: 'login' | 'otp' | 'dashboard'
  const [step, setStep] = useState<'login' | 'otp' | 'dashboard'>('login');
  
  // Credentials
  const [email, setEmail] = useState('mdnaimali449@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // OTP Verification
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Settings form
  const [formSettings, setFormSettings] = useState<DeveloperSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync settings when opened
  useEffect(() => {
    setFormSettings(settings);
  }, [settings, isOpen]);

  // Resend cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Step 1: Send Real OTP to Gmail
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSendingOtp(true);

    try {
      const res = await fetch('/api/admin/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim()
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoginError(data.error || 'লগইন ব্যর্থ হয়েছে। ইমেইল এবং পাসওয়ার্ড সঠিক কিনা পরীক্ষা করুন।');
        setIsSendingOtp(false);
        return;
      }

      setOtpSuccessMsg(data.message || `আপনার Gmail (${email}) এ ৬ ডিজিটের ওটিপি পাঠানো হয়েছে!`);
      setStep('otp');
      setResendCooldown(60);
      setEnteredOtp('');
      setOtpError('');
    } catch (err: any) {
      setLoginError('সার্ভারে যোগাযোগ করা যায়নি: ' + (err.message || 'Error'));
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Step 2: Verify Real OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    if (enteredOtp.length < 6) {
      setOtpError('অনুগ্রহ করে ৬ ডিজিটের সম্পূর্ণ ওটিপি কোডটি লিখুন।');
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: enteredOtp.trim()
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setOtpError(data.error || 'ভুল ওটিপি কোড! অনুগ্রহ করে আবার চেষ্টা করুন।');
        setIsVerifyingOtp(false);
        return;
      }

      // Success! Grant access to Dashboard
      setStep('dashboard');
    } catch (err: any) {
      setOtpError('যাচাইকরণ ব্যর্থ হয়েছে: ' + (err.message || 'Error'));
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0 || isSendingOtp) return;
    setIsSendingOtp(true);
    setOtpError('');

    try {
      const res = await fetch('/api/admin/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSuccessMsg('নতুন ওটিপি সফলভাবে আপনার Gmail এ পাঠানো হয়েছে!');
        setResendCooldown(60);
      } else {
        setOtpError(data.error || 'নতুন ওটিপি পাঠানো ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      setOtpError('নেটওয়ার্ক ত্রুটি: ' + (err.message || 'Error'));
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Reset to initial defaults
  const handleResetDefaults = () => {
    if (confirm('সব সেটিংস মূল ডিফল্ট মানে রিসেট করতে চান?')) {
      setFormSettings(DEFAULT_SETTINGS);
      onUpdateSettings(DEFAULT_SETTINGS);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // Logout
  const handleLogout = () => {
    setStep('login');
    setPassword('');
    setEnteredOtp('');
    setLoginError('');
    setOtpError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      {/* Outer Glow Wrapper */}
      <div className="relative w-full max-w-2xl my-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-cyan-500 to-indigo-600 rounded-3xl blur-xl opacity-50 transition duration-500"></div>

        {/* Modal Container */}
        <div className="relative bg-slate-900/95 border border-amber-500/40 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white tracking-wide">
                    Naim Admin Portal
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    #naimpro
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {step === 'login' && 'সিকিউর অ্যাডমিন লগইন ও জিমেইল ওটিপি অথেনটিকেশন'}
                  {step === 'otp' && 'Gmail এ প্রেরিত রিয়েল ওটিপি কোড যাচাইকরণ'}
                  {step === 'dashboard' && 'লাইভ কন্ট্রোল প্যানেল ও সেটিংস এডিটর'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6">

            {/* STEP 1: Login Form */}
            {step === 'login' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
                  <Lock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300">দ্বি-স্তর বিশিষ্ট নিরাপত্তা (2-Factor Protection):</span>
                    <p className="text-slate-300 mt-1">
                      পাসওয়ার্ড দেওয়ার পর আপনার রিয়েল Gmail ইনবক্সে ৬-ডিজিটের ওটিপি যাবে। ওটিপি সফলভাবে যাচাই করার পরই কন্ট্রোল সেন্টারে প্রবেশাধিকার মিলবে।
                    </p>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-300">
                      অ্যাডমিন ইমেইল (Admin Email)
                    </label>
                    <div className="flex gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setEmail('mdnaimali449@gmail.com')}
                        className="text-cyan-400 hover:underline"
                      >
                        mdnaimali449@gmail.com
                      </button>
                      <span className="text-slate-600">•</span>
                      <button
                        type="button"
                        onClick={() => setEmail('ntnaim34@gmail.com')}
                        className="text-cyan-400 hover:underline"
                      >
                        ntnaim34@gmail.com
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mdnaimali449@gmail.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-300">
                      অ্যাডমিন পাসওয়ার্ড (Admin Password)
                    </label>
                    <span className="text-[10px] text-slate-500">ডিফল্ট: Naim2007@# বা naimpro</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="পাসওয়ার্ড লিখুন..."
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 bg-red-950/60 border border-red-500/30 text-red-300 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 disabled:opacity-60"
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 text-slate-950 animate-spin" />
                      <span>জিমেইলে ওটিপি পাঠানো হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-slate-950" />
                      <span>জিমেইলে রিয়েল ওটিপি কোড পাঠান</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: Real OTP Verification */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>রিয়েল ওটিপি সফলভাবে পাঠানো হয়েছে!</span>
                  </div>
                  <p className="text-slate-300">
                    আমরা আপনার জিমেইল <span className="text-amber-300 font-semibold">{email}</span> এ একটি ৬-ডিজিটের ভেরিফিকেশন কোড পাঠিয়েছি। অনুগ্রহ করে আপনার ইনবক্স অথবা স্প্যাম ফোল্ডার চেক করুন।
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 text-center">
                    Gmail এ পাওয়া ৬ ডিজিটের ওটিপি লিখুন
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="______"
                    className="w-full py-3.5 text-center tracking-[0.4em] font-mono text-2xl font-black rounded-xl bg-slate-950 border border-amber-500/50 text-amber-300 placeholder-slate-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner"
                    autoFocus
                  />
                  <p className="text-[11px] text-center text-slate-400">
                    কোডটি ১০ মিনিটের জন্য কার্যকর থাকবে
                  </p>
                </div>

                {otpError && (
                  <div className="p-3 bg-red-950/60 border border-red-500/30 text-red-300 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || isSendingOtp}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSendingOtp ? 'animate-spin' : ''}`} />
                    <span>{resendCooldown > 0 ? `পুনরায় পাঠান (${resendCooldown}s)` : 'রিসেন্ড ওটিপি'}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp || enteredOtp.length < 6}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/30 cursor-pointer disabled:opacity-50 active:scale-95 transition"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <Loader2 className="w-4 h-4 text-slate-950 animate-spin" />
                        <span>যাচাই হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-slate-950" />
                        <span>ভেরিফাই ও প্রবেশ করুন</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('login')}
                    className="text-xs text-slate-400 hover:text-white transition"
                  >
                    ← ইমেইল বা পাসওয়ার্ড পরিবর্তন করতে ফিরে যান
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Authenticated Admin Dashboard */}
            {step === 'dashboard' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">লগইন সফল • সিকিউর অ্যাডমিন ভেরিফাইড</h4>
                      <p className="text-[11px] text-emerald-300/80 font-mono">{email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-1 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>লগআউট</span>
                  </button>
                </div>

                {saveSuccess && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>সব সেটিংস সফলভাবে আপডেট ও সেভ করা হয়েছে!</span>
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Facebook URL */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">
                        Facebook Profile Link
                      </label>
                      <input
                        type="text"
                        value={formSettings.facebookUrl}
                        onChange={(e) => setFormSettings({ ...formSettings, facebookUrl: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* TikTok Handle */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">
                        TikTok Username
                      </label>
                      <input
                        type="text"
                        value={formSettings.tiktokHandle}
                        onChange={(e) => setFormSettings({ ...formSettings, tiktokHandle: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Telegram Username */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">
                        Telegram Username (Personal)
                      </label>
                      <input
                        type="text"
                        value={formSettings.telegramUsername}
                        onChange={(e) => setFormSettings({ ...formSettings, telegramUsername: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Telegram Channel */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">
                        Telegram Channel URL
                      </label>
                      <input
                        type="text"
                        value={formSettings.telegramChannelUrl}
                        onChange={(e) => setFormSettings({ ...formSettings, telegramChannelUrl: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">
                        WhatsApp Contact Number
                      </label>
                      <input
                        type="text"
                        value={formSettings.whatsappNumber}
                        onChange={(e) => setFormSettings({ ...formSettings, whatsappNumber: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Site Title */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">
                        Website Brand Name
                      </label>
                      <input
                        type="text"
                        value={formSettings.siteName}
                        onChange={(e) => setFormSettings({ ...formSettings, siteName: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Announcement */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">
                      হেডার নোটিশ / অ্যানাউন্সমেন্ট টেক্সট
                    </label>
                    <textarea
                      rows={2}
                      value={formSettings.announcementText}
                      onChange={(e) => setFormSettings({ ...formSettings, announcementText: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={handleResetDefaults}
                      className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Defaults</span>
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/30 cursor-pointer active:scale-95 transition"
                    >
                      <Save className="w-4 h-4 text-slate-950" />
                      <span>পরিবর্তন সংরক্ষণ করুন (Save Settings)</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

          {/* Footer note */}
          <div className="px-6 py-3 border-t border-slate-800/80 bg-slate-950/70 flex items-center justify-between text-[11px] text-slate-500">
            <span>লিংক শেষে <code className="text-amber-400 bg-slate-800 px-1 py-0.5 rounded">#naimpro</code> বা <code className="text-amber-400 bg-slate-800 px-1 py-0.5 rounded">#naim</code> টাইপ করলে এই পপআপ ওপেন হবে</span>
            <span>NAIM v2.0 PRO</span>
          </div>

        </div>
      </div>
    </div>
  );
};
