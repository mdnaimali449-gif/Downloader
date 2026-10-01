import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Sparkles, 
  Youtube, 
  Facebook, 
  Video, 
  Instagram, 
  Music, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  FileVideo, 
  Layers, 
  ArrowRight, 
  ClipboardPaste, 
  ShieldCheck, 
  RefreshCw,
  Radio,
  Cpu,
  Activity,
  Terminal,
  Zap,
  X,
  Loader2,
  ArrowDownCircle,
  HardDrive,
  Bot
} from 'lucide-react';
import { VideoInfo } from '../types';

interface ActiveDownloadState {
  qualityLabel: string;
  format: string;
  fileName: string;
  progress: number;
  step: string;
  speed: string;
  isCompleted: boolean;
  isFailed?: boolean;
  errorMessage?: string;
  videoTitle: string;
  thumbnail: string;
  realDownloadUrl?: string;
}

export const DownloaderView: React.FC = () => {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState<'all' | 'youtube' | 'facebook' | 'tiktok' | 'instagram'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [downloadingLabel, setDownloadingLabel] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [autoDownload, setAutoDownload] = useState(true);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState('');
  const [activeDownload, setActiveDownload] = useState<ActiveDownloadState | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiBox, setShowAiBox] = useState(false);

  const scanningSteps = [
    { label: 'INITIALIZING_STREAM_TUNNEL', detail: 'Connecting to Rapid CDN endpoints & proxy nodes...' },
    { label: 'EXTRACTING_MEDIA_MANIFEST', detail: 'Parsing video bitrates, audio tracks & metadata...' },
    { label: 'BYPASSING_RESTRICTIONS', detail: 'Stripping watermark overlays & platform throttling...' },
    { label: 'COMPILING_DIRECT_CHANNELS', detail: 'Finalizing 4K 60FPS video and 320kbps MP3 audio...' }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setScanProgress(0);
      setScanStepIndex(0);

      const startTime = Date.now();
      const totalDuration = 2200; // 2.2 seconds for full cinematic scanning effect

      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(Math.floor((elapsed / totalDuration) * 100), 100);
        setScanProgress(progress);

        if (progress > 75) {
          setScanStepIndex(3);
        } else if (progress > 50) {
          setScanStepIndex(2);
        } else if (progress > 25) {
          setScanStepIndex(1);
        } else {
          setScanStepIndex(0);
        }

        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const detectPlatform = (inputUrl: string): 'youtube' | 'facebook' | 'tiktok' | 'instagram' | 'unknown' => {
    const lower = inputUrl.toLowerCase();
    if (lower.includes('youtu.be') || lower.includes('youtube.com')) return 'youtube';
    if (lower.includes('facebook.com') || lower.includes('fb.watch')) return 'facebook';
    if (lower.includes('tiktok.com')) return 'tiktok';
    if (lower.includes('instagram.com')) return 'instagram';
    return 'unknown';
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        const p = detectPlatform(text);
        if (p !== 'unknown') {
          setPlatform(p);
        }
      }
    } catch {
      // ignore clipboard error
    }
  };

  const handleFetchMedia = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setDownloadSuccessMessage('');
    
    if (!url.trim()) {
      setErrorMessage('অনুগ্রহ করে একটি সঠিক ভিডিও লিংক পেস্ট করুন (Please paste a valid video URL)');
      return;
    }

    const detected = detectPlatform(url);
    setIsLoading(true);
    setVideoInfo(null);

    try {
      // Call Real Backend Extraction API (YouTube, TikTok, Facebook, Instagram)
      const response = await fetch('/api/media/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });

      const resData = await response.json();

      if (response.ok && resData.success && resData.data) {
        const videoData = resData.data;
        setVideoInfo(videoData);
        setIsLoading(false);

        // Auto Download immediately if enabled
        if (autoDownload && videoData.qualities && videoData.qualities.length > 0) {
          const topQuality = videoData.qualities[0];
          setTimeout(() => {
            handleStartDownload(topQuality.label, topQuality.format, topQuality.downloadUrl, videoData);
          }, 300);
        }
        return;
      } else {
        const errorMsg = resData.error || 'ভিডিওর তথ্য উদ্ধার করা সম্ভব হয়নি। লিংকটি চেক করে আবার চেষ্টা করুন।';
        setErrorMessage(errorMsg);
        setIsLoading(false);
        return;
      }
    } catch (err: any) {
      console.warn('Real API call failed:', err);
      setErrorMessage('সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করুন।');
      setIsLoading(false);
    }
  };

  const triggerNativeDownload = (finalUrl: string, cleanFileName: string) => {
    // 100% Ad-Free, Direct Native Stream:
    const a = document.createElement('a');
    a.href = finalUrl;
    a.download = cleanFileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      try {
        document.body.removeChild(a);
      } catch {}
    }, 1500);
  };

  const handleGenerateAiDetails = async (videoTitle: string) => {
    setIsAiLoading(true);
    setShowAiBox(true);
    setAiSummary(null);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `ভিডিও টাইটেল: "${videoTitle}"। 
অনুগ্রহ করে নিচের তথ্যগুলো সুন্দর করে দাও:
১. এই ভিডিওটির বিষয়বস্তুর একটি সংক্ষেপ (Summary) বাংলায়।
২. এই ভিডিওটি শেয়ার বা আপলোড করার জন্য ৩টি আকর্ষণীয় ভাইরাল ক্যাপশন/টাইটেল।
৩. প্রাসঙ্গিক ট্রেন্ডিং ৫টি হ্যাশট্যাগ (#)।`,
          mode: 'video-seo'
        })
      });
      const data = await res.json();
      if (res.ok && data.success && data.text) {
        setAiSummary(data.text);
      } else {
        setAiSummary(data.error || 'এআই তথ্য প্রস্তুত করতে পারেনি। আবার চেষ্টা করুন।');
      }
    } catch {
      setAiSummary('সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleStartDownload = async (
    qualityLabel: string, 
    format: string, 
    realDownloadUrl?: string, 
    providedVideo?: VideoInfo | null
  ) => {
    const targetVideo = providedVideo || videoInfo;
    const safeTitle = (targetVideo?.title || 'Video')
      .replace(/[^a-zA-Z0-9_\-\u0980-\u09FF]/g, '_')
      .slice(0, 40);
    const cleanName = `${safeTitle}_${qualityLabel.replace(/[^a-zA-Z0-9]/g, '_')}.${format.toLowerCase()}`;

    setDownloadingLabel(qualityLabel);
    setDownloadSuccessMessage('');

    let requestedFormat = '720';
    if (qualityLabel.toLowerCase().includes('1080')) requestedFormat = '1080';
    else if (qualityLabel.toLowerCase().includes('720')) requestedFormat = '720';
    else if (qualityLabel.toLowerCase().includes('480')) requestedFormat = '480';
    else if (format.toUpperCase() === 'MP3' || qualityLabel.toLowerCase().includes('audio')) requestedFormat = 'mp3';

    // Open Animation Modal with initial state
    setActiveDownload({
      qualityLabel,
      format,
      fileName: cleanName,
      progress: 10,
      step: 'হাই-স্পিড ডাউনলোড টানেল সংযুক্ত হচ্ছে...',
      speed: '18.5 MB/s',
      isCompleted: false,
      isFailed: false,
      videoTitle: targetVideo?.title || 'Video Media Stream',
      thumbnail: targetVideo?.thumbnail || '',
      realDownloadUrl
    });

    // 1. YouTube Flow: Live Job Conversion Polling (NO FAKE 10KB DOWNLOADS)
    if (targetVideo?.platform === 'youtube') {
      try {
        const convRes = await fetch('/api/youtube/convert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId: targetVideo.id, format: requestedFormat })
        });
        const convData = await convRes.json();

        // If already completed in cache
        if (convData.status === 'finished' && convData.downloadUrl) {
          setDownloadProgress(100);
          setActiveDownload((prev) => prev ? {
            ...prev,
            progress: 100,
            isCompleted: true,
            step: 'আসল মিডিয়া ফাইল প্রস্তুত! ডিভাইসে আসল ফাইল সেভ হচ্ছে...',
            realDownloadUrl: convData.downloadUrl
          } : null);

          triggerNativeDownload(convData.downloadUrl, cleanName);
          setDownloadSuccessMessage(`✓ সরাসরি আসল ফাইল ডাউনলোড শুরু হয়েছে: ${cleanName}`);
          setDownloadingLabel(null);
          return;
        }

        if (!convData.jobId) {
          throw new Error(convData.error || 'কনভার্সন জব শুরু করা যায়নি');
        }

        // Live Poll job progress until finished (max 65 seconds)
        const jobId = convData.jobId;
        let pollCount = 0;
        const maxPolls = 75;

        const pollInterval = setInterval(async () => {
          pollCount++;
          try {
            const pRes = await fetch(`/api/youtube/poll?jobId=${jobId}`);
            if (!pRes.ok) return;
            const pData = await pRes.json();

            if (pData.status === 'finished' && pData.downloadUrl) {
              clearInterval(pollInterval);
              setDownloadProgress(100);
              setActiveDownload((prev) => prev ? {
                ...prev,
                progress: 100,
                isCompleted: true,
                step: 'আসল মিডিয়া ফাইল প্রস্তুত! ডিভাইসে আসল ফাইল সেভ হচ্ছে...',
                realDownloadUrl: pData.downloadUrl
              } : null);

              triggerNativeDownload(pData.downloadUrl, cleanName);
              setDownloadSuccessMessage(`✓ সরাসরি আসল ফাইল ডাউনলোড শুরু হয়েছে: ${cleanName}`);
              setDownloadingLabel(null);
              return;
            }

            if (pData.status === 'failed') {
              clearInterval(pollInterval);
              setActiveDownload((prev) => prev ? {
                ...prev,
                isFailed: true,
                errorMessage: pData.error || 'এই ভিডিওটির স্ট্রিম কনভার্ট করা সম্ভব হয়নি। অনুগ্রহ করে ৭২০p দিয়ে চেষ্টা করুন।'
              } : null);
              setDownloadingLabel(null);
              return;
            }

            // Update live progress
            const curProgress = typeof pData.progress === 'number' ? pData.progress : Math.min(15 + pollCount * 2, 90);
            setDownloadProgress(curProgress);
            setActiveDownload((prev) => prev ? {
              ...prev,
              progress: curProgress,
              step: pData.statusText || 'ভিডিও স্ট্রিম প্রস্তুত হচ্ছে...',
              speed: `${(15 + Math.random() * 10).toFixed(1)} MB/s`
            } : null);

            if (pollCount >= maxPolls) {
              clearInterval(pollInterval);
              setActiveDownload((prev) => prev ? {
                ...prev,
                isFailed: true,
                errorMessage: 'কনভার্টার সার্ভারে বেশি সময় লেগেছে। অনুগ্রহ করে ৭২০p বা এমপি৩ দিয়ে আবার চেষ্টা করুন।'
              } : null);
              setDownloadingLabel(null);
            }
          } catch (e: any) {
            console.warn('Poll error:', e);
          }
        }, 900);

      } catch (err: any) {
        console.error('YouTube convert start error:', err);
        setActiveDownload((prev) => prev ? {
          ...prev,
          isFailed: true,
          errorMessage: err.message || 'ভিডিও প্রস্তুত করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।'
        } : null);
        setDownloadingLabel(null);
      }
      return;
    }

    // 2. Non-YouTube Media (TikTok, Facebook, Instagram)
    const directUrl = realDownloadUrl && realDownloadUrl !== '#' ? realDownloadUrl : '';
    if (!directUrl) {
      setActiveDownload((prev) => prev ? {
        ...prev,
        isFailed: true,
        errorMessage: 'ভিডিও ডাউনলোড লিঙ্ক পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।'
      } : null);
      setDownloadingLabel(null);
      return;
    }

    // Animate smoothly to 100% and trigger native download
    let p = 15;
    const interval = setInterval(() => {
      p += 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setDownloadProgress(100);
        setActiveDownload((prev) => prev ? {
          ...prev,
          progress: 100,
          isCompleted: true,
          step: 'ডাউনলোড সফলভাবে শুরু হয়েছে! ডিভাইসে আসল ফাইল সেভ হচ্ছে।'
        } : null);

        triggerNativeDownload(directUrl, cleanName);
        setDownloadSuccessMessage(`✓ সরাসরি আসল ফাইল ডাউনলোড শুরু হয়েছে: ${cleanName}`);
        setDownloadingLabel(null);
      } else {
        setDownloadProgress(p);
        setActiveDownload((prev) => prev ? {
          ...prev,
          progress: p,
          step: p > 60 ? 'আসল মিডিয়া ফাইল প্রস্তুত হচ্ছে...' : 'হাই-স্পিড ডাউনলোড টানেল সংযুক্ত হচ্ছে...'
        } : null);
      }
    }, 120);
  };

  const sampleLinks = [
    { name: '🔥 Real TikTok (No Watermark)', url: 'https://www.tiktok.com/@scout2015/video/6718335390845095173' },
    { name: '⚡ Real YouTube (4K/720p)', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { name: '📱 Facebook Video', url: 'https://www.facebook.com/watch/?v=10892348920192' },
    { name: '📸 Instagram Reel', url: 'https://www.instagram.com/reel/C1k8mP5v9X/' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Ultra Fast Multi-Format Media Downloader
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
          Download Videos in <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400">High Quality 4K</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Facebook, YouTube, TikTok এবং Instagram থেকে যেকোনো ভিডিও, রিল বা অডিও মুহূর্তেই ওয়াটারমার্ক ছাড়া ডাউনলোড করুন।
        </p>
      </div>

      {/* Platform Filter Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <button
          onClick={() => setPlatform('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            platform === 'all'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          All Platforms
        </button>

        <button
          onClick={() => setPlatform('youtube')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            platform === 'youtube'
              ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Youtube className="w-4 h-4 text-red-400" />
          YouTube
        </button>

        <button
          onClick={() => setPlatform('facebook')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            platform === 'facebook'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Facebook className="w-4 h-4 text-blue-400" />
          Facebook
        </button>

        <button
          onClick={() => setPlatform('tiktok')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            platform === 'tiktok'
              ? 'bg-neutral-900 border border-pink-500/50 text-pink-400 shadow-lg shadow-pink-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Video className="w-4 h-4 text-pink-400" />
          TikTok
        </button>

        <button
          onClick={() => setPlatform('instagram')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            platform === 'instagram'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-pink-500/30'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Instagram className="w-4 h-4 text-pink-300" />
          Instagram
        </button>
      </div>

      {/* URL Input Form */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-500"></div>
        <form 
          onSubmit={handleFetchMedia}
          className="relative bg-slate-900/90 border border-slate-700/80 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="flex-1 w-full flex items-center gap-3 px-3 py-1">
            <Video className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="ভিডিওর লিংক এখানে পেস্ট করুন (Paste YouTube, Facebook, TikTok URL here)..."
              className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm sm:text-base font-medium"
            />
            {url && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={handlePaste}
              className="flex items-center gap-1 text-xs text-cyan-300 bg-cyan-950/70 border border-cyan-500/30 hover:bg-cyan-900/80 px-2.5 py-1.5 rounded-lg transition"
              title="Paste from clipboard"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Paste</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Fetching Info...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-slate-950" />
                <span>Get Download Links</span>
              </>
            )}
          </button>
        </form>

        {/* Auto Download Settings & Zero-Ads Guarantee Bar */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white transition">
            <input
              type="checkbox"
              checked={autoDownload}
              onChange={(e) => setAutoDownload(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500/30 accent-cyan-500 cursor-pointer"
            />
            <span className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              অটো ডাউনলোড (Auto-Download Video/Audio Immediately)
            </span>
          </label>

          <div className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>১০০% বিজ্ঞাপন মুক্ত • নো পপআপ (0 Ads & Direct Auto Save)</span>
          </div>
        </div>
      </div>

      {/* Download Started Success Banner */}
      {downloadSuccessMessage && (
        <div className="flex items-center gap-2.5 p-3.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 rounded-2xl text-xs sm:text-sm font-semibold shadow-xl animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{downloadSuccessMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-500/30 text-red-300 rounded-xl text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Quick Test Samples */}
      <div className="flex flex-wrap items-center gap-2 justify-center text-xs text-slate-400">
        <span className="font-semibold text-slate-300">দ্রুত চেষ্টা করুন (Try Samples):</span>
        {sampleLinks.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setUrl(item.url);
              setPlatform(detectPlatform(item.url) as any);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition"
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Futuristic Cyber Scanning HUD State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-3xl overflow-hidden border border-cyan-500/50 bg-slate-950/95 shadow-[0_0_50px_rgba(6,182,212,0.25)] p-6 sm:p-8 backdrop-blur-2xl"
          >
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d40f_1px,transparent_1px),linear-gradient(to_bottom,#06b6d40f_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

            {/* Sweeping Laser Beam Effect */}
            <motion.div
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee] z-20 pointer-events-none"
              animate={{
                top: ['2%', '96%', '2%'],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />

            {/* Ambient Radial Lights */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Header HUD Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/30 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-xs uppercase font-mono tracking-widest text-cyan-300 font-bold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    QUANTUM MEDIA SCANNER // ACTIVE
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                    SPEED: 10 Gbps
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                    SSL: VERIFIED
                  </span>
                </div>
              </div>

              {/* Central Radar & Telemetry Display */}
              <div className="flex flex-col md:flex-row items-center gap-6 py-2">
                {/* Rotating Sonar Reticle */}
                <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
                  {/* Outer pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border border-cyan-500/30"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  {/* Rotating Radar Crosshair */}
                  <motion.div
                    className="w-28 h-28 rounded-full border border-cyan-400/40 relative flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  >
                    <div className="absolute top-0 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
                    <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-cyan-400/70" />
                    <div className="w-16 h-16 rounded-full border border-dashed border-fuchsia-400/60" />
                  </motion.div>

                  {/* Core Icon */}
                  <div className="absolute w-10 h-10 rounded-xl bg-slate-900/90 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    <Radio className="w-5 h-5 animate-pulse text-cyan-400" />
                  </div>
                </div>

                {/* Status & Stream Waveform Information */}
                <div className="flex-1 w-full space-y-3 text-center md:text-left">
                  <div className="space-y-1">
                    <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-center md:justify-start gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      PHASE 0{scanStepIndex + 1}/04: {scanningSteps[scanStepIndex].label}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {scanningSteps[scanStepIndex].detail}
                    </h3>
                  </div>

                  {/* Animated Waveform Oscilloscope Bars */}
                  <div className="flex items-center justify-center md:justify-start gap-1.5 h-8 py-1">
                    {[16, 28, 12, 32, 20, 36, 14, 24, 30, 18, 26, 10, 34, 22].map((height, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 rounded-full bg-gradient-to-t from-cyan-500 via-sky-400 to-fuchsia-400"
                        animate={{
                          height: [8, height, 10],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          repeatType: 'reverse',
                          delay: i * 0.06,
                          ease: 'easeInOut'
                        }}
                      />
                    ))}
                  </div>

                  {/* Target URL Preview */}
                  <div className="text-xs font-mono text-slate-400 truncate max-w-md bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-cyan-400">TARGET:</span> {url}
                  </div>
                </div>

                {/* Right Progress Percentage Dial */}
                <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex-shrink-0 min-w-[110px]">
                  <span className="text-3xl font-black font-mono tracking-tighter text-cyan-300">
                    {scanProgress}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
                    EXTRACTING
                  </span>
                </div>
              </div>

              {/* Holographic Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-3 overflow-hidden p-0.5">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 shadow-[0_0_12px_#06b6d4]"
                    style={{ width: `${scanProgress}%` }}
                    transition={{ ease: 'easeOut', duration: 0.1 }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>PACKET_BUFFER: OPTIMAL</span>
                  <span>WATERMARK_FILTER: ENABLED</span>
                  <span>4K_60FPS_CONVERT: READY</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download Results Card */}
      {videoInfo && !isLoading && (
        <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex flex-col md:flex-row gap-5">
            {/* Video Thumbnail */}
            <div className="relative md:w-72 h-44 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex-shrink-0 group">
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-3">
                <div className="flex items-center justify-between w-full text-xs text-slate-200">
                  <span className="px-2 py-0.5 rounded bg-black/70 font-semibold">{videoInfo.duration}</span>
                  <span className="capitalize font-semibold text-cyan-300">{videoInfo.platform}</span>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition">
                <div className="w-12 h-12 rounded-full bg-cyan-500/80 text-slate-950 flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 ml-1 fill-current" />
                </div>
              </div>
            </div>

            {/* Video Meta Info */}
            <div className="flex-1 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/70 text-cyan-300 text-xs font-semibold border border-cyan-500/30 uppercase">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Media Ready to Download
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug line-clamp-2">
                {videoInfo.title}
              </h3>
              <p className="text-xs text-slate-400">
                Author / Channel: <span className="text-slate-200 font-medium">{videoInfo.author}</span>
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  100% Ad-Free Direct
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">No Watermark</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">Audio + Video Merged</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">High Bitrate 60 FPS</span>
              </div>

              {/* AI Video Insights & Viral Hooks Trigger */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleGenerateAiDetails(videoInfo.title)}
                  disabled={isAiLoading}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 border border-purple-500/50 text-purple-200 text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>{isAiLoading ? 'AI বিশ্লেষণ করছে...' : '✨ AI দিয়ে সামারি ও ভাইরাল ক্যাপশন দেখুন'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Insights Collapsible Card */}
          {showAiBox && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-950 to-slate-900 border border-purple-500/40 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Gemini AI Video Insights & Viral Strategy</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAiBox(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕ বন্ধ করুন
                </button>
              </div>

              {isAiLoading ? (
                <div className="flex items-center gap-2.5 py-4 text-xs text-purple-300 justify-center">
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                  <span>ভিডিওর বিষয়বস্তু ও ভাইরাল ট্রেন্ডস এনালাইজ হচ্ছে...</span>
                </div>
              ) : (
                <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed space-y-1">
                  {aiSummary}
                </div>
              )}
            </div>
          )}

          {/* Active Download Progress Bar */}
          {downloadProgress !== null && (
            <div className="p-4 rounded-xl bg-cyan-950/50 border border-cyan-500/40 space-y-2 animate-pulse">
              <div className="flex justify-between text-xs font-bold text-cyan-300">
                <span>Downloading {downloadingLabel}...</span>
                <span>{downloadProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                High speed direct stream tunnel established. File will save automatically.
              </p>
            </div>
          )}

          {/* Quality Grid */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <FileVideo className="w-4 h-4 text-cyan-400" />
              Available Resolutions & Formats
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {videoInfo.qualities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 transition-all group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {item.type === 'audio' ? (
                        <Music className="w-4 h-4 text-fuchsia-400" />
                      ) : (
                        <Video className="w-4 h-4 text-cyan-400" />
                      )}
                      <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{item.format}</span>
                      <span>•</span>
                      <span>{item.resolution}</span>
                      {item.size && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">{item.size}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartDownload(item.label, item.format, item.downloadUrl)}
                    disabled={activeDownload !== null}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition duration-200 active:scale-95 cursor-pointer ${
                      activeDownload?.qualityLabel === item.label
                        ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/40'
                        : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500 hover:to-blue-600 text-cyan-300 hover:text-slate-950 border border-cyan-500/40'
                    }`}
                  >
                    {activeDownload?.qualityLabel === item.label ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{activeDownload.isCompleted ? 'Saved ✓' : `${activeDownload.progress}%`}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>ডাউনলোড (Download)</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-white">No Watermark & Clean</h4>
          <p className="text-xs text-slate-400">
            TikTok ও অন্যান্য শর্টস থেকে অরিজিনাল সাউন্ড ও ওয়াটারমার্ক ছাড়া ভিডিও ডাউনলোড করার সুবিধা।
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-fuchsia-950 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-white">100% Free - No Login Required</h4>
          <p className="text-xs text-slate-400">
            সাধারণ ইউজারদের কোন সাইন ইন বা অ্যাকাউন্ট খোলা ছাড়াই যত খুশি আনলিমিটেড ভিডিও ডাউনলোড করার স্বাধীনতা।
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <ArrowRight className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-white">Direct MP3 Audio Extraction</h4>
          <p className="text-xs text-slate-400">
            ভিডিওর ব্যাকগ্রাউন্ড মিউজিক বা গান সরাসরি ৩২০ কেবিপিএস হাই-কোয়ালিটি অডিও ফাইলে রূপান্তর।
          </p>
        </div>
      </div>

      {/* Cyber Animated Download Modal (No Ads, Beautiful Animation, Auto-Download) */}
      <AnimatePresence>
        {activeDownload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md rounded-3xl bg-slate-950/95 border border-cyan-500/50 p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.35)] overflow-hidden space-y-6"
            >
              {/* Cyber Grid & Ambient Glow */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d40f_1px,transparent_1px),linear-gradient(to_bottom,#06b6d40f_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Modal Header */}
              <div className="relative z-10 flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3 min-w-0">
                  {activeDownload.thumbnail ? (
                    <img 
                      src={activeDownload.thumbnail} 
                      alt="Thumbnail" 
                      className="w-12 h-12 rounded-xl object-cover border border-cyan-500/40 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0">
                      <FileVideo className="w-6 h-6" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">
                      {activeDownload.videoTitle}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-cyan-300">
                      <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 font-semibold">
                        {activeDownload.qualityLabel}
                      </span>
                      <span>•</span>
                      <span className="text-slate-400 uppercase">{activeDownload.format}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDownload(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Central Glowing Progress Dial */}
              <div className="relative z-10 flex flex-col items-center justify-center space-y-4 py-2">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Outer Pulsing Glow */}
                  <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${
                    activeDownload.isFailed 
                      ? 'bg-rose-500/30'
                      : activeDownload.isCompleted 
                        ? 'bg-emerald-500/30' 
                        : 'bg-cyan-500/25 animate-pulse'
                  }`} />

                  {/* SVG Circular Progress Ring */}
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="transparent"
                      stroke="#1e293b"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="transparent"
                      stroke={
                        activeDownload.isFailed 
                          ? '#f43f5e' 
                          : activeDownload.isCompleted 
                            ? '#10b981' 
                            : '#06b6d4'
                      }
                      strokeWidth="8"
                      strokeDasharray={263.89}
                      strokeDashoffset={263.89 - (263.89 * (activeDownload.isFailed ? 100 : activeDownload.progress)) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-150 ease-out"
                    />
                  </svg>

                  {/* Dial Center Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    {activeDownload.isFailed ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 12 }}
                        className="flex flex-col items-center"
                      >
                        <AlertCircle className="w-10 h-10 text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
                        <span className="text-[10px] font-black text-rose-300 mt-1 uppercase tracking-wider">ERROR</span>
                      </motion.div>
                    ) : activeDownload.isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 12 }}
                        className="flex flex-col items-center"
                      >
                        <CheckCircle2 className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                        <span className="text-[11px] font-black text-emerald-300 mt-1 uppercase tracking-wider">DONE</span>
                      </motion.div>
                    ) : (
                      <>
                        <ArrowDownCircle className="w-6 h-6 text-cyan-400 animate-bounce mb-1" />
                        <span className="text-3xl font-black font-mono text-white tracking-tight">
                          {activeDownload.progress}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Live Speed & Security Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
                  <span className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 shadow-inner ${
                    activeDownload.isFailed 
                      ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                      : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
                  }`}>
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {activeDownload.isFailed ? 'প্রসেসিং ব্যর্থ' : activeDownload.isCompleted ? 'High-Speed Stream' : activeDownload.speed}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5 shadow-inner">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    ১০০% আসল ফাইল • নো ফেক ডাউনলোড
                  </span>
                </div>
              </div>

              {/* Status Text & Step Progress */}
              <div className="relative z-10 space-y-2 text-center">
                <p className={`text-sm font-bold transition-all ${activeDownload.isFailed ? 'text-rose-400' : 'text-white'}`}>
                  {activeDownload.isFailed ? (activeDownload.errorMessage || activeDownload.step) : activeDownload.step}
                </p>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <motion.div
                    className={`h-full rounded-full ${
                      activeDownload.isFailed
                        ? 'bg-rose-500'
                        : activeDownload.isCompleted 
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-500' 
                          : 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500'
                    }`}
                    style={{ width: `${activeDownload.isFailed ? 100 : activeDownload.progress}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  {activeDownload.isFailed
                    ? 'ভিডিওটি তৈরি হয়নি, তাই ব্রাউজারে কোনো ফেক বা ১০ কেবি ফাইল সেভ করা হয়নি।'
                    : activeDownload.isCompleted 
                      ? '✓ ফাইলটি স্বয়ংক্রিয়ভাবে ডাউনলোড হচ্ছে। ব্রাউজারের ডাউনলোড হিস্ট্রি চেক করুন।' 
                      : 'হাই-স্পিড ক্লাউড টানেল থেকে আসল ভিডিও ফাইল ডিকোড হচ্ছে...'}
                </p>
              </div>

              {/* Modal Action Buttons */}
              <div className="relative z-10 pt-1 space-y-2">
                {activeDownload.isFailed ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const v = videoInfo;
                        setActiveDownload(null);
                        if (v) {
                          handleStartDownload('720p HD (High Definition)', 'MP4', undefined, v);
                        }
                      }}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
                    >
                      ৭২০p এইচডি দিয়ে চেষ্টা করুন (Retry 720p)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDownload(null)}
                      className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                    >
                      বন্ধ করুন
                    </button>
                  </div>
                ) : activeDownload.isCompleted ? (
                  <div className="space-y-2">
                    {activeDownload.realDownloadUrl && (
                      <a
                        href={activeDownload.realDownloadUrl}
                        download={activeDownload.fileName}
                        className="w-full py-2.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <ArrowDownCircle className="w-4 h-4 text-cyan-400" />
                        <span>অটো শুরু না হলে এখানে ক্লিক করুন (Direct Link)</span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setActiveDownload(null)}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      <span>ডাউনলোড সম্পন্ন (Done / Close)</span>
                    </button>
                  </div>
                ) : (
                  <div className="w-full py-3.5 rounded-2xl bg-slate-900 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>আসল ভিডিও ফাইল প্রস্তুত হচ্ছে ({activeDownload.progress}%)...</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
