import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Heart, 
  Video, 
  Hash, 
  FileText, 
  Copy, 
  Check, 
  RefreshCw, 
  Lightbulb, 
  Zap, 
  MessageSquare,
  HelpCircle,
  TrendingUp,
  Flame,
  ArrowRight
} from 'lucide-react';

interface AiToolsViewProps {
  onNavigateToLove?: () => void;
  onNavigateToDownloader?: () => void;
  onNavigateToLetter?: () => void;
}

export const AiToolsView: React.FC<AiToolsViewProps> = ({ 
  onNavigateToLove, 
  onNavigateToDownloader,
  onNavigateToLetter
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'romantic' | 'viral-seo' | 'summarizer'>('chat');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Chat message history
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; time: string }[]>([
    {
      role: 'assistant',
      text: 'আসসালামু আলাইকুম! আমি NAIM AI—আপনার পার্সোনাল ভিডিও ও ক্রিয়েটিভ অ্যাসিস্ট্যান্ট।\n\nআপনি কী করতে চান?\n• যেকোনো ভিডিও ডাউনলোড সংক্রান্ত সাহায্য?\n• রোমান্টিক লাভ প্রজেক্টের জন্য সুন্দর বার্তা ও চিঠি লেখা?\n• YouTube/TikTok/Reels-এর জন্য ভাইরাল টাইটেল ও ট্রেন্ডিং হ্যাশট্যাগ তৈরি?\n• যেকোনো ভিডিও বিষয়ের সামারি বা কনটেন্ট আইডিয়া?\n\nনিচে লিখুন অথবা বাটন থেকে যেকোনো মোড বেছে নিন!',
      time: 'Just now'
    }
  ]);

  // Quick prompt presets for tabs
  const presets = {
    chat: [
      'TikTok ওয়াটারমার্ক ছাড়া কিভাবে ডাউনলোড করব?',
      'YouTube ভিডিও MP3 অডিওতে কনভার্ট করার নিয়ম কী?',
      'আমার ভিডিওর জন্য ভাইরাল হুক কীভাবে বানাব?'
    ],
    romantic: [
      'প্রেমিকার জন্য খুব আবেগঘন ও মিষ্টি একটি প্রেমের চিঠি বাংলায় লিখে দাও।',
      'প্রপোজ করার জন্য একটি স্পেশাল ও রোমান্টিক ডায়ালগ বাংলায় তৈরি করে দাও।',
      'প্রিয় মানুষের রাগ ভাঙানোর জন্য একটি সুন্দর সরি মেসেজ লিখে দাও।'
    ],
    'viral-seo': [
      'একটি ট্রাভেল ও ভ্লগ ভিডিওর জন্য ৫টি ভাইরাল YouTube টাইটেল এবং ট্রেন্ডিং হ্যাশট্যাগ দাও।',
      'TikTok-এ রাতারাতি ভাইরাল হওয়ার মতো ৩টি ক্যাচি হুক ও ক্যাপশন দাও।',
      'একটি রোমান্টিক শর্টসের জন্য ট্রেন্ডিং ট্যাগ ও ডেসক্রিপশন দাও।'
    ],
    summarizer: [
      '৫ মিনিটের মধ্যে একটি সফল ভিডিও এডিটিং করার ৫টি নিয়ম পয়েন্ট আকারে বলো।',
      'ডিজিটাল মার্কেটিং ও কনটেন্ট ক্রিয়েশনের মূল টিপসগুলো সংক্ষেপে ব্যাখ্যা করো।',
      'ইউটিউব অ্যালগরিদম কীভাবে কাজ করে তা সহজ ভাষায় বুঝিয়ে দাও।'
    ]
  };

  const handleSendMessage = async (textToSend?: string, customMode?: string) => {
    const messageContent = (textToSend || prompt).trim();
    if (!messageContent || isLoading) return;

    const userMsg = {
      role: 'user' as const,
      text: messageContent,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    setIsLoading(true);

    const targetMode = customMode || (
      activeTab === 'romantic' ? 'romantic' :
      activeTab === 'viral-seo' ? 'video-seo' :
      activeTab === 'summarizer' ? 'summarize' : 'general'
    );

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: messageContent,
          mode: targetMode
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.text) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: data.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: data.error || 'দুঃখিত, কোনো সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করুন।',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-950/80 to-purple-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>Powered by Google Gemini 3.8 Flash AI</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          NAIM <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400">Smart AI Assistant</span>
        </h1>
        
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          ডাউনলোডার গাইড, রোমান্টিক বার্তা জেনারেটর ও সোশ্যাল মিডিয়া ভাইরাল টাইটেল বানানোর জন্য আপনার অল-ইন-ওয়ান এআই অ্যাসিস্ট্যান্ট।
        </p>
      </div>

      {/* Feature Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition shadow-sm ${
            activeTab === 'chat'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-cyan-500/30 font-black'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Chat Assistant</span>
        </button>

        <button
          onClick={() => setActiveTab('romantic')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition shadow-sm ${
            activeTab === 'romantic'
              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-pink-500/30 font-black'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Heart className="w-4 h-4 fill-current" />
          <span>রোমান্টিক রাইটার (Love Writer)</span>
        </button>

        <button
          onClick={() => setActiveTab('viral-seo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition shadow-sm ${
            activeTab === 'viral-seo'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-amber-500/30 font-black'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>ভাইরাল টাইটেল ও ট্যাগ (Viral SEO)</span>
        </button>

        <button
          onClick={() => setActiveTab('summarizer')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition shadow-sm ${
            activeTab === 'summarizer'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-purple-500/30 font-black'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>ভিডিও সামারি ও স্ক্রিপ্ট</span>
        </button>
      </div>

      {/* Quick Preset Buttons for Selected Mode */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 sm:p-4 backdrop-blur-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>প্রস্তাবিত প্রশ্ন ও কমান্ড (Quick Suggested Prompts):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets[activeTab].map((presetText, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(presetText)}
              className="text-xs text-left px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-700/80 hover:border-cyan-500 text-slate-300 hover:text-white transition duration-200"
            >
              ⚡ {presetText}
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversation Box */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 rounded-3xl blur-xl opacity-25 group-hover:opacity-45 transition duration-500"></div>
        <div className="relative bg-slate-900/90 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl flex flex-col h-[520px]">
          
          {/* Chat Window Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              const msgId = `msg-${index}`;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 flex-shrink-0 shadow-md">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-2 relative group/bubble ${
                    isUser
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
                  }`}>
                    {/* Message Header */}
                    <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400">
                      <span className="font-bold text-cyan-300">
                        {isUser ? 'আপনি (You)' : 'NAIM AI'}
                      </span>
                      <span>{msg.time}</span>
                    </div>

                    {/* Message Body */}
                    <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-sans">
                      {msg.text}
                    </div>

                    {/* Copy Button for Assistant responses */}
                    {!isUser && (
                      <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs">
                        <button
                          onClick={() => handleCopyText(msg.text, msgId)}
                          className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition text-[11px] font-semibold"
                        >
                          {copiedId === msgId ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">কপি হয়েছে!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>কপি করুন (Copy)</span>
                            </>
                          )}
                        </button>

                        {/* Direct action links if relevant */}
                        {activeTab === 'romantic' && onNavigateToLove && (
                          <button
                            onClick={onNavigateToLove}
                            className="flex items-center gap-1 text-pink-400 hover:text-pink-300 font-semibold text-[11px]"
                          >
                            <span>লাভ প্রজেক্ট পেজে যান</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0">
                      <span className="text-xs font-bold">You</span>
                    </div>
                  )}
                </motion.div>
              );
            })}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 items-center text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 p-3 rounded-2xl w-fit"
              >
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>NAIM AI ভাবছে এবং উত্তর তৈরি করছে...</span>
              </motion.div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={
                activeTab === 'romantic' ? 'রোমান্টিক চিঠি বা প্রস্তাবের জন্য বিবরণ লিখুন...' :
                activeTab === 'viral-seo' ? 'আপনার ভিডিওর টপিক বা ধারণা লিখুন (টাইটেল ও ট্যাগের জন্য)...' :
                activeTab === 'summarizer' ? 'যে বিষয়টি সংক্ষেপে জানতে চান তা লিখুন...' :
                'NAIM AI-কে যেকোনো প্রশ্ন বা নির্দেশনা দিন...'
              }
              className="flex-1 bg-slate-900 border border-slate-700/80 focus:border-cyan-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none transition shadow-inner font-medium"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !prompt.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition active:scale-95 disabled:opacity-40 cursor-pointer"
            >
              <span>পাঠান</span>
              <Send className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      </div>

      {/* Integration Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {onNavigateToDownloader && (
          <div 
            onClick={onNavigateToDownloader}
            className="cursor-pointer p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">ভিডিও ডাউনলোডার</h4>
                <p className="text-xs text-slate-400">YouTube, TikTok, Facebook 4K ভিডিও ডাউনলোড</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition" />
          </div>
        )}

        {onNavigateToLove && (
          <div 
            onClick={onNavigateToLove}
            className="cursor-pointer p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-pink-500/40 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-pink-950 border border-pink-500/30 text-pink-400 group-hover:scale-110 transition">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">লাভ লিংক জেনারেটর</h4>
                <p className="text-xs text-slate-400">রোমান্টিক সারপ্রাইজ পেজ তৈরি করুন</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition" />
          </div>
        )}
      </div>
    </div>
  );
};
