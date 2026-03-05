import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from './ui/button';

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
  const [open, setOpen] = React.useState(false);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size={compact ? "sm" : "default"}
        onClick={() => setOpen(!open)}
        className="gap-2"
        data-testid="language-selector-button"
      >
        <Globe className="h-4 w-4" />
        {!compact && <span>{currentLang.flag} {currentLang.name}</span>}
      </Button>
      
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50 max-h-80 overflow-y-auto">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2"
              data-testid={`language-option-${lang.code}`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span>{lang.name}</span>
              {i18n.language === lang.code && <span className="ml-auto text-primary">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
