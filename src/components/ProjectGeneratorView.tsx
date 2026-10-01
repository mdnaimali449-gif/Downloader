import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  Eye, 
  X, 
  Send,
  HelpCircle,
  MessageCircleHeart,
  Bot,
  RefreshCw
} from 'lucide-react';
import { LOVE_PROJECTS } from '../utils/config';
import { LoveProject } from '../types';

export const ProjectGeneratorView: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<LoveProject>(LOVE_PROJECTS[0]);
  const [toName, setToName] = useState('');
  const [fromName, setFromName] = useState('');
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [aiLoveNote, setAiLoveNote] = useState<string | null>(null);
  const [isGeneratingAiNote, setIsGeneratingAiNote] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);

  const handleGenerateAiLoveNote = async () => {
    setIsGeneratingAiNote(true);
    setAiLoveNote(null);
    try {
      const recipient = toName.trim() || 'প্রিয় মানুষ';
      const sender = fromName.trim() || 'তোমার ভালোবাসার জন';
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `যাকে পাঠানো হবে তার নাম: "${recipient}", প্রেরকের নাম: "${sender}"। 
ক্যাটাগরি: "${selectedProject.category}" (${selectedProject.banglaTitle})।
দয়া করে ৩-৪ লাইনের একটি অত্যন্ত মিষ্টি, রোমান্টিক এবং হৃদয়স্পর্শী প্রেমের মেসেজ বা চিঠি লিখে দাও যাতে এটি এই ওয়েবসাইটের লিংকের সাথে হোয়াটসঅ্যাপ বা মেসেঞ্জারে পাঠিয়ে দেওয়া যায়। কিউট ইমোজি ব্যবহার করো।`,
          mode: 'romantic'
        })
      });
      const data = await res.json();
      if (res.ok && data.success && data.text) {
        setAiLoveNote(data.text);
      } else {
        setAiLoveNote(data.error || 'এআই রোমান্টিক বার্তা তৈরি করতে পারেনি।');
      }
    } catch {
      setAiLoveNote('সার্ভারের সাথে সংযোগ করা যায়নি।');
    } finally {
      setIsGeneratingAiNote(false);
    }
  };

  const handleCopyNote = () => {
    if (!aiLoveNote) return;
    navigator.clipboard.writeText(aiLoveNote);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  // Generate URL with proper query parameters
  const generateFullUrl = (baseUrl: string, to: string, from: string): string => {
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanBaseNoQuery = cleanBase.split('?')[0];
    const encodedTo = encodeURIComponent(to.trim());
    const encodedFrom = encodeURIComponent(from.trim());
    return `${cleanBaseNoQuery}/?to=${encodedTo}&from=${encodedFrom}`;
  };

  const currentGeneratedUrl = generateFullUrl(selectedProject.baseUrl, toName, fromName);

  const handleCopy = () => {
    if (!currentGeneratedUrl) return;
    navigator.clipboard.writeText(currentGeneratedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenPreview = () => {
    setPreviewUrl(currentGeneratedUrl);
  };

  const handleWhatsAppShare = () => {
    const text = `আমার ভালোবাসার অনুভূতি দেখো প্রিয়: ${currentGeneratedUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Title & Instructions Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-950/80 border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider shadow-inner">
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-pulse" />
          Special Romantic Web Pages Generator
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Love & Proposal <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300">Link Creator</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          আপনার ও আপনার প্রিয় মানুষের নাম লিখে এক ক্লিকে চমৎকার রোমান্টিক সারপ্রাইজ লিংক তৈরি করুন।
        </p>

        {/* Clear Bengali Instructions Box */}
        <div className="max-w-2xl mx-auto mt-4 p-4 rounded-2xl bg-gradient-to-r from-pink-950/50 via-purple-950/40 to-slate-900 border border-pink-500/30 text-left shadow-lg">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-200 space-y-1">
              <p className="font-bold text-pink-300">নির্দেশিকা (Instructions in Bengali):</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li><span className="font-semibold text-white">To Box:</span> যাকে পাঠাবেন তার নাম লিখবেন (<code className="text-pink-300 font-mono">?to=জাকে পাঠাবে তার নাম</code>)।</li>
                <li><span className="font-semibold text-white">From Box:</span> যে পাঠাবে অর্থাৎ আপনার নাম লিখবেন (<code className="text-pink-300 font-mono">&from=যে পাঠাবে তার নাম</code>)।</li>
                <li>নাম লিখলেই স্বয়ংক্রিয়ভাবে ফুল লিংক তৈরি হবে। এরপর <span className="text-cyan-300 font-semibold">"View"</span> বাটনে ক্লিক করে দেখে নিতে পারেন এবং <span className="text-emerald-300 font-semibold">"Copy Link"</span> বাটনে ক্লিক করে কপি করে প্রিয়জনকে পাঠান!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {LOVE_PROJECTS.map((proj) => {
          const isSelected = selectedProject.id === proj.id;
          return (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 relative border ${
                isSelected
                  ? 'bg-gradient-to-b from-pink-950/80 to-slate-900 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)] scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-pink-500/40 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  {proj.previewBadge}
                </span>
                <Heart className={`w-4 h-4 ${isSelected ? 'fill-pink-500 text-pink-500' : 'text-slate-500'}`} />
              </div>
              <h3 className="font-bold text-white text-base leading-tight mb-1">
                {proj.banglaTitle}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                {proj.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Generator Studio Form */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
        <div className="relative bg-slate-900/95 border border-pink-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-pink-400">Selected Website Template:</span>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <MessageCircleHeart className="w-6 h-6 text-pink-400" />
                {selectedProject.banglaTitle} ({selectedProject.title})
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 break-all">
              {selectedProject.baseUrl}
            </span>
          </div>

          {/* 2 Input Boxes: TO and FROM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TO Box */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-200 flex items-center justify-between">
                <span>১. যাকে পাঠাবেন তার নাম (To Name)</span>
                <span className="text-xs text-pink-400 font-mono font-normal">?to=...</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  placeholder="যেমন: Jannat, Priyo, Mim..."
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-pink-500 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-medium text-sm sm:text-base"
                />
              </div>
              <p className="text-xs text-slate-400">
                এই নামটি সারপ্রাইজ ওয়েবসাইটের প্রধান অ্যানিমেশনে শো করবে।
              </p>
            </div>

            {/* FROM Box */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-200 flex items-center justify-between">
                <span>২. যে পাঠাবে / আপনার নাম (From Name)</span>
                <span className="text-xs text-pink-400 font-mono font-normal">&from=...</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  placeholder="যেমন: Naim, Rahul, Shuvo..."
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-pink-500 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-medium text-sm sm:text-base"
                />
              </div>
              <p className="text-xs text-slate-400">
                ওয়েবসাইটে "From Your Name" হিসেবে সুন্দরভাবে উপস্থাপিত হবে।
              </p>
            </div>
          </div>

          {/* Live Generated Full Link Display */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs uppercase font-extrabold tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Automatic Full Generated Link (স্বয়ংক্রিয় তৈরি হওয়া লিংক)
            </label>
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-emerald-500/40 font-mono text-xs sm:text-sm text-emerald-300 break-all flex items-center justify-between gap-3 shadow-inner">
              <span className="overflow-x-auto select-all">{currentGeneratedUrl}</span>
            </div>
          </div>

          {/* AI Romantic Note Generator Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-pink-950/30 to-slate-950 border border-purple-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-pink-300">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>NAIM AI Romantic Message Writer</span>
              </div>
              <button
                type="button"
                onClick={handleGenerateAiLoveNote}
                disabled={isGeneratingAiNote}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20 transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingAiNote ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>রোমান্টিক চিঠি তৈরি হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>✨ AI দিয়ে রোমান্টিক বার্তা লিখুন</span>
                  </>
                )}
              </button>
            </div>

            {aiLoveNote && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-pink-500/40 space-y-2 animate-fadeIn">
                <p className="text-xs sm:text-sm text-pink-100 whitespace-pre-wrap leading-relaxed font-sans">
                  {aiLoveNote}
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                  <span className="text-[11px] text-slate-400">এই বার্তাটি কপি করে লিংকের সাথে হোয়াটসঅ্যাপে পাঠান</span>
                  <button
                    type="button"
                    onClick={handleCopyNote}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-pink-950 border border-pink-500/40 text-pink-300 hover:text-white"
                  >
                    {copiedNote ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNote ? 'কপি হয়েছে!' : 'বার্তাটি কপি করুন'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: View, Copy, Share */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* View Option */}
            <button
              onClick={handleOpenPreview}
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-slate-950" />
              <span>View Website (কেমন হয়েছে দেখুন)</span>
            </button>

            {/* Copy Option */}
            <button
              onClick={handleCopy}
              className={`flex-1 sm:flex-none px-6 py-3.5 rounded-xl font-black text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white shadow-pink-500/30'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Copied Successfully! (কপি হয়েছে)</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link (লিংক কপি করুন)</span>
                </>
              )}
            </button>

            {/* Direct WhatsApp Share */}
            <button
              onClick={handleWhatsAppShare}
              className="px-4 py-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 font-bold text-sm flex items-center justify-center gap-2 transition"
              title="Share directly via WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            {/* Open in New Tab Option */}
            <a
              href={currentGeneratedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Open in new browser tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* In-App Live Website Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="relative w-full max-w-5xl h-[85vh] bg-slate-900 border border-pink-500/40 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                <span className="text-xs sm:text-sm font-bold text-slate-200 ml-2 font-mono truncate max-w-xs sm:max-w-md">
                  {previewUrl}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Fullscreen</span>
                </a>
                <button
                  onClick={() => setPreviewUrl(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Iframe View */}
            <div className="flex-1 bg-white relative">
              <iframe
                src={previewUrl}
                title="Romantic Project Preview"
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
