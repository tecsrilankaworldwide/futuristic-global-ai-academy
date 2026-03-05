import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
  { code: 'zh', name: '简体中文', flag: '🇨🇳' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' }
];

export default function LanguageSelector({ compact = false }) {
  const { i18n } = useTranslation();

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={compact ? "sm" : "default"}
          className="gap-2"
          data-testid="language-selector-button"
        >
          <Globe className="h-4 w-4" />
          {!compact && <span>{currentLang.flag} {currentLang.name}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="flex items-center gap-2 cursor-pointer"
            data-testid={`language-option-${lang.code}`}
          >
            <span className="text-xl">{lang.flag}</span>
            <span>{lang.name}</span>
            {i18n.language === lang.code && <Check className="ml-auto h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
