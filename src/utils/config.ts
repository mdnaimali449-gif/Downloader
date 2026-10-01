import { DeveloperSettings, LoveProject } from '../types';

export const DEFAULT_SETTINGS: DeveloperSettings = {
  facebookUrl: 'https://www.facebook.com/NAHIDULISLAMNAIM0',
  tiktokHandle: 'itznobita2.0',
  telegramUsername: '@NOBITA10N',
  telegramChannelUrl: 'https://t.me/NOBITA_INCOME_ZOME',
  whatsappNumber: '01710498589',
  siteName: 'NAIM VIDEO DOWNLOADER',
  announcementText: '✨ সর্বাধুনিক আল্ট্রা-ফাস্ট ভিডিও ডাউনলোডার ও প্রোজেক্ট লিংক জেনারেটর প্ল্যাটফর্মে স্বাগতম!'
};

export const LOVE_PROJECTS: LoveProject[] = [
  {
    id: 'proposal',
    title: 'Romantic Proposal Website',
    banglaTitle: 'প্রপোজাল ওয়েবসাইট',
    description: 'মনের ভালোবাসার কথা প্রকাশ করার জন্য একটি চমৎকার ইন্টারঅ্যাক্টিভ ওয়েব পেজ।',
    baseUrl: 'https://iloveyout.netlify.app/',
    category: 'proposal',
    previewBadge: '💖 Most Popular'
  },
  {
    id: 'love-effect',
    title: 'I Love You Heart Effect',
    banglaTitle: 'আই লাভ ইউ স্পেশাল ইফেক্ট',
    description: 'হার্ট অ্যানিমেশন ও রোমান্টিক মিউজিক সহ লাভ ইফেক্ট সারপ্রাইজ পেজ।',
    baseUrl: 'https://loveyoueffect.netlify.app/',
    category: 'romantic',
    previewBadge: '✨ Animated'
  },
  {
    id: 'sorry-priyo',
    title: 'Sorry Priyo Love Website',
    banglaTitle: 'সরি প্রিয় - মানভঞ্জন সাইট',
    description: 'প্রিয় মানুষের রাগ ভাঙানোর জন্য মিষ্টি ও আবেগঘন সরি মেসেজ সাইট।',
    baseUrl: 'https://6a1ef8b64ec9399249e089b9--sorrymylove0.netlify.app/',
    category: 'apology',
    previewBadge: '🥺 Heartfelt'
  },
  {
    id: 'love-143',
    title: 'I Love You Jan 143',
    banglaTitle: 'আই লাভ ইউ জান ১৪৩',
    description: 'ভালোবাসার মানুষকে বিশেষ অনুভূতি প্রকাশ করার জন্য আকর্ষণীয় ওয়েবসাইট।',
    baseUrl: 'https://loveyoujan143.netlify.app/',
    category: 'romantic',
    previewBadge: '🔥 Special 143'
  }
];

export function getStoredSettings(): DeveloperSettings {
  try {
    const raw = localStorage.getItem('naim_dev_settings');
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // fallback to default
  }
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(settings: DeveloperSettings): void {
  try {
    localStorage.setItem('naim_dev_settings', JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}
