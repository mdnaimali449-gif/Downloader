import React, { useState } from 'react';
import { ViewType, UserSession } from '../types';
import { 
  Download, 
  Sparkles, 
  User, 
  ShieldCheck, 
  Menu, 
  X, 
  Home, 
  ExternalLink,
  Lock,
  LogIn,
  Bot,
  Heart
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  userSession: UserSession;
  onToggleUserAuthModal: () => void;
  siteName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  userSession,
  onToggleUserAuthModal,
  siteName
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: ViewType) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const navItems: { id: ViewType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'downloader', label: 'Downloader', icon: <Download className="w-4 h-4" />, badge: 'Fast 4K' },
    { id: 'generator', label: 'Love Projects', icon: <Sparkles className="w-4 h-4" />, badge: '4 Sites' },
    { id: 'letter', label: 'প্রেমপত্র (Love Letter)', icon: <Heart className="w-4 h-4 text-pink-400 fill-pink-500/30" />, badge: 'New 💌' },
    { id: 'ai-tools', label: 'AI Tools', icon: <Bot className="w-4 h-4 text-cyan-400" />, badge: 'Gemini AI' },
    { id: 'developer', label: 'Developer', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-fuchsia-600 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <img 
                src="https://files.catbox.moe/01g3b7.jpg" 
                alt="Naim Profile" 
                className="relative w-12 h-12 rounded-xl object-cover border-2 border-cyan-400/80 shadow-md group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Fallback in case of network restriction
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80';
                }}
              />
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-slate-900"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-sky-200 to-fuchsia-400">
                  {siteName}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 hidden sm:inline-block">
                  v2.0 PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Facebook • YouTube • TikTok • Instagram
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      item.id === 'admin' 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile Area (Separate from Admin) */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onToggleUserAuthModal}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-slate-700/80 bg-slate-900/70 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition shadow-sm hover:border-cyan-500/50"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                {userSession.isLoggedIn ? userSession.username[0]?.toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              <div className="text-left">
                <div className="leading-none text-slate-200 font-medium">
                  {userSession.isLoggedIn ? userSession.username : 'User Account'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {userSession.isLoggedIn ? 'Active (VIP Free)' : 'No Login Required'}
                </div>
              </div>
            </button>

            {/* Quick Admin Access trigger */}
            <button
              onClick={() => handleNavClick('admin')}
              title="Admin Portal (Access via #naimpro or #naim)"
              className="p-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition flex items-center justify-center"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:border-cyan-500/50 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-bold border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onToggleUserAuthModal();
              }}
              className="w-full flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
            >
              <LogIn className="w-4 h-4 text-cyan-400" />
              <span>{userSession.isLoggedIn ? userSession.username : 'User Login (Optional)'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
