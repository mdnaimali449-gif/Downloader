import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { 
  Heart, 
  Send, 
  Copy, 
  Check, 
  Share2, 
  Eye, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  PenTool, 
  Download, 
  ArrowLeft,
  Loader2,
  FileText,
  RotateCcw,
  Image as ImageIcon
} from 'lucide-react';

interface LoveLetterViewProps {
  onNavigateHome?: () => void;
  onNavigateProjects?: () => void;
}

export const LoveLetterView: React.FC<LoveLetterViewProps> = ({ 
  onNavigateHome,
  onNavigateProjects 
}) => {
  // Start completely blank as requested by user
  const [toName, setToName] = useState('');
  const [fromName, setFromName] = useState('');
  const [letterContent, setLetterContent] = useState('');

  // UI state
  const [isCopied, setIsCopied] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [selectedAiTone, setSelectedAiTone] = useState<'romantic' | 'proposal' | 'apology' | 'miss_you'>('romantic');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const letterCardRef = useRef<HTMLDivElement | null>(null);

  // Initialize from URL parameters if someone opens the link directly in any browser
  useEffect(() => {
    const parseUrlParams = () => {
      // Check query params in window.location.search or window.location.hash (e.g. #love?to=...&from=...&msg=...)
      let t: string | null = null;
      let f: string | null = null;
      let p: string | null = null;

      const searchParams = new URLSearchParams(window.location.search);
      t = searchParams.get('to');
      f = searchParams.get('from');
      p = searchParams.get('msg');

      if ((!t && !p) && window.location.hash.includes('?')) {
        const hashQuery = window.location.hash.split('?')[1];
        const hashParams = new URLSearchParams(hashQuery);
        t = hashParams.get('to');
        f = hashParams.get('from');
        p = hashParams.get('msg');
      }

      if (t || f || p) {
        if (t) setToName(t);
        if (f) setFromName(f);
        if (p) setLetterContent(p);
        setIsReadingMode(true);
      }
    };

    parseUrlParams();
    window.addEventListener('hashchange', parseUrlParams);
    return () => window.removeEventListener('hashchange', parseUrlParams);
  }, []);

  // Romantic ambient music toggle
  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://assets.mixkit.co/music/preview/mixkit-loving-you-116.mp3');
      audioRef.current.loop = true;
    }

    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch(err => console.log('Audio autoplay prevented:', err));
    }
  };

  // Generate clean shareable link pointing to #love
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  
  const params = new URLSearchParams();
  if (toName.trim()) params.set('to', toName.trim());
  if (fromName.trim()) params.set('from', fromName.trim());
  if (letterContent.trim()) params.set('msg', letterContent.trim());
  
  const queryString = params.toString();
  const generatedLetterUrl = `${currentOrigin}${currentPath}#love${queryString ? `?${queryString}` : ''}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLetterUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const recipient = toName.trim() ? toName.trim() : 'প্রিয়জন';
    const text = `💌 প্রিয় ${recipient}—তোমার জন্য একটি সুন্দর প্রেমপত্র এসেছে!\n\nচিঠিটি পড়তে লিংকে ক্লিক করো:\n${generatedLetterUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // AI-powered love letter writer
  const handleAiWriteLetter = async (tone: 'romantic' | 'proposal' | 'apology' | 'miss_you' = selectedAiTone) => {
    setIsGeneratingAi(true);
    try {
      const recipient = toName.trim() || 'প্রিয়তমা';
      const sender = fromName.trim() || 'তোমার ভালোবাসার মানুষ';

      let promptDetail = 'গভীর ভালোবাসা ও হৃদয়ের আবেগ প্রকাশ করে একটি মন ছুঁয়ে যাওয়ার মতো মিষ্টি রোমান্টিক চিঠি';
      if (tone === 'proposal') {
        promptDetail = 'চিরদিনের জন্য জীবনের সঙ্গী হওয়ার প্রস্তাব (Marriage/Love Proposal) জানিয়ে একটি গভীর আবেগী চিঠি';
      } else if (tone === 'apology') {
        promptDetail = 'প্রিয় মানুষের রাগ ভাঙানোর জন্য আন্তরিক অনুশোচনা, ক্ষমা প্রার্থনা (Sorry/Apology) ও ভালোবাসার চিঠি';
      } else if (tone === 'miss_you') {
        promptDetail = 'প্রিয় মানুষকে ভীষণ মিস করার অনুভূতি, দূরত্বের কষ্ট ও স্মৃতির ব্যাকুলতা নিয়ে চিঠি';
      }

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `প্রাপক (To): "${recipient}" এবং প্রেরক (From): "${sender}"।
বিষয়: ${promptDetail}।
দয়া করে একটি মন ছুঁয়ে যাওয়ার মতো খাঁটি বাংলা রোমান্টিক প্রেমপত্র লিখুন। কোনো প্রারম্ভিক সম্ভাষণ বা সমাপ্তি 'ইতি' লিখবেন না (কারণ এগুলো সিস্টেমে স্বয়ংক্রিয়ভাবে যুক্ত আছে), শুধুমাত্র চিঠির মূল কথাগুলো চমৎকার প্যারাগ্রাফ আকারে লিখুন যাতে পড়লেই হৃদয়ে দোলা দেয়।`,
          mode: 'romantic'
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.text) {
        setLetterContent(data.text.trim());
      }
    } catch (err) {
      console.error('AI letter writing error:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Canvas 2D fallback generator: renders royal parchment love letter natively
  const generateCanvasLetterImage = (
    recipient: string,
    sender: string,
    bodyText: string
  ): string => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1600;
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';

      // 1. Parchment background
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 1600);
      bgGrad.addColorStop(0, '#fffbf5');
      bgGrad.addColorStop(0.5, '#fff7ed');
      bgGrad.addColorStop(1, '#fef2f2');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 1600);

      // 2. Borders
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 6;
      ctx.strokeRect(40, 40, 1120, 1520);

      ctx.strokeStyle = '#fda4af';
      ctx.lineWidth = 2;
      ctx.strokeRect(55, 55, 1090, 1490);

      // Decorative corner emojis
      ctx.font = '36px serif';
      ctx.fillText('💖', 70, 100);
      ctx.fillText('💖', 1080, 100);
      ctx.fillText('💖', 70, 1500);
      ctx.fillText('💖', 1080, 1500);

      // Top title
      ctx.textAlign = 'center';
      ctx.fillStyle = '#e11d48';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('✨ A LETTER OF ETERNAL LOVE ✨', 600, 120);

      // Divider line
      ctx.beginPath();
      ctx.moveTo(150, 145);
      ctx.lineTo(1050, 145);
      ctx.strokeStyle = '#fecdd3';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Date
      ctx.textAlign = 'right';
      ctx.fillStyle = '#78716c';
      ctx.font = '18px sans-serif';
      ctx.fillText(new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }), 1050, 185);

      // Salutation (To)
      ctx.textAlign = 'left';
      ctx.fillStyle = '#be123c';
      ctx.font = 'bold 40px sans-serif';
      const toLabel = `💌 প্রিয় ${recipient.trim() || 'প্রিয়তমা'}—`;
      ctx.fillText(toLabel, 120, 260);

      // Underline
      ctx.beginPath();
      ctx.moveTo(120, 275);
      ctx.lineTo(120 + ctx.measureText(toLabel).width, 275);
      ctx.strokeStyle = '#fb7185';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Body text wrapped
      ctx.fillStyle = '#292524';
      ctx.font = '28px sans-serif';
      const maxLineWidth = 960;
      const lineHeight = 46;
      let yPos = 350;

      const rawText = bodyText.trim() || 'আমার পৃথিবীর সবচেয়ে প্রিয় মানুষটি তুমি। তোমার সাথে কাটানো প্রতিটি মুহূর্ত আমার জীবনের সেরা উপহার। জীবনের প্রতিটি পদক্ষেপে তোমার হাতটি শক্ত করে ধরে ভালোবাসার পথ চলতে চাই।';
      const paragraphs = rawText.split('\n');

      for (const para of paragraphs) {
        if (!para.trim()) {
          yPos += lineHeight * 0.8;
          continue;
        }
        const words = para.split(' ');
        let currentLine = '';

        for (let i = 0; i < words.length; i++) {
          const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxLineWidth && i > 0) {
            ctx.fillText(currentLine, 120, yPos);
            currentLine = words[i];
            yPos += lineHeight;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) {
          ctx.fillText(currentLine, 120, yPos);
          yPos += lineHeight * 1.3;
        }
      }

      // Sign-off (From)
      yPos = Math.max(yPos + 40, 1300);
      ctx.beginPath();
      ctx.setLineDash([8, 8]);
      ctx.moveTo(120, yPos - 30);
      ctx.lineTo(1080, yPos - 30);
      ctx.strokeStyle = '#fecdd3';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#be123c';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText('ইতি,', 1050, yPos + 15);

      ctx.fillStyle = '#1c1917';
      ctx.font = 'bold 38px sans-serif';
      ctx.fillText(sender.trim() || 'তোমার ভালোবাসার মানুষ', 1050, yPos + 70);

      ctx.fillStyle = '#e11d48';
      ctx.font = '24px sans-serif';
      ctx.fillText('চিরদিনের মতো তোমার ❤️', 1050, yPos + 115);

      // Watermark
      ctx.textAlign = 'center';
      ctx.fillStyle = '#a8a29e';
      ctx.font = '16px sans-serif';
      ctx.fillText('NAIM CREATIVE SUITE • ETERNAL LOVE LETTER', 600, 1540);

      return canvas.toDataURL('image/png');
    } catch {
      return '';
    }
  };

  // Download letter card as Picture/Image
  const handleDownloadPicture = async () => {
    setIsDownloadingImage(true);

    try {
      let imageBlob: string = '';

      // Primary: Use html-to-image (supports modern CSS, SVG, web fonts & retina pixelRatio)
      if (letterCardRef.current) {
        try {
          imageBlob = await toPng(letterCardRef.current, {
            cacheBust: true,
            pixelRatio: 2,
            backgroundColor: '#fffdfa'
          });
        } catch (domErr: any) {
          console.warn('html-to-image notice, using canvas drawer:', domErr?.message);
        }
      }

      // Secondary fallback: Native Canvas 2D engine
      if (!imageBlob) {
        imageBlob = generateCanvasLetterImage(toName, fromName, letterContent);
      }

      if (imageBlob) {
        const safeName = (toName.trim() || 'love').replace(/[^a-zA-Z0-9_\-\u0980-\u09FF]/g, '_');
        const filename = `love_letter_${safeName}.png`;

        const downloadLink = document.createElement('a');
        downloadLink.href = imageBlob;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to capture letter image:', err);
    } finally {
      setIsDownloadingImage(false);
    }
  };

  const handleClearAll = () => {
    if (confirm('সব লেখা মুছে নতুন করে শুরু করতে চান?')) {
      setToName('');
      setFromName('');
      setLetterContent('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn min-h-[85vh]">
      {/* Background Floating Hearts */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-500/20"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 80, 
              scale: 0.5 + Math.random() * 0.8,
              opacity: 0.2 + Math.random() * 0.5 
            }}
            animate={{ 
              y: -100,
              x: `+=${(Math.random() - 0.5) * 150}`,
              rotate: Math.random() * 360
            }}
            transition={{ 
              duration: 12 + Math.random() * 8, 
              repeat: Infinity, 
              delay: i * 1.5,
              ease: 'linear'
            }}
          >
            <Heart className="w-8 h-8 fill-current" />
          </motion.div>
        ))}
      </div>

      {/* Floating Audio Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={toggleMusic}
          className={`flex items-center gap-2 px-4 py-3 rounded-full text-xs font-bold shadow-2xl transition duration-300 border ${
            isMusicPlaying 
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400 shadow-pink-500/40 animate-pulse' 
              : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-700 hover:border-pink-500'
          }`}
        >
          {isMusicPlaying ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          <span>{isMusicPlaying ? 'রোমান্টিক সুর বাজছে 🎶' : 'মিউজিক চালু করুন 🎵'}</span>
        </button>
      </div>

      {/* Top Navigation & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোমে ফিরুন</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          {isReadingMode ? (
            <button
              onClick={() => setIsReadingMode(false)}
              className="flex items-center gap-1.5 text-xs font-bold text-pink-300 bg-pink-950/80 border border-pink-500/40 px-3.5 py-2 rounded-xl hover:bg-pink-900 transition"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>চিঠি সম্পাদনা করুন (Edit Letter)</span>
            </button>
          ) : (
            <button
              onClick={() => setIsReadingMode(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-3.5 py-2 rounded-xl hover:bg-cyan-900 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>ফুলভিউ মোড (Full Letter View)</span>
            </button>
          )}

          {onNavigateProjects && (
            <button
              onClick={onNavigateProjects}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl hover:border-pink-500/40 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>অন্যান্য লাভ প্রজেক্ট</span>
            </button>
          )}
        </div>
      </div>

      {/* Blank Custom Love Letter Generator Form (Edit Mode) */}
      {!isReadingMode && (
        <div className="relative group z-10">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 rounded-3xl blur-xl opacity-35 group-hover:opacity-55 transition duration-500"></div>
          <div className="relative bg-slate-900/95 border border-pink-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
            
            <div className="text-center space-y-2 border-b border-slate-800 pb-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-950/80 border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-pulse" />
                <span>Custom Romantic Love Letter Creator • #love</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                ডিজিটাল <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300">প্রেমপত্র জেনারেটর</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                কাকে পাঠাবেন ও আপনার নাম লিখুন। নিজের মনের কথা নিজে লিখুন অথবা AI দিয়ে ১-ক্লিকে রোমান্টিক চিঠি তৈরি করুন। চিঠিটি যেকোনো ব্রাউজারে লিংক দিয়ে শেয়ার করা যাবে এবং ছবি হিসেবেও ডাউনলোড করা যাবে।
              </p>
            </div>

            {/* Form Fields: To & From */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* TO Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center justify-between">
                  <span>১. প্রাপক / প্রিয়তমার নাম (To Name)</span>
                  <span className="text-[11px] text-slate-500 font-normal">যাকে চিঠি পাঠাবেন</span>
                </label>
                <input
                  type="text"
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  placeholder="যেমন: প্রিয়া, জান্নাত, সায়মা..."
                  className="w-full bg-slate-950/90 border border-slate-700 focus:border-pink-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition font-medium text-sm"
                />
              </div>

              {/* FROM Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center justify-between">
                  <span>২. আপনার নাম / প্রেরক (From Name)</span>
                  <span className="text-[11px] text-slate-500 font-normal">কার পক্ষ থেকে</span>
                </label>
                <input
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  placeholder="যেমন: তোমার পাগল প্রেমিক, নাঈম..."
                  className="w-full bg-slate-950/90 border border-slate-700 focus:border-pink-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition font-medium text-sm"
                />
              </div>
            </div>

            {/* Letter Content Field + AI Instant Generator */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-pink-400" />
                  <span>৩. চিঠির বক্তব্য (Letter Message)</span>
                </label>

                {/* AI Instant Writing Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 hidden sm:inline">AI দিয়ে লিখুন:</span>
                  <button
                    type="button"
                    onClick={() => { setSelectedAiTone('romantic'); handleAiWriteLetter('romantic'); }}
                    disabled={isGeneratingAi}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-pink-950/80 hover:bg-pink-900 border border-pink-500/40 text-pink-300 font-bold transition flex items-center gap-1 disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3 text-pink-400" />
                    <span>গভীর প্রেম ❤️</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSelectedAiTone('proposal'); handleAiWriteLetter('proposal'); }}
                    disabled={isGeneratingAi}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 font-bold transition flex items-center gap-1 disabled:opacity-50"
                  >
                    <span>প্রস্তাব 💍</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSelectedAiTone('apology'); handleAiWriteLetter('apology'); }}
                    disabled={isGeneratingAi}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 font-bold transition flex items-center gap-1 disabled:opacity-50"
                  >
                    <span>মানভঞ্জন/সরি 🥺</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSelectedAiTone('miss_you'); handleAiWriteLetter('miss_you'); }}
                    disabled={isGeneratingAi}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-sky-950/80 hover:bg-sky-900 border border-sky-500/40 text-sky-300 font-bold transition flex items-center gap-1 disabled:opacity-50"
                  >
                    <span>মিস করা 🌙</span>
                  </button>
                </div>
              </div>

              {isGeneratingAi && (
                <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 text-xs flex items-center gap-2 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  <span>Gemini AI আপনার জন্য মিষ্টি ও কাব্যিক প্রেমপত্র রচনা করছে...</span>
                </div>
              )}

              <div className="relative">
                <textarea
                  value={letterContent}
                  onChange={(e) => setLetterContent(e.target.value)}
                  rows={5}
                  placeholder="এখানে আপনার মনের অনুভূতিগুলো লিখুন, অথবা উপরের AI বাটনে ক্লিক করে স্বয়ংক্রিয় রোমান্টিক চিঠি তৈরি করুন..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-pink-500 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition leading-relaxed"
                />
                {letterContent && (
                  <button
                    type="button"
                    onClick={() => setLetterContent('')}
                    className="absolute right-3 bottom-3 text-slate-500 hover:text-slate-300 text-xs"
                    title="টেক্সট ক্লিয়ার করুন"
                  >
                    মুছে ফেলুন
                  </button>
                )}
              </div>
            </div>

            {/* Generated Shareable Link Display */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs uppercase font-extrabold tracking-wider text-emerald-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>তৈরি হওয়া কাস্টম প্রেমপত্র লিংক (#love):</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal">যেকোনো ব্রাউজারে চলবে</span>
              </label>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40 font-mono text-xs text-emerald-300 break-all select-all flex items-center justify-between gap-3 shadow-inner">
                <span>{generatedLetterUrl}</span>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className={`flex-1 sm:flex-none px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer ${
                  isCopied
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                    : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white shadow-pink-500/30'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>কপি হয়েছে! (Copied)</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>প্রেমপত্রের লিংক কপি করুন</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadPicture}
                disabled={isDownloadingImage}
                className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isDownloadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>ছবি তৈরি হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 text-slate-950" />
                    <span>ছবি হিসেবে ডাউনলোড (Picture)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="px-4 py-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md"
                title="WhatsApp এ পাঠান"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp Share</span>
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                className="px-3.5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition"
                title="রিসেট করুন"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {downloadSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>চিঠির ছবিটি সফলভাবে আপনার ডিভাইসে ডাউনলোড সম্পন্ন হয়েছে!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Letter Interactive Envelope & Presentation */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Interactive Sealed Envelope for Recipients */}
        {!envelopeOpened && isReadingMode && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg mx-auto text-center space-y-4 py-6"
          >
            <div 
              onClick={() => setEnvelopeOpened(true)}
              className="cursor-pointer group relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-pink-900/60 via-slate-900 to-rose-950/80 border-2 border-pink-400/60 shadow-[0_0_50px_rgba(244,63,94,0.35)] hover:scale-105 transition-all duration-500"
            >
              <div className="w-20 h-20 rounded-full bg-pink-500/20 border-2 border-pink-400/80 flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition">
                <Heart className="w-10 h-10 text-pink-400 fill-pink-500 animate-pulse" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                💌 {toName ? `প্রিয় ${toName}` : 'প্রিয়জন'}—তোমার জন্য একটি বিশেষ চিঠি এসেছে!
              </h2>
              <p className="text-xs sm:text-sm text-pink-200/80 mt-2">
                চিঠিটি খুলতে এবং মনের না-বলা অনুভূতি পড়তে এখানে স্পর্শ করুন...
              </p>
              <div className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black text-xs shadow-lg shadow-pink-500/40">
                <span>খামটি খুলুন (Open Envelope)</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>
        )}

        {/* The Vintage Parchment Royal Letter (Captured as Image) */}
        {(envelopeOpened || !isReadingMode) && (
          <div className="w-full space-y-4">
            {/* The Actual Captured Letter Card */}
            <div
              ref={letterCardRef}
              className="w-full relative rounded-3xl overflow-hidden shadow-[0_0_70px_rgba(244,63,94,0.25)] border-2 border-pink-500/40 bg-[#fffdfa] text-stone-800 p-6 sm:p-10 md:p-14 space-y-7 font-serif"
            >
              {/* Top Letter Header */}
              <div className="flex items-center justify-between border-b-2 border-pink-200 pb-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-rose-600 font-sans font-bold">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <span>A Letter of Eternal Love</span>
                </div>
                <div className="text-xs font-sans text-stone-500">
                  {new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>

              {/* Salutation / TO */}
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-rose-600 tracking-tight flex items-center gap-2 flex-wrap">
                  <span>💌 প্রিয়</span>
                  <span className="underline decoration-pink-500 underline-offset-4 font-extrabold text-pink-700">
                    {toName.trim() || '[প্রাপকের নাম]'}
                  </span>
                  <span>—</span>
                </h2>
              </div>

              {/* Dynamic Letter Body (Only what user/AI wrote) */}
              <div className="text-base sm:text-lg leading-relaxed text-stone-700 whitespace-pre-wrap min-h-[120px]">
                {letterContent.trim() ? (
                  letterContent
                ) : (
                  <p className="italic text-stone-400 font-sans text-sm">
                    [এখানে আপনার মনের অনুভূতির কথাগুলো প্রদর্শিত হবে। ওপরের বক্সে নিজের কথা লিখুন অথবা AI বাটনে চাপ দিয়ে একটি চমৎকার প্রেমপত্র লিখে নিন...]
                  </p>
                )}
              </div>

              {/* Sign-off section / FROM */}
              <div className="pt-6 border-t-2 border-dashed border-pink-200 flex flex-col items-end text-right space-y-1">
                <div className="font-bold text-rose-600 text-base sm:text-lg">
                  ইতি,
                </div>
                <div className="text-lg sm:text-xl font-black text-stone-800">
                  {fromName.trim() || '[আপনার নাম]'}
                </div>
                <div className="text-xs text-pink-600 flex items-center gap-1 font-sans font-semibold">
                  <span>চিরদিনের মতো তোমার</span>
                  <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
                </div>
              </div>

              {/* Bottom Tag */}
              <div className="pt-4 flex flex-wrap items-center justify-between text-xs font-sans text-stone-500 border-t border-stone-200">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-stone-600">To:</span>
                  <span className="text-pink-600 font-semibold">{toName.trim() || 'প্রিয়জন'}</span>
                  <span>💖</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-stone-600">From:</span>
                  <span className="text-rose-600 font-semibold">{fromName.trim() || 'ভালোবাসার মানুষ'}</span>
                  <span>🌹</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Under Letter: Download Picture, Copy Link & Create Your Own */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPicture}
                  disabled={isDownloadingImage}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-pink-500/20 transition active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isDownloadingImage ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>ছবি সেভ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>চিঠিটি ছবি হিসেবে ডাউনলোড করুন (Save as Pic)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
                </button>
              </div>

              {isReadingMode && (
                <button
                  type="button"
                  onClick={() => {
                    setIsReadingMode(false);
                    setEnvelopeOpened(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>আপনিও একটি চিঠি তৈরি করুন (Create Letter)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Shareable Footer Info */}
      <div className="relative z-10 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-3 backdrop-blur-xl">
        <h4 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
          <Heart className="w-4 h-4 text-pink-400 fill-current" />
          <span>এই প্রেমপত্রটি যেকোনো সোশ্যাল মিডিয়া বা ব্রাউজারে কাজ করে</span>
        </h4>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-pink-500/20 transition cursor-pointer"
          >
            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? 'লিংক কপি হয়েছে!' : 'প্রেমপত্রের লিংক কপি করুন'}</span>
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>হোয়াটসঅ্যাপে পাঠান</span>
          </button>
        </div>
      </div>
    </div>
  );
};
