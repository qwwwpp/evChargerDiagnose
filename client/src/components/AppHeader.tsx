import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

interface User {
  name: string;
  initials: string;
}

interface AppHeaderProps {
  user: User;
}

export default function AppHeader({ user }: AppHeaderProps) {
  const [location] = useLocation();
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="text-teal-700 font-bold text-xl cursor-pointer">{t('app.title')}</span>
            </Link>
          </div>
          <nav className="hidden md:ml-8 md:flex md:space-x-8">
            <Link href="/tickets">
              <span className={`${location === '/tickets' || location === '/' ? 'border-teal-700 text-teal-700' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'} border-b-2 px-1 pt-1 text-sm font-medium cursor-pointer`}>
                {t('nav.tickets')}
              </span>
            </Link>
            <Link href="/dashboard">
              <span className={`${location === '/dashboard' ? 'border-teal-700 text-teal-700' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'} border-b-2 px-1 pt-1 text-sm font-medium cursor-pointer`}>
                {t('nav.dashboard')}
              </span>
            </Link>
            <Link href="/knowledge-base">
              <span className={`${location === '/knowledge-base' ? 'border-teal-700 text-teal-700' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'} border-b-2 px-1 pt-1 text-sm font-medium cursor-pointer`}>
                {t('nav.knowledgeBase')}
              </span>
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="md:hidden text-slate-600 hover:text-slate-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <div className="hidden md:flex items-center">
              <div className="relative">
                <button className="flex items-center text-slate-600 hover:text-slate-900">
                  <span className="mr-2 text-sm">{user.name}</span>
                  <div className="h-8 w-8 rounded-full bg-teal-700 flex items-center justify-center text-white">
                    {user.initials}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
