import React, { useState, useEffect } from 'react';
import { ViewType, DeveloperSettings, UserSession } from './types';
import { getStoredSettings, saveStoredSettings } from './utils/config';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { DownloaderView } from './components/DownloaderView';
import { ProjectGeneratorView } from './components/ProjectGeneratorView';
import { LoveLetterView } from './components/LoveLetterView';
import { DeveloperView } from './components/DeveloperView';
import { AdminView } from './components/AdminView';
import { AdminModal } from './components/AdminModal';
import { AiToolsView } from './components/AiToolsView';
import { Footer } from './components/Footer';
import { UserAuthModal } from './components/UserAuthModal';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [settings, setSettings] = useState<DeveloperSettings>(getStoredSettings());
  const [userSession, setUserSession] = useState<UserSession>({
    isLoggedIn: false,
    username: 'Guest User'
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // URL listener to support `naimpro` or `naim` at the end of the link (e.g. /#naimpro, /naimpro, #naim)
  useEffect(() => {
    const handleUrlRoute = () => {
      const href = window.location.href.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      // Check if URL ends with or includes naimpro or naim
      const isNaimProRoute = 
        hash.includes('naimpro') || 
        path.endsWith('/naimpro') || 
        path.endsWith('naimpro') || 
        href.endsWith('naimpro') ||
        search.includes('naimpro') ||
        hash === '#naim' || 
        hash === '#/naim' || 
        hash.includes('naim') ||
        path.endsWith('/naim') || 
        path.endsWith('naim');

      if (isNaimProRoute) {
        setIsAdminModalOpen(true);
      } else if (hash === '#downloader') {
        setCurrentView('downloader');
      } else if (
        hash.startsWith('#love') || 
        hash.startsWith('#/love') || 
        path.endsWith('/love') || 
        hash.startsWith('#letter') || 
        hash.startsWith('#/letter') || 
        path.endsWith('/letter')
      ) {
        setCurrentView('letter');
      } else if (hash === '#generator' || hash === '#projects' || hash === '#sites') {
        setCurrentView('generator');
      } else if (hash === '#ai' || hash === '#ai-tools') {
        setCurrentView('ai-tools');
      } else if (hash === '#developer') {
        setCurrentView('developer');
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('hashchange', handleUrlRoute);

    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('hashchange', handleUrlRoute);
    };
  }, []);

  const handleNavigate = (view: ViewType) => {
    if (view === 'admin') {
      setIsAdminModalOpen(true);
      window.location.hash = 'naimpro';
      return;
    }

    setCurrentView(view);
    // Update hash cleanly for bookmarking and history navigation
    if (view === 'letter') {
      window.location.hash = 'love';
    } else if (view === 'generator') {
      window.location.hash = 'generator';
    } else if (view === 'home') {
      window.location.hash = '';
    } else {
      window.location.hash = view;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseAdminModal = () => {
    setIsAdminModalOpen(false);
    // Clean up hash if it has naimpro or naim without reloading
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('naim')) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleUpdateSettings = (newSettings: DeveloperSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Background futuristic glow ambient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-[128px]"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[140px]"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-[130px]"></div>
      </div>

      {/* Responsive Top Navigation Bar */}
      <div className="relative z-20">
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          userSession={userSession}
          onToggleUserAuthModal={() => setIsAuthModalOpen(true)}
          siteName={settings.siteName}
        />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1">
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            settings={settings}
          />
        )}

        {currentView === 'downloader' && (
          <DownloaderView />
        )}

        {currentView === 'generator' && (
          <ProjectGeneratorView />
        )}

        {currentView === 'letter' && (
          <LoveLetterView
            onNavigateHome={() => handleNavigate('home')}
            onNavigateProjects={() => handleNavigate('generator')}
          />
        )}

        {currentView === 'ai-tools' && (
          <AiToolsView
            onNavigateToLove={() => handleNavigate('generator')}
            onNavigateToDownloader={() => handleNavigate('downloader')}
          />
        )}

        {currentView === 'developer' && (
          <DeveloperView
            settings={settings}
            onOpenAdmin={() => handleNavigate('admin')}
          />
        )}

        {currentView === 'admin' && (
          <AdminView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Responsive Footer */}
      <div className="relative z-20">
        <Footer
          onNavigate={handleNavigate}
          settings={settings}
        />
      </div>

      {/* Dedicated Admin Panel Popup Modal (Activated on #naimpro or #naim) */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={handleCloseAdminModal}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Separate User Auth Modal */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        userSession={userSession}
        onUpdateUserSession={setUserSession}
      />
    </div>
  );
}
