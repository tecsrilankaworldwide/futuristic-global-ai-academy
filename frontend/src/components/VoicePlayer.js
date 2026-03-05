import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

const VOICE_MAPPINGS = {
  'en': 'en-US',
  'ta': 'ta-IN',
  'si': 'si-LK',
  'hi': 'hi-IN',
  'ms': 'ms-MY',
  'tl': 'fil-PH',
  'zh': 'zh-CN',
  'th': 'th-TH',
  'ur': 'ur-PK',
  'bn': 'bn-IN',
  'zh-TW': 'zh-TW',
  'ko': 'ko-KR',
  'ja': 'ja-JP'
};

export default function VoicePlayer({ text, className }) {
  const { i18n } = useTranslation();
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSupported(false);
    }
  }, []);

  const speak = () => {
    if (!supported || !text) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    if (speaking) {
      setSpeaking(false);
      return;
    }

    setSpeaking(true);

    // First: Speak in selected language
    const selectedLang = VOICE_MAPPINGS[i18n.language] || 'en-US';
    const utterance1 = new SpeechSynthesisUtterance(text);
    utterance1.lang = selectedLang;
    utterance1.rate = 0.85;
    utterance1.pitch = 1.0;

    utterance1.onend = () => {
      // Small pause, then speak in English
      setTimeout(() => {
        if (selectedLang !== 'en-US' && selectedLang !== 'en-GB') {
          const utterance2 = new SpeechSynthesisUtterance(text);
          utterance2.lang = 'en-US';
          utterance2.rate = 0.85;
          utterance2.pitch = 1.0;

          utterance2.onend = () => setSpeaking(false);
          utterance2.onerror = () => setSpeaking(false);

          window.speechSynthesis.speak(utterance2);
        } else {
          setSpeaking(false);
        }
      }, 800); // 800ms pause between languages
    };

    utterance1.onerror = () => {
      setSpeaking(false);
      console.error('Speech synthesis error');
    };

    window.speechSynthesis.speak(utterance1);
  };

  if (!supported) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={speak}
      className={className}
      data-testid="voice-play-button"
    >
      {speaking ? (
        <>
          <VolumeX className="h-4 w-4 mr-2 animate-pulse" />
          Playing...
        </>
      ) : (
        <>
          <Volume2 className="h-4 w-4 mr-2" />
          🔊 Listen ({i18n.language === 'en' ? 'English' : 'Bilingual'})
        </>
      )}
    </Button>
  );
}
