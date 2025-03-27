import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function MobileNavigation() {
  const [location] = useLocation();
  const { t, i18n } = useTranslation();
  
  const languages = [
    { code: 'en', name: t('lang.en') },
    { code: 'zh', name: t('lang.zh') },
    { code: 'ja', name: t('lang.ja') },
    { code: 'de', name: t('lang.de') },
    { code: 'es', name: t('lang.es') }
  ];
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="md:hidden bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="flex justify-around">
        <Link href="/tickets">
          <button className={`py-3 flex flex-col items-center justify-center ${location === '/tickets' || location === '/' ? 'text-teal-700' : 'text-slate-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span className="text-xs mt-1">{t('nav.tickets')}</span>
          </button>
        </Link>
        
        <Link href="/dashboard">
          <button className={`py-3 flex flex-col items-center justify-center ${location === '/dashboard' ? 'text-teal-700' : 'text-slate-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span className="text-xs mt-1">{t('nav.dashboard')}</span>
          </button>
        </Link>
        
        <Link href="/new-ticket">
          <button className="py-3 flex flex-col items-center justify-center text-slate-500">
            <div className="bg-teal-700 text-white p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <span className="text-xs mt-1">{t('tickets.newTicket')}</span>
          </button>
        </Link>
        
        <Link href="/knowledge-base">
          <button className={`py-3 flex flex-col items-center justify-center ${location === '/knowledge-base' ? 'text-teal-700' : 'text-slate-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span className="text-xs mt-1">{t('nav.knowledgeBase')}</span>
          </button>
        </Link>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="py-3 flex flex-col items-center justify-center text-slate-500">
            <Globe className="h-5 w-5" />
            <span className="text-xs mt-1">{t('nav.language')}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mb-16">
            {languages.map((lang) => (
              <DropdownMenuItem 
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={i18n.language === lang.code ? "bg-slate-100 font-medium" : ""}
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
