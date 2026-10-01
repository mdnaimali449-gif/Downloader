import React, { useState } from 'react';
import { 
  Facebook, 
  Send, 
  Video, 
  Phone, 
  MessageSquare, 
  ExternalLink, 
  Check, 
  Copy, 
  ShieldCheck, 
  Award, 
  Sparkles,
  Code2,
  Terminal,
  Globe
} from 'lucide-react';
import { DeveloperSettings } from '../types';

interface DeveloperViewProps {
  settings: DeveloperSettings;
  onOpenAdmin: () => void;
}

export const DeveloperView: React.FC<DeveloperViewProps> = ({ settings, onOpenAdmin }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const internationalWhatsApp = cleanWhatsAppNumber.startsWith('88') 
    ? cleanWhatsAppNumber 
    : cleanWhatsAppNumber.startsWith('0') 
      ? `88${cleanWhatsAppNumber}` 
      : cleanWhatsAppNumber;

  const socialCards = [
    {
      id: 'facebook',
      name: 'Facebook Profile',
      handle: 'NAHIDUL ISLAM NAIM',
      link: settings.facebookUrl,
      icon: <Facebook className="w-5 h-5 text-blue-400" />,
      color: 'from-blue-600/30 to-blue-900/30',
      borderColor: 'border-blue-500/40',
      actionLabel: 'Visit Profile'
    },
    {
      id: 'tiktok',
      name: 'TikTok Official',
      handle: `@${settings.tiktokHandle.replace('@', '')}`,
      link: `https://www.tiktok.com/@${settings.tiktokHandle.replace('@', '')}`,
      icon: <Video className="w-5 h-5 text-pink-400" />,
      color: 'from-pink-600/30 to-purple-900/30',
      borderColor: 'border-pink-500/40',
      actionLabel: 'Follow on TikTok'
    },
    {
      id: 'telegram',
      name: 'Telegram Personal',
      handle: settings.telegramUsername,
      link: `https://t.me/${settings.telegramUsername.replace('@', '')}`,
      icon: <Send className="w-5 h-5 text-sky-400" />,
      color: 'from-sky-600/30 to-cyan-900/30',
      borderColor: 'border-sky-500/40',
      actionLabel: 'Chat on Telegram'
    },
    {
      id: 'telegram_channel',
      name: 'Telegram Channel',
      handle: 'NOBITA INCOME ZONE',
      link: settings.telegramChannelUrl,
      icon: <Globe className="w-5 h-5 text-indigo-400" />,
      color: 'from-indigo-600/30 to-violet-900/30',
      borderColor: 'border-indigo-500/40',
      actionLabel: 'Join Channel'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Direct',
      handle: settings.whatsappNumber,
      link: `https://wa.me/${internationalWhatsApp}`,
      icon: <Phone className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-600/30 to-teal-900/30',
      borderColor: 'border-emerald-500/40',
      actionLabel: 'Chat on WhatsApp',
      copyValue: settings.whatsappNumber
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10 animate-fadeIn">
      {/* Profile Header Hero */}
      <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-slate-900/90 shadow-2xl p-6 sm:p-10 backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 text-center sm:text-left">
          {/* Avatar with futuristic glowing frame */}
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-500 rounded-3xl blur-md opacity-80 group-hover:opacity-100 transition duration-300"></div>
            <img
              src="https://files.catbox.moe/01g3b7.jpg"
              alt="Nahidul Islam Naim"
              className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-cyan-400 shadow-2xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute -bottom-2 -right-2 bg-slate-950 border border-cyan-400 p-1.5 rounded-xl shadow-lg">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                Lead Developer & Creator
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                Online & Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Nahidul Islam Naim
            </h1>

            <p className="text-sm text-slate-300 max-w-xl">
              ওয়েব ডেভেলপার এবং ডিজিটাল ক্রিয়েটর। হাই-পারফরম্যান্স মিডিয়া ডাউনলোডার, ক্রিয়েটিভ ওয়েব প্রজেক্টস এবং সোশ্যাল মিডিয়া অটোমেশন প্ল্যাটফর্ম নির্মাতা।
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <a
                href={`https://wa.me/${internationalWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Contact via WhatsApp</span>
              </a>

              <button
                onClick={onOpenAdmin}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold flex items-center gap-2 border border-slate-700 transition"
              >
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Admin Login (#naimpro)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Contact Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Official Social & Community Channels
          </h2>
          <span className="text-xs text-slate-400">Click to connect instantly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialCards.map((card) => (
            <div
              key={card.id}
              className={`p-5 rounded-2xl bg-gradient-to-br ${card.color} bg-slate-900 border ${card.borderColor} backdrop-blur-md shadow-xl flex flex-col justify-between space-y-4 hover:scale-[1.02] transition duration-300 group`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-700/80 shadow-inner group-hover:scale-110 transition">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-300">{card.name}</h3>
                    <p className="text-base font-extrabold text-white truncate max-w-[180px]">
                      {card.handle}
                    </p>
                  </div>
                </div>

                {card.copyValue && (
                  <button
                    onClick={() => handleCopy(card.copyValue!, card.id)}
                    className="p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white transition"
                    title="Copy Number"
                  >
                    {copiedField === card.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>

              <div className="pt-2">
                <a
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-950/80 hover:bg-slate-950 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700/80 hover:border-cyan-400 transition"
                >
                  <span>{card.actionLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
        <p className="text-sm font-semibold text-slate-300">
          💡 কোনো সহায়তা বা প্রজেক্ট সম্পর্কিত প্রয়োজনে সরাসরি হোয়াটসঅ্যাপ বা টেলিগ্রামে যোগাযোগ করতে পারেন।
        </p>
        <p className="text-xs text-slate-500">
          WhatsApp: {settings.whatsappNumber} • Telegram: {settings.telegramUsername}
        </p>
      </div>
    </div>
  );
};
