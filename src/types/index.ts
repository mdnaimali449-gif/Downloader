export type ViewType = 'home' | 'downloader' | 'generator' | 'letter' | 'ai-tools' | 'developer' | 'admin';

export interface DeveloperSettings {
  facebookUrl: string;
  tiktokHandle: string;
  telegramUsername: string;
  telegramChannelUrl: string;
  whatsappNumber: string;
  siteName: string;
  announcementText: string;
}

export interface LoveProject {
  id: string;
  title: string;
  banglaTitle: string;
  description: string;
  baseUrl: string;
  category: 'romantic' | 'apology' | 'proposal';
  previewBadge: string;
}

export interface VideoInfo {
  id: string;
  platform: 'youtube' | 'facebook' | 'tiktok' | 'instagram' | 'unknown';
  title: string;
  thumbnail: string;
  duration?: string;
  author?: string;
  originalUrl: string;
  qualities: {
    label: string;
    resolution: string;
    format: string;
    size?: string;
    downloadUrl: string;
    itag?: number;
    type: 'video' | 'audio';
  }[];
}

export interface UserSession {
  isLoggedIn: boolean;
  username: string;
  email?: string;
  avatarUrl?: string;
}
