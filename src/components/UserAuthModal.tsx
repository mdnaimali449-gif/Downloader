import React, { useState } from 'react';
import { X, User, LogIn, CheckCircle2, Shield, Heart, Sparkles, LogOut } from 'lucide-react';
import { UserSession } from '../types';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSession: UserSession;
  onUpdateUserSession: (session: UserSession) => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  userSession,
  onUpdateUserSession
}) => {
  const [usernameInput, setUsernameInput] = useState(userSession.username || '');
  const [emailInput, setEmailInput] = useState(userSession.email || '');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    onUpdateUserSession({
      isLoggedIn: true,
      username: usernameInput.trim(),
      email: emailInput.trim() || `${usernameInput.trim().toLowerCase()}@user.local`,
    });
    onClose();
  };

  const handleLogout = () => {
    onUpdateUserSession({
      isLoggedIn: false,
      username: 'Guest User',
      email: undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white">
            {userSession.isLoggedIn ? 'User Profile' : 'User Account (ইউজার প্রোফাইল)'}
          </h3>
          <p className="text-xs text-slate-400">
            {userSession.isLoggedIn 
              ? 'আপনার পার্সোনাল অ্যাকাউন্ট সেটিংস'
              : 'লগইন ছাড়াও আপনি যেকোনো ভিডিও আনলিমিটেড ডাউনলোড করতে পারবেন।'}
          </p>
        </div>

        {userSession.isLoggedIn ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white font-bold text-base">
                  {userSession.username[0]?.toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{userSession.username}</h4>
                  <p className="text-xs text-slate-400">{userSession.email || 'Free Member'}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span>VIP High Speed Access: Active</span>
                <span>Unlimited Downloads</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>সাইন আউট করুন (Sign Out)</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                আপনার নাম (Username / Display Name)
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="যেমন: Sabbir, Naim Fan, Akash..."
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                ইমেইল (Email - Optional)
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 text-xs flex items-start gap-2">
              <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>লগইন করলে ডাউনলোড হিস্ট্রি ও পছন্দের লাভ লিংক ব্রাউজারে সংরক্ষিত থাকবে। লগইন না করলেও সম্পূর্ণ বিনামূল্যে ডাউনলোড চলবে।</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-slate-950" />
              <span>লগইন করুন (Quick Login)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
