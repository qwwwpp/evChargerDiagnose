import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const LanguageSelector: React.FC = () => {
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
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center text-slate-600 hover:text-slate-900 focus:outline-none">
        <Globe className="h-5 w-5 mr-1" />
        <span className="hidden md:inline-block">{t('nav.language')}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
  );
};

export default LanguageSelector;