import React from 'react';
import { 
  Heart, 
  Facebook, 
  Send, 
  Video, 
  Phone, 
  Lock, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ViewType, DeveloperSettings } from '../types';

interface FooterProps {
  onNavigate: (view: ViewType) => void;
  settings: DeveloperSettings;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, settings }) => {
  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const internationalWhatsApp = cleanWhatsAppNumber.startsWith('88') 
    ? cleanWhatsAppNumber 
    : cleanWhatsAppNumber.startsWith('0') 
      ? `88${cleanWhatsAppNumber}` 
      : cleanWhatsAppNumber;

  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-xl py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Brand Info */}
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <img
              src="https://files.catbox.moe/01g3b7.jpg"
              alt="Naim Profile"
              className="w-12 h-12 rounded-xl object-cover border border-cyan-400/60 shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80';
              }}
            />
            <div>
              <div className="text-white font-extrabold text-lg tracking-tight flex items-center justify-center md:justify-start gap-2">
                <span>{settings.siteName}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Created & Designed by Nahidul Islam Naim
              </p>
            </div>
          </div>

          {/* Social Icons Bar */}
          <div className="flex items-center gap-2">
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:text-blue-400 text-slate-300 transition"
              title="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>

            <a
              href={`https://www.tiktok.com/@${settings.tiktokHandle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/50 hover:text-pink-400 text-slate-300 transition"
              title="TikTok"
            >
              <Video className="w-4 h-4" />
            </a>

            <a
              href={`https://t.me/${settings.telegramUsername.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:text-sky-400 text-slate-300 transition"
              title="Telegram"
            >
              <Send className="w-4 h-4" />
            </a>

            <a
              href={`https://wa.me/${internationalWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-400 text-slate-300 transition"
              title="WhatsApp"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
            <button onClick={() => onNavigate('home')} className="hover:text-cyan-400 transition">
              Home
            </button>
            <button onClick={() => onNavigate('downloader')} className="hover:text-cyan-400 transition">
              Downloader
            </button>
            <button onClick={() => onNavigate('ai-tools')} className="hover:text-purple-400 text-purple-300 font-bold transition">
              AI Tools
            </button>
            <button onClick={() => onNavigate('generator')} className="hover:text-pink-400 transition">
              Love Generator
            </button>
            <button onClick={() => onNavigate('letter')} className="hover:text-rose-400 text-rose-300 font-bold transition">
              💌 প্রেমপত্র (Love Letter)
            </button>
            <button onClick={() => onNavigate('developer')} className="hover:text-cyan-400 transition">
              Developer Profile
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} {settings.siteName}. All Rights Reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Crafted with <Heart className="w-3.5 h-3.5 text-pink-500 fill-current" /> for high-speed media delivery
          </p>
        </div>
      </div>
    </footer>
  );
};
