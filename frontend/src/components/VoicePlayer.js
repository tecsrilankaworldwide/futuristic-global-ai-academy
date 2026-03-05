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

    // Speak ONLY in selected language
    const selectedLang = VOICE_MAPPINGS[i18n.language] || 'en-US';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang;
    utterance.rate = 0.85;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => {
      setSpeaking(false);
      console.error('Speech synthesis error');
    };

    window.speechSynthesis.speak(utterance);
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
          🔊 Listen
        </>
      )}
    </Button>
  );
}
