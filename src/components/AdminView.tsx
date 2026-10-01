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
  Send,
  Check,
  RefreshCw,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { DeveloperSettings } from '../types';
import { DEFAULT_SETTINGS } from '../utils/config';

interface AdminViewProps {
  settings: DeveloperSettings;
  onUpdateSettings: (newSettings: DeveloperSettings) => void;
  onNavigateHome: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  settings,
  onUpdateSettings,
  onNavigateHome
}) => {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState<'login' | 'otp'>('login');
  
  // Login credentials
  const [email, setEmail] = useState('mdnaimali449@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // OTP flow
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Form states for developer links
  const [formSettings, setFormSettings] = useState<DeveloperSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync settings when modified outside
  useEffect(() => {
    setFormSettings(settings);
  }, [settings]);

  // Resend cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Handle Login submission & Real OTP Send
  const handleLoginSubmit = async (e: React.FormEvent) => {
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
        setLoginError(data.error || 'লগইন ব্যর্থ হয়েছে! সঠিক ইমেইল এবং পাসওয়ার্ড প্রদান করুন।');
        setIsSendingOtp(false);
        return;
      }

      setOtpSuccessMsg(data.message || `আপনার Gmail (${email}) এ ৬ ডিজিটের রিয়েল ওটিপি পাঠানো হয়েছে!`);
      setStep('otp');
      setResendCooldown(60);
      setEnteredOtp('');
      setOtpError('');
    } catch (err: any) {
      setLoginError('সার্ভারের সাথে সংযোগ বিচ্ছিন্ন: ' + (err.message || 'Error'));
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle OTP verification
  const handleOtpVerify = async (e: React.FormEvent) => {
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
        setOtpError(data.error || 'ভুল ওটিপি কোড! অনুগ্রহ করে আপনার Gmail এ আসা সঠিক কোডটি দিন।');
        setIsVerifyingOtp(false);
        return;
      }

      setIsAuthenticated(true);
      setSaveSuccess(false);
    } catch (err: any) {
      setOtpError('যাচাইকরণ ব্যর্থ হয়েছে: ' + (err.message || 'Error'));
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
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
        setOtpSuccessMsg('নতুন ওটিপি কোড সফলভাবে আপনার Gmail এ পাঠানো হয়েছে!');
        setResendCooldown(60);
      } else {
        setOtpError(data.error || 'নতুন ওটিপি পাঠানো সম্ভব হয়নি।');
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
    if (confirm('সব সেটিংস ডিফল্ট মানে রিসেট করতে চান?')) {
      setFormSettings(DEFAULT_SETTINGS);
      onUpdateSettings(DEFAULT_SETTINGS);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setStep('login');
    setPassword('');
    setEnteredOtp('');
    setLoginError('');
    setOtpError('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fadeIn">
      {/* If Not Authenticated: Step 1 or Step 2 */}
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500"></div>
          
          <div className="relative bg-slate-900/95 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-white">Naim Admin Portal</h2>
              <p className="text-xs text-slate-400">
                {step === 'login' ? 'অ্যাডমিন প্যানেল প্রবেশ করতে লগইন করুন' : 'Gmail রিয়েল ওটিপি ভেরিফিকেশন'}
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-[11px] text-amber-300 font-mono border border-slate-700">
                <span>Access URL:</span>
                <span className="font-bold text-amber-400">#naimpro</span>
                <span>/</span>
                <span className="font-bold text-amber-400">#naim</span>
              </div>
            </div>

            {/* STEP 1: Email & Password */}
            {step === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-300">
                      অ্যাডমিন ইমেইল (Admin Email)
                    </label>
                    <button
                      type="button"
                      onClick={() => setEmail('mdnaimali449@gmail.com')}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      mdnaimali449@gmail.com
                    </button>
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

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-300">
                      গোপন পাসওয়ার্ড (Admin Password)
                    </label>
                    <span className="text-[10px] text-slate-500">Naim2007@# বা naimpro</span>
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
                  <div className="p-3 bg-red-950/60 border border-red-500/30 text-red-300 rounded-xl text-xs flex items-center gap-2">
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
                      <span>Gmail এ ওটিপি পাঠানো হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-slate-950" />
                      <span>লগইন করুন ও Gmail এ রিয়েল ওটিপি পাঠান</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-500">
                  অননুমোদিত প্রবেশ সম্পূর্ণ নিষিদ্ধ • এনক্রিপ্টেড টু-ফ্যাক্টর অথেনটিকেশন
                </p>
              </form>
            )}

            {/* STEP 2: Email OTP Code */}
            {step === 'otp' && (
              <form onSubmit={handleOtpVerify} className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Gmail এ রিয়েল ওটিপি কোড পাঠানো হয়েছে!</span>
                  </div>
                  <p className="text-slate-300">
                    <span className="text-amber-300 font-semibold">{email}</span> এর ইনবক্স অথবা স্প্যাম ফোল্ডারে পাঠানো ৬-ডিজিটের সিকিউর ওটিপি কোডটি নিচে লিখুন।
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 text-center">
                    ৬ ডিজিটের ভেরিফিকেশন কোড
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="______"
                    className="w-full py-3 text-center tracking-[0.4em] font-mono text-2xl font-bold rounded-xl bg-slate-950 border border-slate-700 text-amber-300 placeholder-slate-600 focus:outline-none focus:border-amber-400"
                    autoFocus
                  />
                </div>

                {otpError && (
                  <div className="p-3 bg-red-950/60 border border-red-500/30 text-red-300 rounded-xl text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || isSendingOtp}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSendingOtp ? 'animate-spin' : ''}`} />
                    <span>{resendCooldown > 0 ? `পুনরায় পাঠান (${resendCooldown}s)` : 'রিসেন্ড কোড'}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp || enteredOtp.length < 6}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/30 cursor-pointer disabled:opacity-50"
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

                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="w-full text-center text-xs text-slate-400 hover:text-white pt-1"
                >
                  ← লগইন পেজে ফিরে যান
                </button>
              </form>
            )}

          </div>
        </div>
      ) : (
        /* STEP 3: Authenticated Admin Dashboard */
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-cyan-500/30 backdrop-blur-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">Naim Developer Control Center</h2>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                    Live Verified
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  লগইন কৃত ইমেইল: <span className="text-cyan-300 font-mono">{email}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>লগআউট</span>
              </button>
            </div>
          </div>

          {/* Settings Form */}
          <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">ডেভেলপার প্রোফাইল লিংক ও তথ্য পরিবর্তন</h3>
                <p className="text-xs text-slate-400">এখানে পরিবর্তন করলে সাইটের সব জায়গায় আপডেট হয়ে যাবে।</p>
              </div>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1"
                title="Reset to initial values"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>

            {saveSuccess && (
              <div className="p-3.5 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs sm:text-sm flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>সব তথ্য সফলভাবে সেভ করা হয়েছে (Settings updated successfully!)</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Facebook URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Facebook Profile Link
                </label>
                <input
                  type="text"
                  value={formSettings.facebookUrl}
                  onChange={(e) => setFormSettings({ ...formSettings, facebookUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* TikTok ID */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  TikTok ID / Username
                </label>
                <input
                  type="text"
                  value={formSettings.tiktokHandle}
                  onChange={(e) => setFormSettings({ ...formSettings, tiktokHandle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Telegram ID */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Telegram Username (Personal)
                </label>
                <input
                  type="text"
                  value={formSettings.telegramUsername}
                  onChange={(e) => setFormSettings({ ...formSettings, telegramUsername: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Telegram Channel Link */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Telegram Channel Link
                </label>
                <input
                  type="text"
                  value={formSettings.telegramChannelUrl}
                  onChange={(e) => setFormSettings({ ...formSettings, telegramChannelUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  WhatsApp Contact Number
                </label>
                <input
                  type="text"
                  value={formSettings.whatsappNumber}
                  onChange={(e) => setFormSettings({ ...formSettings, whatsappNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Website Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Website Title Name
                </label>
                <input
                  type="text"
                  value={formSettings.siteName}
                  onChange={(e) => setFormSettings({ ...formSettings, siteName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Announcement Box */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                হেডার নোটিশ / অ্যানাউন্সমেন্ট টেক্সট
              </label>
              <textarea
                rows={2}
                value={formSettings.announcementText}
                onChange={(e) => setFormSettings({ ...formSettings, announcementText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/30 cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4 text-slate-950" />
                <span>পরিবর্তন সংরক্ষণ করুন (Save Settings)</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
