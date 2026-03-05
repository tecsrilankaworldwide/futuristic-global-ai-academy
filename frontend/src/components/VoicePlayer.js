import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

const VOICE_MAPPINGS = {
  'en': ['en-US', 'en-GB', 'en'],
  'ta': ['ta-IN', 'ta'],
  'si': ['si-LK', 'si'],
  'hi': ['hi-IN', 'hi'],
  'ms': ['ms-MY', 'ms'],
  'tl': ['fil-PH', 'fil', 'tl'],
  'zh': ['zh-CN', 'zh'],
  'th': ['th-TH', 'th'],
  'ur': ['ur-PK', 'ur'],
  'bn': ['bn-IN', 'bn-BD', 'bn'],
  'zh-TW': ['zh-TW', 'zh-HK'],
  'ko': ['ko-KR', 'ko'],
  'ja': ['ja-JP', 'ja']
};

const LANG_NAMES = {
  'en': 'English',
  'ta': 'Tamil',
  'si': 'Sinhala',
  'hi': 'Hindi',
  'ms': 'Malay',
  'tl': 'Filipino',
  'zh': 'Chinese',
  'th': 'Thai',
  'ur': 'Urdu',
  'bn': 'Bengali',
  'zh-TW': 'Traditional Chinese',
  'ko': 'Korean',
  'ja': 'Japanese'
};

export default function VoicePlayer({ text, translatedText, className }) {
  const { i18n, t } = useTranslation();
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [speakingLang, setSpeakingLang] = useState('');
  const synthRef = useRef(null);

  // Load available voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSupported(false);
      return;
    }

    synthRef.current = window.speechSynthesis;

    const loadVoices = () => {
      const voices = synthRef.current.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    // Voices load async in some browsers
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }
    // Retry after a short delay for browsers that load voices lazily
    setTimeout(loadVoices, 500);
    setTimeout(loadVoices, 1500);
  }, []);

  // Find the best voice for a language
  const findVoice = useCallback((langCode) => {
    if (availableVoices.length === 0) return null;
    
    const mappings = VOICE_MAPPINGS[langCode] || [langCode];
    
    // Try exact match first
    for (const mapping of mappings) {
      const voice = availableVoices.find(v => v.lang === mapping);
      if (voice) return voice;
    }
    
    // Try partial match (starts with)
    for (const mapping of mappings) {
      const prefix = mapping.split('-')[0];
      const voice = availableVoices.find(v => v.lang.startsWith(prefix));
      if (voice) return voice;
    }
    
    return null;
  }, [availableVoices]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setSpeaking(false);
    setSpeakingLang('');
  }, []);

  const speakText = useCallback((textToSpeak, langCode) => {
    if (!synthRef.current || !textToSpeak) return;

    // Stop any current speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Find a voice for the language
    const voice = findVoice(langCode);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      // Set the language even without a specific voice - browser may still handle it
      const mappings = VOICE_MAPPINGS[langCode] || [langCode];
      utterance.lang = mappings[0];
    }

    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setSpeaking(false);
      setSpeakingLang('');
    };
    
    utterance.onerror = (event) => {
      console.error('Speech error:', event.error);
      setSpeaking(false);
      setSpeakingLang('');
    };

    setSpeaking(true);
    setSpeakingLang(langCode);
    synthRef.current.speak(utterance);
  }, [findVoice]);

  const handleSpeak = useCallback(() => {
    if (speaking) {
      stopSpeaking();
      return;
    }

    const currentLang = i18n.language;
    const textToSpeak = translatedText || text;
    
    if (currentLang === 'en') {
      // Just speak English
      speakText(textToSpeak, 'en');
    } else {
      // Speak in selected language first, then English
      // Check if voice is available for selected language
      const voice = findVoice(currentLang);
      
      if (voice) {
        // Speak in selected language
        speakText(textToSpeak, currentLang);
      } else {
        // Fallback: try speaking with the language tag anyway (browser may still support it)
        speakText(textToSpeak, currentLang);
      }
    }
  }, [speaking, i18n.language, text, translatedText, speakText, stopSpeaking, findVoice]);

  // Speak in both languages: selected language first, then English
  const handleSpeakBilingual = useCallback(() => {
    if (speaking) {
      stopSpeaking();
      return;
    }

    const currentLang = i18n.language;
    if (currentLang === 'en') {
      speakText(text, 'en');
      return;
    }

    const textToSpeak = translatedText || text;
    
    // First speak in selected language
    if (synthRef.current) synthRef.current.cancel();
    
    const utterance1 = new SpeechSynthesisUtterance(textToSpeak);
    const voice1 = findVoice(currentLang);
    if (voice1) {
      utterance1.voice = voice1;
      utterance1.lang = voice1.lang;
    } else {
      const mappings = VOICE_MAPPINGS[currentLang] || [currentLang];
      utterance1.lang = mappings[0];
    }
    utterance1.rate = 0.85;
    utterance1.pitch = 1.0;

    // Then speak in English
    const utterance2 = new SpeechSynthesisUtterance(text);
    const voice2 = findVoice('en');
    if (voice2) {
      utterance2.voice = voice2;
      utterance2.lang = voice2.lang;
    } else {
      utterance2.lang = 'en-US';
    }
    utterance2.rate = 0.85;
    utterance2.pitch = 1.0;

    utterance1.onend = () => {
      setSpeakingLang('en');
      synthRef.current.speak(utterance2);
    };
    
    utterance2.onend = () => {
      setSpeaking(false);
      setSpeakingLang('');
    };

    utterance1.onerror = () => {
      // If first language fails, try English
      setSpeakingLang('en');
      synthRef.current.speak(utterance2);
    };
    
    utterance2.onerror = () => {
      setSpeaking(false);
      setSpeakingLang('');
    };

    setSpeaking(true);
    setSpeakingLang(currentLang);
    synthRef.current.speak(utterance1);
  }, [speaking, i18n.language, text, translatedText, speakText, stopSpeaking, findVoice]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  if (!supported) return null;

  const currentLang = i18n.language;
  const langName = LANG_NAMES[currentLang] || currentLang;
  const isNonEnglish = currentLang !== 'en';

  return (
    <div className={`flex items-center gap-1 ${className || ''}`}>
      {/* Main listen button - speaks in selected language */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSpeak}
        className="gap-2"
        data-testid="voice-play-button"
      >
        {speaking && speakingLang !== 'en' ? (
          <>
            <VolumeX className="h-4 w-4 animate-pulse" />
            <span className="text-xs">{langName}...</span>
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4" />
            <span className="text-xs">{isNonEnglish ? langName : 'Listen'}</span>
          </>
        )}
      </Button>

      {/* Bilingual button - speaks in both languages when non-English */}
      {isNonEnglish && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSpeakBilingual}
          className="gap-1"
          data-testid="voice-bilingual-button"
          title={`Listen in ${langName} + English`}
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs">{langName} + EN</span>
        </Button>
      )}
    </div>
  );
}
