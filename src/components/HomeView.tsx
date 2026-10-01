import React from 'react';
import { 
  Download, 
  Sparkles, 
  Heart, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Youtube, 
  Facebook, 
  Video, 
  Instagram,
  User,
  ExternalLink,
  Bot
} from 'lucide-react';
import { ViewType, DeveloperSettings } from '../types';

interface HomeViewProps {
  onNavigate: (view: ViewType) => void;
  settings: DeveloperSettings;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, settings }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-14 animate-fadeIn">
      {/* Announcement Banner */}
      {settings.announcementText && (
        <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-200 text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-inner">
          <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0 animate-bounce" />
          <span>{settings.announcementText}</span>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative text-center space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          The Ultimate Next-Gen Media & Creative Hub
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-tight">
          Superfast <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400">Video Downloader</span> & Creator Suite
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          কোনো লগইন ছাড়াই আনলিমিটেড Facebook, YouTube, TikTok এবং Instagram ভিডিও ও রিল ডাউনলোড করুন সম্পূর্ণ ফ্রিতে। সাথে তৈরি করুন কাস্টম রোমান্টিক লাভ লিংক।
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('downloader')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-base shadow-xl shadow-cyan-500/30 flex items-center gap-2.5 transition active:scale-95 cursor-pointer"
          >
            <Download className="w-5 h-5 text-slate-950" />
            <span>ভিডিও ডাউনলোড করুন (Downloader)</span>
          </button>

          <button
            onClick={() => onNavigate('ai-tools')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-black text-base shadow-xl shadow-purple-500/30 flex items-center gap-2.5 transition active:scale-95 cursor-pointer"
          >
            <Bot className="w-5 h-5" />
            <span>NAIM AI ব্যবহার করুন (AI Tools)</span>
          </button>

          <button
            onClick={() => onNavigate('generator')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-black text-base shadow-xl shadow-pink-500/30 flex items-center gap-2.5 transition active:scale-95 cursor-pointer"
          >
            <Heart className="w-5 h-5 fill-current" />
            <span>লাভ লিংক তৈরি করুন (Love Projects)</span>
          </button>
        </div>
      </div>

      {/* Supported Platforms Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
        <h3 className="text-center text-xs uppercase font-extrabold tracking-widest text-slate-400">
          Supported Social Networks (সব প্ল্যাটফর্ম সাপোর্টেড)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigate('downloader')}
            className="cursor-pointer p-4 rounded-2xl bg-slate-950/60 border border-red-500/20 hover:border-red-500/60 flex items-center gap-3 transition group"
          >
            <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-500/30 text-red-400 group-hover:scale-110 transition">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">YouTube</div>
              <div className="text-[11px] text-slate-400">Shorts & 4K Video</div>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('downloader')}
            className="cursor-pointer p-4 rounded-2xl bg-slate-950/60 border border-blue-500/20 hover:border-blue-500/60 flex items-center gap-3 transition group"
          >
            <div className="p-2.5 rounded-xl bg-blue-950/50 border border-blue-500/30 text-blue-400 group-hover:scale-110 transition">
              <Facebook className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Facebook</div>
              <div className="text-[11px] text-slate-400">Reels & Watch Video</div>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('downloader')}
            className="cursor-pointer p-4 rounded-2xl bg-slate-950/60 border border-pink-500/20 hover:border-pink-500/60 flex items-center gap-3 transition group"
          >
            <div className="p-2.5 rounded-xl bg-pink-950/50 border border-pink-500/30 text-pink-400 group-hover:scale-110 transition">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">TikTok</div>
              <div className="text-[11px] text-slate-400">No Watermark HD</div>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('downloader')}
            className="cursor-pointer p-4 rounded-2xl bg-slate-950/60 border border-purple-500/20 hover:border-purple-500/60 flex items-center gap-3 transition group"
          >
            <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-500/30 text-purple-300 group-hover:scale-110 transition">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Instagram</div>
              <div className="text-[11px] text-slate-400">Reels & Post Videos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Three Pillars Section: Downloader, Love Projects & NAIM AI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1: Downloader Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">Media Downloader</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              উন্নত এপিআই ও এক্সট্র্যাক্টরের মাধ্যমে সেকেন্ডের মধ্যে ফুল এইচডি ও ৪কে রেজোলিউশনে ভিডিও ডাউনলোড করুন। ওয়ান-ক্লিক MP3 কনভার্ট সুবিধা।
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">✓ কোনো ওয়াটারমার্ক ছাড়া টিকটক ভিডিও</li>
              <li className="flex items-center gap-2">✓ ১০৮০পি, ৭২০পি ও ৩২০kbps অডিও ফরম্যাট</li>
              <li className="flex items-center gap-2">✓ কোনো রেজিস্ট্রেশন বা অ্যাকাউন্ট ছাড়াই ফ্রি</li>
            </ul>
          </div>

          <button
            onClick={() => onNavigate('downloader')}
            className="w-full mt-4 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/40 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>ডাউনলোডার খুলুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pillar 2: NAIM AI Assistant Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-purple-950/50 via-slate-900 to-slate-950 border border-purple-500/40 shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-inner">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">NAIM AI Assistant</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Google Gemini 3.8 Flash দ্বারা চালিত এআই। রোমান্টিক চিঠি লেখা, ভিডিও ভাইরাল টাইটেল ও হ্যাশট্যাগ তৈরি এবং যেকোনো প্রশ্নের তাৎক্ষণিক উত্তর।
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">✓ লাভ লেটার ও রোমান্টিক ডায়ালগ রাইটার</li>
              <li className="flex items-center gap-2">✓ ভাইরাল ভিডিও হুক, এসইও ও ট্যাগস</li>
              <li className="flex items-center gap-2">✓ বাংলা ও ইংরেজি উভয় ভাষায় ফ্লুয়েন্ট চ্যাট</li>
            </ul>
          </div>

          <button
            onClick={() => onNavigate('ai-tools')}
            className="w-full mt-4 py-3 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white border border-purple-500/40 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>এআই টুলস ব্যবহার করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pillar 3: Love Projects Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-pink-950/40 via-slate-900 to-slate-950 border border-pink-500/30 shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/40 flex items-center justify-center text-pink-400 shadow-inner">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">Romantic Love Projects</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              প্রিয় মানুষকে ইমপ্রেস করার জন্য ৪টি স্পেশাল রোমান্টিক ও সরি পেজ। "To" ও "From" বক্সে নাম লিখে সরাসরি লিংক জেনারেট করুন ও প্রিভিউ দেখুন।
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">💖 Romantic Proposal Website</li>
              <li className="flex items-center gap-2">✨ I Love You Heart Effect Site</li>
              <li className="flex items-center gap-2">🥺 Sorry Priyo Apology Webpage</li>
            </ul>
          </div>

          <button
            onClick={() => onNavigate('generator')}
            className="w-full mt-4 py-3 rounded-xl bg-pink-500/20 hover:bg-pink-500 text-pink-300 hover:text-white border border-pink-500/40 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>লাভ লিংক জেনারেটর খুলুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Special Feature Spotlight: Romantic Love Letter Web Page */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 rounded-3xl blur-xl opacity-35 group-hover:opacity-60 transition duration-500"></div>
        <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-950/70 via-slate-900 to-rose-950/70 border border-pink-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950 border border-pink-500/40 text-pink-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>নতুন স্পেশাল ফিচার • New Emotional Web Letter</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              💌 আমার এক টুকরো পৃথিবী, আমার প্রিয়তমা...
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              প্রিয় মানুষের নাম লিখে তৈরি করুন চিরন্তন আবেগঘন ডিজিটাল প্রেমপত্র। ব্যাকগ্রাউন্ড রোমান্টিক মিউজিক, ইন্টারেক্টিভ খাম এবং আপনার নিজস্ব নামসহ যেকোনো ব্রাউজারে পড়ার উপযোগী লিংক।
            </p>
          </div>

          <button
            onClick={() => onNavigate('letter')}
            className="flex-shrink-0 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-black text-sm shadow-xl shadow-pink-500/40 flex items-center gap-2.5 transition active:scale-95 cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>চিঠি লিখুন ও লিংক বানান</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Developer Teaser Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src="https://files.catbox.moe/01g3b7.jpg"
            alt="Naim"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-bold text-white">Developed by Nahidul Islam Naim</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                Official
              </span>
            </div>
            <p className="text-xs text-slate-400">
              WhatsApp: {settings.whatsappNumber} • Telegram: {settings.telegramUsername}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('developer')}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 border border-slate-700 transition"
        >
          <User className="w-4 h-4 text-cyan-400" />
          <span>View Developer Profile</span>
        </button>
      </div>
    </div>
  );
};
